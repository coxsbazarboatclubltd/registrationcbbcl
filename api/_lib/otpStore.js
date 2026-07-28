const crypto = require('crypto');

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPTS = 5;
const REQUEST_COOLDOWN_MS = 60 * 1000; // 1 min between resend requests per email
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

// Best-effort only: on serverless platforms this map is scoped to a single
// warm function instance and is not shared across concurrent instances.
const otpMap = new Map(); // normalizedEmail -> { codeHash, expiresAt, attempts, lastSentAt }

function getSecret() {
  return process.env.OTP_TOKEN_SECRET || process.env.RESEND_API_KEY || 'cbbcl-otp-dev-secret';
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function hashCode(normalizedEmail, code) {
  return crypto.createHmac('sha256', getSecret()).update(`${normalizedEmail}:${code}`).digest('hex');
}

function generateOtp(email) {
  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();
  const existing = otpMap.get(normalizedEmail);

  if (existing && now - existing.lastSentAt < REQUEST_COOLDOWN_MS) {
    return { throttled: true, retryAfterMs: REQUEST_COOLDOWN_MS - (now - existing.lastSentAt) };
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  otpMap.set(normalizedEmail, {
    codeHash: hashCode(normalizedEmail, code),
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: now,
  });

  return { throttled: false, code };
}

function verifyOtp(email, code) {
  const normalizedEmail = normalizeEmail(email);
  const record = otpMap.get(normalizedEmail);

  if (!record) {
    return { success: false, error: 'No verification code was requested for this email. Please request a new code.' };
  }
  if (Date.now() > record.expiresAt) {
    otpMap.delete(normalizedEmail);
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    otpMap.delete(normalizedEmail);
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  record.attempts += 1;

  if (hashCode(normalizedEmail, code) !== record.codeHash) {
    return { success: false, error: 'Incorrect verification code.' };
  }

  otpMap.delete(normalizedEmail);
  return { success: true };
}

function issueSessionToken(email) {
  const normalizedEmail = normalizeEmail(email);
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(`${normalizedEmail}|${expiresAt}`).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

function verifySessionToken(token, expectedEmail) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;

  const [payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');

  const sigBuf = Buffer.from(signature || '', 'hex');
  const expectedBuf = Buffer.from(expectedSignature, 'hex');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  const decoded = Buffer.from(payload, 'base64url').toString('utf8');
  const [tokenEmail, expiresAtStr] = decoded.split('|');
  const expiresAt = Number(expiresAtStr);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  if (expectedEmail && tokenEmail !== normalizeEmail(expectedEmail)) return false;

  return true;
}

module.exports = { generateOtp, verifyOtp, issueSessionToken, verifySessionToken };
