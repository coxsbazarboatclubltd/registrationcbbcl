/**
 * Renders the application's printable pages to a vector A4 PDF with a real
 * Chromium print engine (the same engine as the browser's "Save as PDF").
 *
 * The browser-side html2canvas approach rasterised each page into a JPEG,
 * which produced blurry text and shifted text baselines (labels overlapping
 * borders, numbers sinking in round badges). Chromium lays the HTML out
 * exactly as on screen and keeps text as real, selectable, zoomable vectors.
 *
 * Input is a self-contained HTML document built by the client
 * (src/utils/pdfSnapshot.ts) — the seven `.page` elements with their current
 * values baked in, plus the app's stylesheet.
 */
const fs = require('fs');

const LOCAL_CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const MAX_HTML_BYTES = 4 * 1024 * 1024;

async function launchBrowser() {
  const puppeteer = require('puppeteer-core');
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const { default: chromium } = await import('@sparticuz/chromium');
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const executablePath = process.env.CHROME_PATH || LOCAL_CHROME_PATHS.find((p) => fs.existsSync(p));
  if (!executablePath) {
    throw new Error('No local Chrome found for PDF rendering. Set CHROME_PATH.');
  }
  return puppeteer.launch({ executablePath, headless: true });
}

async function renderPdfFromHtml(html) {
  if (typeof html !== 'string' || !html.includes('class="page')) {
    throw new Error('Invalid PDF snapshot.');
  }
  if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) {
    throw new Error('PDF snapshot is too large.');
  }

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    // The snapshot is static markup + CSS: drop any scripts, and only allow
    // the web fonts and inline (data:) images it legitimately needs, so a
    // crafted snapshot can't make the server fetch arbitrary URLs.
    const safeHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = request.url();
      const allowed =
        url.startsWith('data:') ||
        url.startsWith('https://fonts.googleapis.com/') ||
        url.startsWith('https://fonts.gstatic.com/');
      if (allowed) request.continue();
      else request.abort();
    });
    await page.setContent(safeHtml, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

module.exports = { renderPdfFromHtml };
