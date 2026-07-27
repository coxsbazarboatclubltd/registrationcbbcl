import type { VercelRequest, VercelResponse } from '@vercel/node';
import { trivialValue } from './_lib/trivial';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, trivialValue });
}
