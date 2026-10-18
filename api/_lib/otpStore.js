const crypto = require('crypto');

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPTS = 5;
const REQUEST_COOLDOWN_MS = 60 * 1000; // 1 min between resend requests per email
// Long enough to fill the form over several sittings (drafts persist); it only
// proves the applicant controls the email address.
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret() {
  return process.env.OTP_TOKEN_SECRET || process.env.RESEND_API_KEY || 'cbbcl-otp-dev-secret';
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function hashCode(normalizedEmail, code) {
  return crypto.createHmac('sha256', getSecret()).update(`${normalizedEmail}:${code}`).digest('hex');
}

// OTP state travels with the client as a signed "ticket" rather than living in
// server memory, since Vercel serverless functions don't share memory across
// instances and the /request and /verify calls can land on different ones.
function signTicket(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(encoded).digest('hex');
  return `${encoded}.${signature}`;
}

function readTicket(ticket) {
  if (!ticket || typeof ticket !== 'string' || !ticket.includes('.')) return null;

  const [encoded, signature] = ticket.split('.');
  const expectedSignature = crypto.createHmac('sha256', getSecret()).update(encoded).digest('hex');

  const sigBuf = Buffer.from(signature || '', 'hex');
  const expectedBuf = Buffer.from(expectedSignature, 'hex');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function generateOtp(email, previousTicket) {
  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();
  const existing = readTicket(previousTicket);

  if (existing && existing.email === normalizedEmail && now - existing.lastSentAt < REQUEST_COOLDOWN_MS) {
    return { throttled: true, retryAfterMs: REQUEST_COOLDOWN_MS - (now - existing.lastSentAt) };
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const ticket = signTicket({
    email: normalizedEmail,
    codeHash: hashCode(normalizedEmail, code),
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: now,
  });

  return { throttled: false, code, ticket };
}

function verifyOtp(email, code, ticket) {
  const normalizedEmail = normalizeEmail(email);
  const record = readTicket(ticket);

  if (!record || record.email !== normalizedEmail) {
    return { success: false, error: 'No verification code was requested for this email. Please request a new code.' };
  }
  if (Date.now() > record.expiresAt) {
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  if (hashCode(normalizedEmail, code) !== record.codeHash) {
    const updatedTicket = signTicket({ ...record, attempts: record.attempts + 1 });
    return { success: false, error: 'Incorrect verification code.', ticket: updatedTicket };
  }

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
