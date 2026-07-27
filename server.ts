import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { handleSubmission } from './api/_lib/submissionHandler.js';

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
