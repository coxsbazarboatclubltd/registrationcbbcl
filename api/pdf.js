const { renderPdfFromHtml } = require('./_lib/renderPdf');
const { verifySessionToken } = require('./_lib/otpStore');

/**
 * POST /api/pdf — prints the client's page snapshot to a vector A4 PDF.
 * Restricted to applicants with a verified email session, since each call
 * launches a headless browser.
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ success: false, error: 'Malformed JSON request body.' });
      return;
    }
  }

  const { html, otpSessionToken } = body || {};
  if (!verifySessionToken(otpSessionToken)) {
    res.status(403).json({ success: false, error: 'Email verification session is missing or has expired.' });
    return;
  }

  try {
    const pdf = await renderPdfFromHtml(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(pdf);
  } catch (error) {
    console.error('[PDF_RENDER_FAILED]', error);
    res.status(500).json({ success: false, error: error?.message || 'PDF rendering failed.' });
  }
};
