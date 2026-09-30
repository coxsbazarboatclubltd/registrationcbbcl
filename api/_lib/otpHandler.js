const { sendOtpEmail } = require('./emailService');
const { generateOtp, verifyOtp, issueSessionToken } = require('./otpStore');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple In-Memory Rate Limiter (Max 10 OTP requests per 15 mins per IP).
// Best-effort only: on serverless platforms this map is scoped to a single
// warm function instance and is not shared across concurrent instances.
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false };
  }

  record.count += 1;
  return { allowed: true };
}

/**
 * Framework-agnostic handler for POST /api/otp/request — shared between the
 * local Express dev server (server.ts) and the Vercel Serverless Function.
 */
async function handleOtpRequest(body, clientIp) {
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    console.warn(`[OTP_RATE_LIMIT_EXCEEDED] IP: ${clientIp}`);
    return {
      status: 429,
      body: { success: false, error: 'Too many verification requests. Please wait 15 minutes before trying again.' },
    };
  }

  const email = String(body?.email || '').trim();
  if (!EMAIL_REGEX.test(email)) {
    return { status: 400, body: { success: false, error: 'Please provide a valid email address.' } };
  }

  const result = generateOtp(email, body?.ticket);
  if (result.throttled) {
    return {
      status: 429,
      body: {
        success: false,
        error: `Please wait ${Math.ceil(result.retryAfterMs / 1000)} seconds before requesting another code.`,
      },
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey || resendApiKey.trim() === '') {
    console.warn(`[OTP_DEV_MODE] Resend not configured. Verification code for ${email}: ${result.code}`);
    return {
      status: 200,
      body: {
        success: true,
        message: 'Verification code generated (Development Simulation Mode — check server logs).',
        devCode: result.code,
        ticket: result.ticket,
      },
    };
  }

  try {
    const fromName = process.env.FROM_NAME || "Cox's Bazar Boat Club";
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@cbbcl.org';

    const sendResult = await sendOtpEmail({ resendApiKey, fromName, fromEmail, toEmail: email, code: result.code });

    if (sendResult.error) {
      return {
        status: 400,
        body: {
          success: false,
          error: `Resend API Error: ${sendResult.error.message || 'Unable to dispatch verification email.'}`,
        },
      };
    }

    return {
      status: 200,
      body: { success: true, message: 'Verification code sent to your email address.', ticket: result.ticket },
    };
  } catch (error) {
    console.error('[OTP_SEND_ERROR]', error);
    return {
      status: 500,
      body: { success: false, error: error?.message || 'Failed to send verification code.' },
    };
  }
}

/**
 * Framework-agnostic handler for POST /api/otp/verify.
 */
async function handleOtpVerify(body, clientIp) {
  const email = String(body?.email || '').trim();
  const code = String(body?.code || '').trim();

  if (!EMAIL_REGEX.test(email) || !/^\d{6}$/.test(code)) {
    return { status: 400, body: { success: false, error: 'Invalid email or verification code format.' } };
  }

  const result = verifyOtp(email, code, body?.ticket);
  if (!result.success) {
    return { status: 400, body: { success: false, error: result.error, ticket: result.ticket } };
  }

  const token = issueSessionToken(email);
  console.log(`[OTP_VERIFIED] IP: ${clientIp}`);
  return { status: 200, body: { success: true, token, email: email.toLowerCase() } };
}

module.exports = { handleOtpRequest, handleOtpVerify };
