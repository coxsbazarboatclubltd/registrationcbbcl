import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const steps: string[] = [];
  try {
    steps.push('start');
    const { Resend } = await import('resend');
    steps.push('resend-imported');
    const client = new Resend('re_test_dummy');
    steps.push('resend-constructed');
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
