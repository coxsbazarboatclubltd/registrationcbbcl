import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSubmission } from './_lib/submissionHandler';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, has: typeof handleSubmission });
}
