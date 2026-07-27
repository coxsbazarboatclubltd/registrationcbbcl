import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSubmission } from '../server/services/submissionHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: 'Method not allowed.' });
      return;
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    // Vercel only auto-parses JSON bodies when Content-Type matches exactly;
    // fall back to manual parsing so an unexpected content-type doesn't crash us.
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        res.status(400).json({ success: false, error: 'Malformed JSON request body.' });
        return;
      }
    }

    const result = await handleSubmission(body || {}, clientIp);
    res.status(result.status).json(result.body);
  } catch (error: any) {
    // Surface the real failure instead of letting Vercel's platform 500
    // handler return a non-JSON error page (which the client then reports
    // as an opaque "Server responded with HTTP 500").
    console.error('[API_SUBMIT_CRASH]', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Unexpected server error while processing submission.',
    });
  }
}
