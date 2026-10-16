import { MemberFormData } from '../types';

/**
 * Documents the applicant confirms as enclosed with the physical application
 * package (Form F). Shared by the checklist UI and submit-time validation so
 * both always agree on which items are mandatory.
 */
export const CHECKLIST_ITEMS = [
  { field: 'docPassportPhoto', name: 'Passport Size Photograph', note: '2 inch × 2 inch, recent clear photo', required: true },
  { field: 'docNidCopy', name: 'National ID (NID)', note: 'Smart NID or 10/13/17 digit clear copy — both front and back sides', required: true, twoSided: true },
  { field: 'docPassportCopy', name: 'Passport Copy', note: 'Valid passport copy (information pages)', required: true },
  { field: 'docSpecimenSignature', name: 'Specimen Signature', note: 'Signature on white paper', required: true },
  { field: 'docBirthCertificate', name: 'Birth Certificate', note: 'Applicant and children / dependent birth certificate copies', required: true },
  { field: 'docTinCertificate', name: 'TIN Certificate', note: 'Tax identification certificate copy', required: true },
  { field: 'docTradeLicense', name: 'Trade License / Employment ID', note: 'Trade license or employment identification', required: false },
  { field: 'docCompanyId', name: 'Company ID / Official Card', note: 'Official ID card or employment proof', required: false },
  { field: 'docEducationCertificate', name: 'Education Certificate', note: 'Highest academic degree / certificate copy', required: false },
  { field: 'docOtherAttachments', name: 'Supporting Documents & Other Attachments', note: 'Utility Bill, Organization Letter, Recommendation', required: false },
] as const;

export type ChecklistItem = (typeof CHECKLIST_ITEMS)[number];

export function isDocumentEnclosed(data: MemberFormData, item: ChecklistItem): boolean {
  return !!(data as unknown as Record<string, unknown>)[item.field] || !!data.uploadedDocs?.[item.name];
}

/** One upload slot of a checklist document (two-sided documents have Front + Back). */
export interface UploadSlot {
  /** Key in data.uploadedDocs */
  key: string;
  /** Short label shown on the slot and the PDF page ('' for single-file documents) */
  side: '' | 'Front' | 'Back';
}

export const isTwoSided = (item: ChecklistItem): boolean => 'twoSided' in item && item.twoSided === true;

/** Upload slots for a document. The front keeps the plain name so earlier drafts still match. */
export function uploadSlots(item: ChecklistItem): UploadSlot[] {
  return isTwoSided(item)
    ? [
        { key: item.name, side: 'Front' },
        { key: `${item.name} (Back)`, side: 'Back' },
      ]
    : [{ key: item.name, side: '' }];
}

/** Two-sided documents where only one side has been uploaded. */
export function incompleteTwoSidedUploads(data: MemberFormData): ChecklistItem[] {
  const docs = data.uploadedDocs || {};
  return CHECKLIST_ITEMS.filter((item) => {
    if (!isTwoSided(item)) return false;
    const present = uploadSlots(item).filter((slot) => !!docs[slot.key]).length;
    return present === 1;
  });
}
