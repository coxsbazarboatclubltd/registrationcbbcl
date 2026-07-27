import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const steps: string[] = [];
  try {
    steps.push('start');
    await import('./_lib/resend');
    steps.push('own-resend-wrapper-imported');
    await import('./_lib/escapeHtml');
    steps.push('own-escapeHtml-imported');
    await import('./_lib/emailService');
    steps.push('own-emailService-imported');
    await import('./_lib/submissionHandler');
    steps.push('own-submissionHandler-imported');
    res.status(200).json({ ok: true, steps, nodeVersion: process.version });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      steps,
      message: error?.message,
      stack: error?.stack,
      nodeVersion: process.version,
    });
  }
}
