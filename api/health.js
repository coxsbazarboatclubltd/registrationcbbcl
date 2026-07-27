module.exports = function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    turnstileConfigured: Boolean(process.env.TURNSTILE_SECRET_KEY),
  });
};
