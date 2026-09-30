import { MemberFormData } from '../types';

/**
 * Documents the applicant confirms as enclosed with the physical application
 * package (Form F). Shared by the checklist UI and submit-time validation so
 * both always agree on which items are mandatory.
 */
export const CHECKLIST_ITEMS = [
  { field: 'docPassportPhoto', name: 'Passport Size Photograph', note: '2 inch × 2 inch, recent clear photo', required: true },
  { field: 'docNidCopy', name: 'National ID (NID)', note: 'Smart NID or 10/13/17 digit clear copy', required: true },
  { field: 'docPassportCopy', name: 'Passport Copy', note: 'Valid passport copy (information pages)', required: true },
  { field: 'docSpecimenSignature', name: 'Specimen Signature', note: 'Signature on white paper', required: true },
  { field: 'docBirthCertificate', name: 'Birth Certificate', note: 'Applicant and children / dependent birth certificate copies', required: true },
  { field: 'docTradeLicense', name: 'Trade License / Employment ID', note: 'Trade license or employment identification', required: true },
  { field: 'docCompanyId', name: 'Company ID / Official Card', note: 'Official ID card or employment proof', required: false },
  { field: 'docTinCertificate', name: 'TIN Certificate', note: 'Tax identification certificate copy', required: true },
  { field: 'docOtherAttachments', name: 'Supporting Documents & Other Attachments', note: 'Utility Bill, Organization Letter, Recommendation', required: false },
] as const;

export type ChecklistItem = (typeof CHECKLIST_ITEMS)[number];

export function isDocumentEnclosed(data: MemberFormData, item: ChecklistItem): boolean {
  return !!(data as unknown as Record<string, unknown>)[item.field] || !!data.uploadedDocs?.[item.name];
}
