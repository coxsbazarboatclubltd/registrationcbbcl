/**
 * Regenerates the hand-fillable blank application form served at
 * /forms/CBBCL-Membership-Application-Form.pdf.
 *
 * Re-run after ANY change to the form pages so the paper version matches:
 *   1. npm run dev            (in one terminal)
 *   2. npm run blank-form     (in another)
 *
 * It opens the dev server in headless Chrome, asks the app (dev-only hook
 * window.__cbbclBlankFormSnapshot) to render all seven pages with no data,
 * and prints that snapshot with the same renderer as /api/pdf.
 */
const fs = require('fs');
const path = require('path');
const { renderPdfFromHtml } = require('../api/_lib/renderPdf');

const DEV_URL = process.env.DEV_URL || 'http://localhost:3000/';
const OUT_FILE = path.join(__dirname, '..', 'public', 'forms', 'CBBCL-Membership-Application-Form.pdf');

(async () => {
  const { default: puppeteer } = await import('puppeteer-core');
  const executablePath =
    process.env.CHROME_PATH ||
    [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/usr/bin/google-chrome',
    ].find((p) => fs.existsSync(p));
  if (!executablePath) throw new Error('Chrome not found — set CHROME_PATH.');

  const browser = await puppeteer.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await page.goto(DEV_URL, { waitUntil: 'networkidle0' });
    // Past the email gate client-side; no data is entered or submitted.
    await page.evaluate(() =>
      localStorage.setItem('cbbc_otp_session_v1', JSON.stringify({ email: 'blank-form@local', token: 'blank-form' }))
    );
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForFunction(() => typeof window.__cbbclBlankFormSnapshot === 'function' && document.querySelector('.tab-btn'), {
      timeout: 30000,
    });
    await page.evaluate(() => document.fonts.ready);
    const html = await page.evaluate(() => window.__cbbclBlankFormSnapshot());

    const pdf = await renderPdfFromHtml(html);
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, pdf);
    console.log(`Blank form written: ${path.relative(process.cwd(), OUT_FILE)} (${Math.round(pdf.length / 1024)} KB)`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error('Blank form generation failed:', err.message);
  process.exit(1);
});
