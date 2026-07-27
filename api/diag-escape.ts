import type { VercelRequest, VercelResponse } from '@vercel/node';
import { escapeHtml } from './_lib/escapeHtml';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, has: typeof escapeHtml });
}
