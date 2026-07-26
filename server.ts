import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { sendApplicationEmails } from './server/services/emailService';

const app = express();
const PORT = 3000;

// Derive __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Increase JSON body payload size limit to support PDF base64 data URIs
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Simple In-Memory Rate Limiter (Max 5 submissions per 15 mins per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, retryAfterMs: record.resetTime - now };
  }

  record.count += 1;
  return { allowed: true };
}

// Target Membership Office Email
const DEFAULT_OFFICE_EMAIL = 'membership@coxsbazarboatclubltd.com';

/**
 * Health check route
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    turnstileConfigured: Boolean(process.env.TURNSTILE_SECRET_KEY),
  });
});

/**
 * POST /api/submit - Serverless Function Endpoint for Application Submissions
 */
app.post('/api/submit', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  // 1. Rate Limiting Check
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    console.warn(`[RATE_LIMIT_EXCEEDED] IP: ${clientIp} exceeded submission limit.`);
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait 15 minutes before submitting another application.',
    });
    return;
  }

  const {
    data,
    refNo,
    docNo,
    submissionDate,
    pdfBase64,
    turnstileToken,
  } = req.body || {};

  // 2. Validate input data
  if (!data || !data.candidateName || !data.email) {
    res.status(400).json({
      success: false,
      error: 'Invalid request: Candidate name and email address are required.',
    });
    return;
  }

  const referenceNumber = refNo || `CBBCL-${new Date().getFullYear()}-000001`;
  const formattedCategory = (data.membershipCategory || 'Permanent').toUpperCase() + ' MEMBERSHIP';
  const officeEmail = process.env.MEMBERSHIP_EMAIL || process.env.MEMBERSHIP_OFFICE_EMAIL || DEFAULT_OFFICE_EMAIL;

  // 3. Bot Protection via Cloudflare Turnstile (if secret key configured)
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && turnstileSecret.trim() !== '') {
    if (!turnstileToken) {
      res.status(403).json({
        success: false,
        error: 'Bot verification token missing. Please complete the security challenge.',
      });
      return;
    }

    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: clientIp,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.warn(`[TURNSTILE_FAILED] IP: ${clientIp} Ref: ${referenceNumber}`);
        res.status(403).json({
          success: false,
          error: 'Bot protection check failed. Please refresh and try again.',
        });
        return;
      }
    } catch (turnstileErr) {
      console.error('[TURNSTILE_VERIFY_ERROR]', turnstileErr);
    }
  }

  // Log submission event (NO PII logged)
  console.log(`[SUBMISSION_RECEIVED] Timestamp: ${new Date().toISOString()} | RefNo: ${referenceNumber}`);

  // 4. Send Emails via Resend
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey || resendApiKey.trim() === '') {
    console.warn(`[RESEND_NOT_CONFIGURED] RefNo: ${referenceNumber}. Simulating successful delivery.`);
    res.json({
      success: true,
      referenceNumber,
      submissionDate: submissionDate || new Date().toISOString().split('T')[0],
      membershipType: formattedCategory,
      message: 'Application received successfully (Development Simulation Mode).',
      note: 'Please set RESEND_API_KEY in server environment to enable real email transmission.',
    });
    return;
  }

  try {
    const fromName = process.env.FROM_NAME || "Cox's Bazar Boat Club";
    const fromEmail = process.env.FROM_EMAIL || "no-reply@coxsbazarboatclubltd.com";

    const { officeResult, applicantResult } = await sendApplicationEmails({
      resendApiKey,
      fromName,
      fromEmail,
      officeEmail,
      referenceNumber,
      documentNumber: docNo || 'N/A',
      submissionDate: submissionDate || new Date().toISOString().split('T')[0],
      data,
      pdfBase64,
    });

    // Check if at least one email was sent or if both failed
    if (officeResult.error && applicantResult.error) {
      const combinedError = officeResult.error.message || applicantResult.error.message || 'Resend validation error.';
      res.status(400).json({
        success: false,
        error: `Resend API Error: ${combinedError}. Please check verified domains or sender address in Resend dashboard.`,
      });
      return;
    }

    res.json({
      success: true,
      referenceNumber,
      submissionDate: submissionDate || new Date().toISOString().split('T')[0],
      membershipType: formattedCategory,
      message: 'Application submitted and emails dispatched successfully.',
    });
  } catch (error: any) {
    console.error(`[SUBMISSION_ERROR] RefNo: ${referenceNumber}`, error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to dispatch email via Resend.',
    });
  }
});

// Setup Vite or static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CBBC_SERVER] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
