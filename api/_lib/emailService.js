const { createResendClient } = require('./resend');
const { escapeHtml } = require('./escapeHtml');

function buildOfficeEmailHtml(params, formattedCategory) {
  const { data, referenceNumber, documentNumber, submissionDate } = params;

  const nomineeSummary = [
    data.spouseName ? `Spouse: ${escapeHtml(data.spouseName)}` : null,
    data.child01Name ? `Child 1: ${escapeHtml(data.child01Name)}` : null,
    data.child02Name ? `Child 2: ${escapeHtml(data.child02Name)}` : null,
    data.child03Name ? `Child 3: ${escapeHtml(data.child03Name)}` : null,
  ]
    .filter(Boolean)
    .join('; ') || 'N/A';

  return `
    <div style="font-family: Montserrat, Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1a2744; border: 1px solid #c8c8c8; padding: 24px; border-radius: 8px;">
      <div style="background-color: #1a2744; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
        <h2 style="color: #c4a56a; margin: 0; font-family: Montserrat, Arial, sans-serif;">COX'S BAZAR BOAT CLUB LTD.</h2>
        <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 1px;">MEMBERSHIP OFFICE APPLICATION NOTIFICATION</p>
      </div>

      <h3 style="color: #1a2744; border-bottom: 2px solid #9d7f46; padding-bottom: 6px;">New Membership Application</h3>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr><td style="padding: 6px; font-weight: bold; width: 180px;">Reference Number:</td><td style="padding: 6px; color: #0f5132; font-weight: bold;">${escapeHtml(referenceNumber)}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Document Number:</td><td style="padding: 6px;">${escapeHtml(documentNumber)}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Submission Date:</td><td style="padding: 6px;">${escapeHtml(submissionDate || new Date().toISOString().split('T')[0])}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Membership Category:</td><td style="padding: 6px;">${escapeHtml(data.membershipCategory || 'Permanent Member')}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Applicant Name:</td><td style="padding: 6px;">${data.title ? escapeHtml(data.title.toUpperCase()) + ' ' : ''}${escapeHtml(data.candidateName)}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Email:</td><td style="padding: 6px;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Mobile Phone:</td><td style="padding: 6px;">${escapeHtml(data.mobile)}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">National ID / Passport:</td><td style="padding: 6px;">${escapeHtml(data.nid || data.passportNo || 'N/A')}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Present Address:</td><td style="padding: 6px;">${escapeHtml(data.presentAddress || 'N/A')}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Occupation:</td><td style="padding: 6px;">${data.designation ? `${escapeHtml(data.designation)} at ${escapeHtml(data.companyName)}` : 'N/A'}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Nominees / Family:</td><td style="padding: 6px;">${nomineeSummary}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Reference 1:</td><td style="padding: 6px;">${data.ref1Name ? `${escapeHtml(data.ref1Name)} (${escapeHtml(data.ref1Organization || 'N/A')}, Ph: ${escapeHtml(data.ref1Phone || 'N/A')})` : 'N/A'}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Reference 2:</td><td style="padding: 6px;">${data.ref2Name ? `${escapeHtml(data.ref2Name)} (${escapeHtml(data.ref2Organization || 'N/A')}, Ph: ${escapeHtml(data.ref2Phone || 'N/A')})` : 'N/A'}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Data Privacy Consent:</td><td style="padding: 6px; color: #0f5132; font-weight: bold;">${data.privacyConsent ? 'ACCEPTED' : 'PENDING'}</td></tr>
      </table>

      <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 12px; border-radius: 6px; font-size: 12px; margin-bottom: 20px;">
        <strong>Document Checklist Verification Summary:</strong>
        <ul style="margin: 6px 0 0 0; padding-left: 20px;">
          <li>NID Copy: ${data.docNidCopy ? 'Verified' : 'Pending'} | Passport Copy: ${data.docPassportCopy ? 'Verified' : 'Pending'}</li>
          <li>Passport Photo: ${data.docPassportPhoto ? 'Verified' : 'Pending'} | Family Photo: ${data.docFamilyPhoto ? 'Verified' : 'Pending'}</li>
          <li>Company ID: ${data.docCompanyId ? 'Verified' : 'Pending'} | Utility Bill: ${data.docUtilityBill ? 'Verified' : 'Pending'}</li>
          <li>Applicant Declaration Signed: ${data.docDeclarationSigned ? 'YES' : 'NO'}</li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #555555;">
        The complete application package PDF has been attached to this email for office records and executive committee review.
      </p>
    </div>
  `;
}

function buildApplicantEmailHtml(params, formattedCategory, officeEmail) {
  const { data, referenceNumber, submissionDate } = params;

  return `
    <div style="font-family: Montserrat, Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1a2744; border: 1px solid #c8c8c8; padding: 24px; border-radius: 8px;">
      <div style="background-color: #1a2744; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
        <h2 style="color: #c4a56a; margin: 0; font-family: Montserrat, Arial, sans-serif;">COX'S BAZAR BOAT CLUB LTD.</h2>
        <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1px;">COX'S BAZAR, BANGLADESH</p>
      </div>

      <h3 style="color: #1a2744; border-bottom: 2px solid #9d7f46; padding-bottom: 6px;">Application Received</h3>

      <p>Dear <strong>${escapeHtml(data.candidateName)}</strong>,</p>

      <p>
        Thank you for applying for membership at <strong>Cox's Bazar Boat Club Ltd.</strong> We have successfully received your registration form.
      </p>

      <div style="background-color: #f4f6f9; border-left: 4px solid #1a2744; padding: 14px; margin: 18px 0; border-radius: 0 6px 6px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Application Reference Number:</strong> <span style="color: #0f5132; font-weight: bold;">${escapeHtml(referenceNumber)}</span></p>
        <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Submission Date:</strong> ${escapeHtml(submissionDate || new Date().toISOString().split('T')[0])}</p>
        <p style="margin: 0; font-size: 13px;"><strong>Membership Category:</strong> ${escapeHtml(formattedCategory)}</p>
      </div>

      <p style="font-size: 13px; line-height: 1.6;">
        Our Membership Office is currently reviewing your submitted details and uploaded document checklist. We will contact you via email or phone if any additional information or verification is required.
      </p>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

      <div style="font-size: 12px; color: #666666;">
        <p style="margin: 0 0 4px 0; font-weight: bold; color: #1a2744;">Membership Secretariat</p>
        <p style="margin: 0 0 2px 0;">Cox's Bazar Boat Club Ltd.</p>
        <p style="margin: 0 0 2px 0;">Email: <a href="mailto:${escapeHtml(officeEmail)}">${escapeHtml(officeEmail)}</a></p>
        <p style="margin: 0;">Website: https://coxsbazarboatclubltd.com</p>
      </div>
    </div>
  `;
}

function buildOtpEmailHtml(code) {
  return `
    <div style="font-family: Montserrat, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a2744; border: 1px solid #c8c8c8; padding: 24px; border-radius: 8px;">
      <div style="background-color: #1a2744; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
        <h2 style="color: #c4a56a; margin: 0; font-family: Montserrat, Arial, sans-serif;">COX'S BAZAR BOAT CLUB LTD.</h2>
        <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 1px;">MEMBERSHIP APPLICATION ACCESS</p>
      </div>

      <p>Your one-time verification code to access the membership application form is:</p>

      <div style="background-color: #f4f6f9; border-left: 4px solid #1a2744; padding: 16px; margin: 18px 0; border-radius: 0 6px 6px 0; text-align: center;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a2744;">${escapeHtml(code)}</span>
      </div>

      <p style="font-size: 13px; color: #555555;">This code expires in 10 minutes. If you did not request this code, you can safely ignore this email.</p>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

      <div style="font-size: 12px; color: #666666;">
        <p style="margin: 0 0 4px 0; font-weight: bold; color: #1a2744;">Membership Secretariat</p>
        <p style="margin: 0;">Cox's Bazar Boat Club Ltd.</p>
      </div>
    </div>
  `;
}

async function sendOtpEmail(params) {
  const resend = createResendClient(params.resendApiKey);
  const primaryFrom = `${params.fromName} <${params.fromEmail}>`;
  const fallbackFrom = `${params.fromName} <onboarding@resend.dev>`;

  let sendRes = await resend.emails.send({
    from: primaryFrom,
    to: [params.toEmail],
    subject: 'Your Verification Code — CBBCL Membership Application',
    html: buildOtpEmailHtml(params.code),
  });

  if (sendRes.error) {
    console.warn(`[RESEND_PRIMARY_FAILED] Target: ${params.toEmail} Error: ${sendRes.error.name} - ${sendRes.error.message}`);
    if (sendRes.error.name === 'validation_error' || sendRes.error.message?.includes('domain') || sendRes.error.message?.includes('verify')) {
      console.log(`[RESEND_RETRYING] Retrying with default onboarding address: ${fallbackFrom}`);
      sendRes = await resend.emails.send({
        from: fallbackFrom,
        to: [params.toEmail],
        subject: 'Your Verification Code — CBBCL Membership Application',
        html: buildOtpEmailHtml(params.code),
      });
    }
  }

  if (sendRes.error) {
    console.warn(`[OTP_EMAIL_WARNING] Could not dispatch verification email: ${sendRes.error.message}`);
  } else {
    console.log(`[OTP_EMAIL_SENT] To: ${params.toEmail} ID: ${sendRes.data?.id}`);
  }

  return sendRes;
}

async function sendApplicationEmails(params) {
  const resend = createResendClient(params.resendApiKey);
  const primaryFrom = `${params.fromName} <${params.fromEmail}>`;
  const fallbackFrom = `${params.fromName} <onboarding@resend.dev>`;

  const attachments = [];
  if (params.pdfBase64) {
    // Resend's Node SDK types accept a Buffer for `content`, but its
    // parseAttachments() passes it straight into the JSON request body
    // unconverted — JSON.stringify(buffer) produces {"type":"Buffer","data":
    // [...]}, not a base64 string, corrupting the attachment down to a few
    // bytes. Passing the base64 string directly (which the API actually
    // expects) avoids that Buffer round-trip entirely.
    const cleanBase64 = params.pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    attachments.push({
      filename: `${params.referenceNumber}_Membership_Application.pdf`,
      content: cleanBase64,
    });
  }

  const formattedCategory = (params.data.membershipCategory || 'Permanent').toUpperCase() + ' MEMBERSHIP';

  const sendWithFallback = async (toEmail, subject, htmlContent) => {
    let sendRes = await resend.emails.send({
      from: primaryFrom,
      to: [toEmail],
      subject,
      html: htmlContent,
      attachments,
    });

    if (sendRes.error) {
      console.warn(`[RESEND_PRIMARY_FAILED] Target: ${toEmail} Error: ${sendRes.error.name} - ${sendRes.error.message}`);
      if (sendRes.error.name === 'validation_error' || sendRes.error.message?.includes('domain') || sendRes.error.message?.includes('verify')) {
        console.log(`[RESEND_RETRYING] Retrying with default onboarding address: ${fallbackFrom}`);
        sendRes = await resend.emails.send({
          from: fallbackFrom,
          to: [toEmail],
          subject,
          html: htmlContent,
          attachments,
        });
      }
    }

    return sendRes;
  };

  const officeEmailHtml = buildOfficeEmailHtml(params, formattedCategory);
  const applicantEmailHtml = buildApplicantEmailHtml(params, formattedCategory, params.officeEmail);

  // Office and applicant emails are independent — dispatch concurrently instead
  // of waiting on one before starting the other.
  const [officeResult, applicantResult] = await Promise.all([
    sendWithFallback(
      params.officeEmail,
      `New Membership Application Reference ${params.referenceNumber}`,
      officeEmailHtml
    ),
    sendWithFallback(
      params.data.email,
      `Your Membership Application Has Been Received - ${params.referenceNumber}`,
      applicantEmailHtml
    ),
  ]);

  if (officeResult.error) {
    console.warn(`[OFFICE_EMAIL_WARNING] Could not dispatch email to office: ${officeResult.error.message}`);
  } else {
    console.log(`[OFFICE_EMAIL_SENT] RefNo: ${params.referenceNumber} ID: ${officeResult.data?.id}`);
  }

  if (applicantResult.error) {
    console.warn(`[APPLICANT_EMAIL_WARNING] Could not dispatch email to applicant: ${applicantResult.error.message}`);
  } else {
    console.log(`[APPLICANT_EMAIL_SENT] RefNo: ${params.referenceNumber} To: ${params.data.email} ID: ${applicantResult.data?.id}`);
  }

  return { officeResult, applicantResult };
}

module.exports = { sendApplicationEmails, sendOtpEmail };
