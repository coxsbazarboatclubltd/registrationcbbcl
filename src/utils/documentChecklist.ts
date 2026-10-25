import { MemberFormData } from '../types';

/**
 * Documents the applicant confirms as enclosed with the physical application
 * package (Form F). Shared by the checklist UI and submit-time validation so
 * both always agree on which items are mandatory.
 */
export const CHECKLIST_ITEMS = [
  { field: 'docPassportPhoto', name: 'Passport Size Photograph', note: '2 inch × 2 inch, recent clear photo', required: true },
  { field: 'docSpousePhoto', name: 'Spouse Photograph', note: 'Passport size, recent clear photo of spouse (if married)', required: true, appliesWhen: 'married' },
  { field: 'docChildrenPhoto', name: "Children's Photographs", note: 'One recent passport-size photo of each child (if applicable)', required: true, appliesWhen: 'children' },
  { field: 'docNidCopy', name: 'National ID (NID)', note: 'Smart NID clear copy — both front & back sides', required: true, twoSided: true },
  { field: 'docPassportCopy', name: 'Passport Copy', note: 'Valid passport copy (information pages)', required: true },
  { field: 'docSpecimenSignature', name: 'Your Digital Signature', note: 'Clear scan or photo of your signature on white paper', required: true },
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

const childCount = (data: MemberFormData): number => Math.min(Math.max(Number(data.numberOfChildren) || 0, 0), 6);

/** Whether a document applies to this applicant (spouse / children photos are conditional). */
export function checklistItemApplies(item: ChecklistItem, data: MemberFormData): boolean {
  const when = 'appliesWhen' in item ? item.appliesWhen : undefined;
  if (when === 'married') return data.maritalStatus === 'Married';
  if (when === 'children') return childCount(data) > 0;
  return true;
}

/** The checklist as it applies to this applicant, in display order. */
export function checklistItemsFor(data: MemberFormData): ChecklistItem[] {
  return CHECKLIST_ITEMS.filter((item) => checklistItemApplies(item, data));
}

/** Description line, with the number of children filled in where relevant. */
export function checklistNote(item: ChecklistItem, data: MemberFormData): string {
  if ('appliesWhen' in item && item.appliesWhen === 'children' && childCount(data) > 0) {
    const n = childCount(data);
    return `One recent passport-size photo of each child (${n} ${n === 1 ? 'child' : 'children'})`;
  }
  return item.note;
}
