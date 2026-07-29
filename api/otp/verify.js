const { handleOtpVerify } = require('../_lib/otpHandler');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: 'Method not allowed.' });
      return;
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        res.status(400).json({ success: false, error: 'Malformed JSON request body.' });
        return;
      }
    }

    const result = await handleOtpVerify(body || {}, clientIp);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error('[API_OTP_VERIFY_CRASH]', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Unexpected server error while verifying code.',
    });
  }
};
