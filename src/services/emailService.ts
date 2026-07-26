import emailjs from '@emailjs/browser';
import { MemberFormData } from '../types';

export interface EmailSendResult {
  success: boolean;
  message: string;
  errorDetails?: string;
}

export const TARGET_CLUB_EMAIL = 'membership@coxsbazarboatclubltd.com';

/**
 * Service to handle automated application submissions via EmailJS.
 */
export class EmailService {
  /**
   * Checks if required EmailJS environment variables are declared and non-empty.
   */
  public static isConfigured(): boolean {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    return Boolean(serviceId && templateId && publicKey);
  }

  /**
   * Sends membership application details and optional PDF attachment link/data to EmailJS.
   */
  public static async sendApplication(
    data: MemberFormData,
    docNo: string,
    docDate: string,
    pdfDataUri?: string
  ): Promise<EmailSendResult> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const applicantTemplateId = import.meta.env.VITE_EMAILJS_APPLICANT_TEMPLATE_ID;

    if (!serviceId || !templateId || !publicKey) {
      return {
        success: false,
        message: 'EmailJS credentials are missing or unconfigured in environment variables.',
        errorDetails:
          'Please ensure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY are set.',
      };
    }

    try {
      // Initialize EmailJS
      emailjs.init(publicKey);

      const formattedCategory = (data.membershipCategory || 'Permanent')
        .toUpperCase() + ' MEMBERSHIP';

      const nomineeSummary = [
        data.spouseName ? `Spouse: ${data.spouseName}` : null,
        data.child01Name ? `Child 1: ${data.child01Name}` : null,
        data.child02Name ? `Child 2: ${data.child02Name}` : null,
        data.child03Name ? `Child 3: ${data.child03Name}` : null,
      ]
        .filter(Boolean)
        .join('; ') || 'N/A';

      const fullSummary = `
COX'S BAZAR BOAT CLUB LTD. - MEMBERSHIP APPLICATION
--------------------------------------------------
Doc No: ${docNo}
Date: ${docDate}

1. APPLICANT DETAILS:
Name: ${data.candidateName || 'N/A'}
Title: ${data.title ? data.title.toUpperCase() : 'N/A'}
Membership Type: ${formattedCategory}
Date of Birth: ${data.dob || 'N/A'}
Nationality: ${data.nationality || 'N/A'}
Blood Group: ${data.bloodGroup || 'N/A'}
Religion: ${data.religion || 'N/A'}
National ID (NID): ${data.nid || 'N/A'}
Passport No: ${data.passportNo || 'N/A'}
TIN Number: ${data.tinNumber || 'N/A'}

2. CONTACT & ADDRESS:
Email: ${data.email || 'N/A'}
Mobile: ${data.mobile || 'N/A'}
Alt/Office Tel: ${data.officeTel || 'N/A'}
Present Address: ${data.presentAddress || 'N/A'}
Permanent Address: ${data.permanentAddress || 'N/A'}

3. OCCUPATION & EDUCATION:
Designation: ${data.designation || 'N/A'}
Company / Org: ${data.companyName || 'N/A'}
Business Nature: ${data.businessNature || 'N/A'}
Office Address: ${data.officeAddress || 'N/A'}
Highest Degree: ${data.highestDegree || 'N/A'}
Institution: ${data.institution || 'N/A'} (${data.degreeYear || 'N/A'})

4. EMERGENCY & NOMINEES:
Emergency Contact: ${data.emergencyContactName || 'N/A'}
Emergency Mobile: ${data.emergencyMobile || 'N/A'}
Emergency Relation: ${data.emergencyRelationship || 'N/A'}
Family / Nominees: ${nomineeSummary}
5. DOCUMENT CHECKLIST AUDIT SUMMARY:
NID Copy: ${data.docNidCopy ? 'Verified' : 'Pending'} | Passport Copy: ${data.docPassportCopy ? 'Verified' : 'Pending'} | Birth Cert: ${data.docBirthCert ? 'Verified' : 'Pending'}
Passport Photo: ${data.docPassportPhoto ? 'Verified' : 'Pending'} | Family Photo: ${data.docFamilyPhoto ? 'Verified' : 'Pending'} | Spouse Photo: ${data.docSpousePhoto ? 'Verified' : 'Pending'}
Company ID: ${data.docCompanyId ? 'Verified' : 'Pending'} | Visiting Card: ${data.docVisitingCard ? 'Verified' : 'Pending'} | Employment Cert: ${data.docEmploymentCert ? 'Verified' : 'Pending'}
Utility Bill: ${data.docUtilityBill ? 'Verified' : 'Pending'} | Proof Address: ${data.docProofPermAddress ? 'Verified' : 'Pending'}
Declaration Signed: ${data.docDeclarationSigned ? 'YES' : 'NO'}
`.trim();

      // Parameters for main club inbox
      const mainTemplateParams: Record<string, unknown> = {
        to_email: TARGET_CLUB_EMAIL,
        club_email: TARGET_CLUB_EMAIL,
        reply_to: data.email || TARGET_CLUB_EMAIL,
        applicant_email: data.email || 'N/A',
        email: data.email || 'N/A',
        applicant_name: data.candidateName || 'N/A',
        candidate_name: data.candidateName || 'N/A',
        membership_type: formattedCategory,
        membership_category: data.membershipCategory,
        phone_number: data.mobile || 'N/A',
        mobile: data.mobile || 'N/A',
        national_id: data.nid || 'N/A',
        passport_number: data.passportNo || 'N/A',
        date_of_birth: data.dob || 'N/A',
        present_address: data.presentAddress || 'N/A',
        permanent_address: data.permanentAddress || 'N/A',
        emergency_contact: data.emergencyContactName ? `${data.emergencyContactName} (${data.emergencyMobile})` : 'N/A',
        emergency_name: data.emergencyContactName || 'N/A',
        emergency_mobile: data.emergencyMobile || 'N/A',
        emergency_relationship: data.emergencyRelationship || 'N/A',
        nominee_info: nomineeSummary,
        spouse_name: data.spouseName || 'N/A',
        occupation: data.designation ? `${data.designation} at ${data.companyName}` : 'N/A',
        designation: data.designation || 'N/A',
        company_name: data.companyName || 'N/A',
        office_address: data.officeAddress || 'N/A',
        business_nature: data.businessNature || 'N/A',
        submission_date: docDate,
        doc_no: docNo,
        summary_details: fullSummary,
        content: pdfDataUri || fullSummary,
      };

      // Send to main club membership email
      const response = await emailjs.send(serviceId, templateId, mainTemplateParams, publicKey);

      if (response.status !== 200 && response.text !== 'OK') {
        return {
          success: false,
          message: `EmailJS responded with status code ${response.status}: ${response.text}`,
        };
      }

      // Send confirmation email to applicant if email is provided and applicant template is configured
      if (data.email && data.email.trim() !== '') {
        const confirmTemplateId = applicantTemplateId || templateId;
        const applicantParams: Record<string, unknown> = {
          ...mainTemplateParams,
          to_email: data.email,
          to_name: data.candidateName,
        };

        try {
          await emailjs.send(serviceId, confirmTemplateId, applicantParams, publicKey);
        } catch (applicantErr) {
          // Non-blocking: application was already received by main club
        }
      }

      return {
        success: true,
        message: 'Membership application email transmitted successfully.',
      };
    } catch (error: any) {
      const errorMessage = error?.text || error?.message || 'An unknown network error occurred while contacting EmailJS.';
      return {
        success: false,
        message: 'Failed to send application email via EmailJS.',
        errorDetails: errorMessage,
      };
    }
  }
}
