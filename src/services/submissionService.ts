import { MemberFormData } from '../types';

export interface SubmissionResponse {
  success: boolean;
  referenceNumber: string;
  submissionDate: string;
  membershipType: string;
  message: string;
  errorDetails?: string;
}

export class SubmissionService {
  /**
   * Submits completed application package and generated PDF to /api/submit
   */
  public static async submitApplication(
    data: MemberFormData,
    refNo: string,
    docDate: string,
    pdfDataUri: string,
    turnstileToken?: string,
    docNo?: string,
    otpSessionToken?: string
  ): Promise<SubmissionResponse> {
    try {
      // Photo fields are already rendered into the generated PDF's page images,
      // and uploadedDocs' fileDataUrls are only ever used to render a checklist
      // checkmark/filename in that same PDF — the server/email layer reads
      // neither. Sending them again as raw data URLs only bloats the request
      // body toward Vercel's 4.5 MB function limit (uploadedDocs entries can be
      // up to 10 MB each, uncompressed).
      const {
        candidatePhotoUrl,
        spousePhotoUrl,
        familyPhotoUrl,
        child01PhotoUrl,
        child02PhotoUrl,
        child03PhotoUrl,
        child04PhotoUrl,
        child05PhotoUrl,
        child06PhotoUrl,
        uploadedDocs,
        ...dataWithoutPhotos
      } = data;

      const strippedUploadedDocs = Object.fromEntries(
        Object.entries(uploadedDocs || {}).map(([docName, meta]) => [
          docName,
          { ...meta, fileDataUrl: '' },
        ])
      );

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { ...dataWithoutPhotos, uploadedDocs: strippedUploadedDocs },
          refNo,
          docNo,
          submissionDate: docDate,
          pdfBase64: pdfDataUri,
          turnstileToken: turnstileToken || 'mock-turnstile-verified-token',
          otpSessionToken,
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.success) {
        const errorMsg = json.error || json.message || `Server responded with HTTP ${response.status}`;
        return {
          success: false,
          referenceNumber: refNo,
          submissionDate: docDate,
          membershipType: (data.membershipCategory || 'Permanent').toUpperCase() + ' MEMBERSHIP',
          message: 'Submission failed on server.',
          errorDetails: errorMsg,
        };
      }

      return {
        success: true,
        referenceNumber: json.referenceNumber || refNo,
        submissionDate: json.submissionDate || docDate,
        membershipType: json.membershipType || (data.membershipCategory || 'Permanent').toUpperCase() + ' MEMBERSHIP',
        message: json.message || 'Application submitted successfully.',
      };
    } catch (err: any) {
      console.error('Submission request failed:', err);
      return {
        success: false,
        referenceNumber: refNo,
        submissionDate: docDate,
        membershipType: (data.membershipCategory || 'Permanent').toUpperCase() + ' MEMBERSHIP',
        message: 'Network connection error during submission.',
        errorDetails: err?.message || 'Unable to reach backend endpoint /api/submit.',
      };
    }
  }
}
