import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSubmission } from '../server/services/submissionHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed.' });
    return;
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const result = await handleSubmission(req.body || {}, clientIp);
  res.status(result.status).json(result.body);
}
