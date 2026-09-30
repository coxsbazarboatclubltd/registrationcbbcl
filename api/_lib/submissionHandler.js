const { sendApplicationEmails } = require('./emailService');
const { verifySessionToken } = require('./otpStore');

const DEFAULT_OFFICE_EMAIL = 'registration@cbbcl.org';

// Simple In-Memory Rate Limiter (Max 5 submissions per 15 mins per IP).
// Best-effort only: on serverless platforms this map is scoped to a single
// warm function instance and is not shared across concurrent instances.
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, retryAfterMs: record.resetTime - now };
  }

  record.count += 1;
  return { allowed: true };
}

/**
 * Framework-agnostic handler for POST /api/submit — shared between the local
 * Express dev server (server.ts) and the Vercel Serverless Function (api/submit.js)
 * so both environments run identical validation, rate-limiting, and email logic.
 */
async function handleSubmission(body, clientIp) {
  // 1. Rate Limiting Check
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    console.warn(`[RATE_LIMIT_EXCEEDED] IP: ${clientIp} exceeded submission limit.`);
    return {
      status: 429,
      body: {
        success: false,
        error: 'Rate limit exceeded. Please wait 15 minutes before submitting another application.',
      },
    };
  }

  const { data, refNo, docNo, submissionDate, pdfBase64, turnstileToken, otpSessionToken } = body || {};

  // 2. Validate input data
  if (!data || !data.candidateName || !data.email) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Invalid request: Candidate name and email address are required.',
      },
    };
  }

  // 2b. Require a verified OTP session token matching the applicant's own email,
  // so only applicants who've confirmed access to their inbox can submit.
  if (!verifySessionToken(otpSessionToken, data.email)) {
    return {
      status: 403,
      body: {
        success: false,
        error: 'Email verification session is missing or has expired. Please verify your email again.',
      },
    };
  }

  const referenceNumber = refNo || `CBBCL-${new Date().getFullYear()}-000001`;
  const formattedCategory = (data.membershipCategory || 'Permanent').toUpperCase() + ' MEMBERSHIP';
  const officeEmail = process.env.MEMBERSHIP_EMAIL || process.env.MEMBERSHIP_OFFICE_EMAIL || DEFAULT_OFFICE_EMAIL;

  // 3. Bot Protection via Cloudflare Turnstile (if secret key configured)
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && turnstileSecret.trim() !== '') {
    if (!turnstileToken) {
      return {
        status: 403,
        body: {
          success: false,
          error: 'Bot verification token missing. Please complete the security challenge.',
        },
      };
    }

    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: clientIp,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.warn(`[TURNSTILE_FAILED] IP: ${clientIp} Ref: ${referenceNumber}`);
        return {
          status: 403,
          body: {
            success: false,
            error: 'Bot protection check failed. Please refresh and try again.',
          },
        };
      }
    } catch (turnstileErr) {
      console.error('[TURNSTILE_VERIFY_ERROR]', turnstileErr);
    }
  }

  // Log submission event (NO PII logged)
  console.log(`[SUBMISSION_RECEIVED] Timestamp: ${new Date().toISOString()} | RefNo: ${referenceNumber}`);

  // 4. Send Emails via Resend
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey || resendApiKey.trim() === '') {
    console.warn(`[RESEND_NOT_CONFIGURED] RefNo: ${referenceNumber}. Simulating successful delivery.`);
    return {
      status: 200,
      body: {
        success: true,
        referenceNumber,
        submissionDate: submissionDate || new Date().toISOString().split('T')[0],
        membershipType: formattedCategory,
        message: 'Application received successfully (Development Simulation Mode).',
        note: 'Please set RESEND_API_KEY in server environment to enable real email transmission.',
      },
    };
  }

  try {
    const fromName = process.env.FROM_NAME || "Cox's Bazar Boat Club";
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@cbbcl.org';

    const { officeResult, applicantResult } = await sendApplicationEmails({
      resendApiKey,
      fromName,
      fromEmail,
      officeEmail,
      referenceNumber,
      documentNumber: docNo || 'N/A',
      submissionDate: submissionDate || new Date().toISOString().split('T')[0],
      data,
      pdfBase64,
    });

    // Check if at least one email was sent or if both failed
    if (officeResult.error && applicantResult.error) {
      const combinedError = officeResult.error.message || applicantResult.error.message || 'Resend validation error.';
      return {
        status: 400,
        body: {
          success: false,
          error: `Resend API Error: ${combinedError}. Please check verified domains or sender address in Resend dashboard.`,
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        referenceNumber,
        submissionDate: submissionDate || new Date().toISOString().split('T')[0],
        membershipType: formattedCategory,
        message: 'Application submitted and emails dispatched successfully.',
      },
    };
  } catch (error) {
    console.error(`[SUBMISSION_ERROR] RefNo: ${referenceNumber}`, error);
    return {
      status: 500,
      body: {
        success: false,
        error: error?.message || 'Failed to dispatch email via Resend.',
      },
    };
  }
}

module.exports = { handleSubmission };
