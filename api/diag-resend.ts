import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createResendClient } from './_lib/resend';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, has: typeof createResendClient });
}
