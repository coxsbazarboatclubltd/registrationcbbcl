import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendApplicationEmails } from './_lib/emailService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, has: typeof sendApplicationEmails });
}
