import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import { createServer as createViteServer } from 'vite';

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
    const resend = new Resend(resendApiKey);

    // Configured sender or fallback to onboarding@resend.dev for unverified domains
    const fromName = process.env.FROM_NAME || "Cox's Bazar Boat Club";
    const fromEmail = process.env.FROM_EMAIL || "no-reply@coxsbazarboatclubltd.com";
    const primaryFrom = `${fromName} <${fromEmail}>`;
    const fallbackFrom = `${fromName} <onboarding@resend.dev>`;

    // Prepare PDF Attachment
    const attachments: { filename: string; content: Buffer }[] = [];
    if (pdfBase64) {
      // Strip Data URI header if present
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      const pdfBuffer = Buffer.from(cleanBase64, 'base64');
      attachments.push({
        filename: `${referenceNumber}_Membership_Application.pdf`,
        content: pdfBuffer,
      });
    }

    const nomineeSummary = [
      data.spouseName ? `Spouse: ${data.spouseName}` : null,
      data.child01Name ? `Child 1: ${data.child01Name}` : null,
      data.child02Name ? `Child 2: ${data.child02Name}` : null,
      data.child03Name ? `Child 3: ${data.child03Name}` : null,
    ]
      .filter(Boolean)
      .join('; ') || 'N/A';

    // Helper to send email with automatic fallback if domain is unverified
    const sendWithFallback = async (toEmail: string, subject: string, htmlContent: string) => {
      let sendRes = await resend.emails.send({
        from: primaryFrom,
        to: [toEmail],
        subject,
        html: htmlContent,
        attachments,
      });

      if (sendRes.error) {
        console.warn(`[RESEND_PRIMARY_FAILED] Target: ${toEmail} Error: ${sendRes.error.name} - ${sendRes.error.message}`);
        // If domain validation error, retry with Resend onboarding address
        if (sendRes.error.name === 'validation_error' || sendRes.error.message?.includes('domain') || sendRes.error.message?.includes('verify')) {
          console.log(`[RESEND_RETRYING] Retrying with default onboarding address: ${fallbackFrom}`);
          sendRes = await resend.emails.send({
            from: fallbackFrom,
            to: [toEmail],
            subject,
            html: htmlContent,
            attachments,
          });
        }
      }

      return sendRes;
    };

    // A. Email to Membership Office
    const officeEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1a2744; border: 1px solid #c8c8c8; padding: 24px; border-radius: 8px;">
        <div style="background-color: #1a2744; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: #c4a56a; margin: 0; font-family: Georgia, serif;">COX'S BAZAR BOAT CLUB LTD.</h2>
          <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 1px;">MEMBERSHIP OFFICE APPLICATION NOTIFICATION</p>
        </div>

        <h3 style="color: #1a2744; border-bottom: 2px solid #9d7f46; padding-bottom: 6px;">New Membership Application</h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr><td style="padding: 6px; font-weight: bold; width: 180px;">Reference Number:</td><td style="padding: 6px; color: #0f5132; font-weight: bold;">${referenceNumber}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Submission Date:</td><td style="padding: 6px;">${submissionDate || new Date().toISOString().split('T')[0]}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Membership Category:</td><td style="padding: 6px;">${data.membershipCategory || 'Permanent Member'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Applicant Name:</td><td style="padding: 6px;">${data.title ? data.title.toUpperCase() + ' ' : ''}${data.candidateName}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Email:</td><td style="padding: 6px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Mobile Phone:</td><td style="padding: 6px;">${data.mobile}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">National ID / Passport:</td><td style="padding: 6px;">${data.nid || data.passportNo || 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Present Address:</td><td style="padding: 6px;">${data.presentAddress || 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Occupation:</td><td style="padding: 6px;">${data.designation ? `${data.designation} at ${data.companyName}` : 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Nominees / Family:</td><td style="padding: 6px;">${nomineeSummary}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Reference 1:</td><td style="padding: 6px;">${data.ref1Name ? `${data.ref1Name} (${data.ref1Organization || 'N/A'}, Ph: ${data.ref1Phone || 'N/A'})` : 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Reference 2:</td><td style="padding: 6px;">${data.ref2Name ? `${data.ref2Name} (${data.ref2Organization || 'N/A'}, Ph: ${data.ref2Phone || 'N/A'})` : 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Data Privacy Consent:</td><td style="padding: 6px; color: #0f5132; font-weight: bold;">${data.privacyConsent ? 'ACCEPTED' : 'PENDING'}</td></tr>
        </table>

        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 12px; border-radius: 6px; font-size: 12px; margin-bottom: 20px;">
          <strong>Document Checklist Verification Summary:</strong>
          <ul style="margin: 6px 0 0 0; padding-left: 20px;">
            <li>NID Copy: ${data.docNidCopy ? 'Verified' : 'Pending'} | Passport Copy: ${data.docPassportCopy ? 'Verified' : 'Pending'}</li>
            <li>Passport Photo: ${data.docPassportPhoto ? 'Verified' : 'Pending'} | Family Photo: ${data.docFamilyPhoto ? 'Verified' : 'Pending'}</li>
            <li>Company ID: ${data.docCompanyId ? 'Verified' : 'Pending'} | Utility Bill: ${data.docUtilityBill ? 'Verified' : 'Pending'}</li>
            <li>Applicant Declaration Signed: ${data.docDeclarationSigned ? 'YES' : 'NO'}</li>
          </ul>
        </div>

        <p style="font-size: 13px; color: #555555;">
          The complete application package PDF has been attached to this email for office records and executive committee review.
        </p>
      </div>
    `;

    const officeResult = await sendWithFallback(
      officeEmail,
      `New Membership Application Reference ${referenceNumber}`,
      officeEmailHtml
    );

    if (officeResult.error) {
      console.warn(`[OFFICE_EMAIL_WARNING] Could not dispatch email to office: ${officeResult.error.message}`);
    } else {
      console.log(`[OFFICE_EMAIL_SENT] RefNo: ${referenceNumber} ID: ${officeResult.data?.id}`);
    }

    // B. Confirmation Email to Applicant
    const applicantEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1a2744; border: 1px solid #c8c8c8; padding: 24px; border-radius: 8px;">
        <div style="background-color: #1a2744; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: #c4a56a; margin: 0; font-family: Georgia, serif;">COX'S BAZAR BOAT CLUB LTD.</h2>
          <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1px;">COX'S BAZAR, BANGLADESH</p>
        </div>

        <h3 style="color: #1a2744; border-bottom: 2px solid #9d7f46; padding-bottom: 6px;">Application Received</h3>

        <p>Dear <strong>${data.candidateName}</strong>,</p>

        <p>
          Thank you for applying for membership at <strong>Cox's Bazar Boat Club Ltd.</strong> We have successfully received your registration package.
        </p>

        <div style="background-color: #f4f6f9; border-left: 4px solid #1a2744; padding: 14px; margin: 18px 0; border-radius: 0 6px 6px 0;">
          <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Application Reference Number:</strong> <span style="color: #0f5132; font-weight: bold;">${referenceNumber}</span></p>
          <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Submission Date:</strong> ${submissionDate || new Date().toISOString().split('T')[0]}</p>
          <p style="margin: 0; font-size: 13px;"><strong>Membership Category:</strong> ${formattedCategory}</p>
        </div>

        <p style="font-size: 13px; line-height: 1.6;">
          Our Membership Office is currently reviewing your submitted details and uploaded document checklist. We will contact you via email or phone if any additional information or verification is required.
        </p>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

        <div style="font-size: 12px; color: #666666;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #1a2744;">Membership Secretariat</p>
          <p style="margin: 0 0 2px 0;">Cox's Bazar Boat Club Ltd.</p>
          <p style="margin: 0 0 2px 0;">Email: <a href="mailto:${officeEmail}">${officeEmail}</a></p>
          <p style="margin: 0;">Website: https://coxsbazarboatclubltd.com</p>
        </div>
      </div>
    `;

    const applicantResult = await sendWithFallback(
      data.email,
      `Your Membership Application Has Been Received - ${referenceNumber}`,
      applicantEmailHtml
    );

    if (applicantResult.error) {
      console.warn(`[APPLICANT_EMAIL_WARNING] Could not dispatch email to applicant: ${applicantResult.error.message}`);
    } else {
      console.log(`[APPLICANT_EMAIL_SENT] RefNo: ${referenceNumber} To: ${data.email} ID: ${applicantResult.data?.id}`);
    }

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
