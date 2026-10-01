import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { handleSubmission } from './api/_lib/submissionHandler.js';
import { handleOtpRequest, handleOtpVerify } from './api/_lib/otpHandler.js';
import { renderPdfFromHtml } from './api/_lib/renderPdf.js';
import { verifySessionToken } from './api/_lib/otpStore.js';

const app = express();
const PORT = 3000;

// Derive __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Increase JSON body payload size limit to support PDF base64 data URIs
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

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
 * POST /api/submit - Application submission endpoint (local dev / Node deployments).
 * Shares its logic with the Vercel Serverless Function at api/submit.js via
 * api/_lib/submissionHandler.js.
 */
app.post('/api/submit', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const result = await handleSubmission(req.body || {}, clientIp);
  res.status(result.status).json(result.body);
});

/**
 * POST /api/pdf - Print the page snapshot to a vector PDF (mirrors api/pdf.js).
 */
app.post('/api/pdf', async (req: Request, res: Response): Promise<void> => {
  if (!verifySessionToken(req.body?.otpSessionToken)) {
    res.status(403).json({ success: false, error: 'Email verification session is missing or has expired.' });
    return;
  }
  try {
    const pdf = await renderPdfFromHtml(req.body?.html);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (error: any) {
    console.error('[PDF_RENDER_FAILED]', error);
    res.status(500).json({ success: false, error: error?.message || 'PDF rendering failed.' });
  }
});

/**
 * POST /api/otp/request - Send a one-time verification code to an applicant's email.
 */
app.post('/api/otp/request', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const result = await handleOtpRequest(req.body || {}, clientIp);
  res.status(result.status).json(result.body);
});

/**
 * POST /api/otp/verify - Verify a one-time code and issue a short-lived session token.
 */
app.post('/api/otp/verify', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const result = await handleOtpVerify(req.body || {}, clientIp);
  res.status(result.status).json(result.body);
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
