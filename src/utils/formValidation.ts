import { MemberFormData } from '../types';
import { checklistItemsFor, incompleteTwoSidedUploads, isDocumentEnclosed } from './documentChecklist';
import { DOCUMENT_UPLOADS_ENABLED } from './attachments';

export interface ValidationError {
  field: keyof MemberFormData | 'general' | 'checklist' | 'declaration' | 'uploads';
  message: string;
}

/**
 * Validates mandatory fields, formats, uploads, declarations, and checklist in MemberFormData.
 */
export function validateMemberForm(data: MemberFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // 0. Membership Category (Requirement 1 - Mandatory)
  if (!data.membershipCategory) {
    errors.push({
      field: 'membershipCategory',
      message: 'Membership Category is mandatory. Please select a valid category.',
    });
  }

  // 1. Candidate Full Name
  if (!data.candidateName || data.candidateName.trim().length < 2) {
    errors.push({
      field: 'candidateName',
      message: 'Candidate Full Name is required (minimum 2 characters).',
    });
  }

  // 2. Date of Birth
  if (!data.dob || data.dob.trim() === '') {
    errors.push({
      field: 'dob',
      message: 'Date of Birth is required.',
    });
  }

  // 3. National ID & Passport
  const cleanNid = (data.nid || '').trim();
  const cleanPassport = (data.passportNo || '').trim();

  if (!cleanNid && !cleanPassport) {
    errors.push({
      field: 'nid',
      message: 'Either National ID (NID) or Passport Number is required.',
    });
  } else {
    if (cleanNid && cleanNid.length < 8) {
      errors.push({
        field: 'nid',
        message: 'National ID (NID) must be at least 8-10 digits.',
      });
    }
    if (cleanPassport && cleanPassport.length < 6) {
      errors.push({
        field: 'passportNo',
        message: 'Passport Number must be at least 6 characters if entered.',
      });
    }
  }

  // 4. Mobile Phone Format
  const cleanMobile = (data.mobile || '').replace(/[\s\-\+\(\)]/g, '');
  if (!cleanMobile || cleanMobile.length < 8) {
    errors.push({
      field: 'mobile',
      message: 'A valid Mobile Phone Number (at least 8-11 digits) is required.',
    });
  }

  // 5. Email Address Format
  if (!data.email || data.email.trim() === '') {
    errors.push({
      field: 'email',
      message: 'Email address is required.',
    });
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address (e.g. user@domain.com).',
      });
    }
  }

  // 6. Present Address
  if (!data.presentAddress || data.presentAddress.trim().length < 5) {
    errors.push({
      field: 'presentAddress',
      message: 'Present Address is required (minimum 5 characters).',
    });
  }

  // 6a. Family — spouse details are mandatory when married; each child's core
  // details are mandatory for the number of children entered (Form B)
  const blank = (v: unknown) => !String(v ?? '').trim();
  if (data.maritalStatus === 'Married') {
    if (blank(data.spouseName) || String(data.spouseName).trim().length < 2) {
      errors.push({ field: 'spouseName', message: 'Spouse Full Name is required (Marital Status: Married) — Page 2.' });
    }
    if (blank(data.spouseDob)) {
      errors.push({ field: 'spouseDob', message: 'Spouse Date of Birth is required (Marital Status: Married) — Page 2.' });
    }
    if (blank(data.spouseNidPassport)) {
      errors.push({ field: 'spouseNidPassport', message: 'Spouse NID / Passport number is required (Marital Status: Married) — Page 2.' });
    }
    if (String(data.spouseMobile || '').replace(/[\s\-+()]/g, '').length < 8) {
      errors.push({ field: 'spouseMobile', message: 'A valid Spouse Mobile number is required (Marital Status: Married) — Page 2.' });
    }
  }
  const children = Math.min(Math.max(Number(data.numberOfChildren) || 0, 0), 6);
  for (let i = 1; i <= children; i++) {
    const n = String(i).padStart(2, '0');
    const get = (suffix: string) => (data as unknown as Record<string, unknown>)[`child${n}${suffix}`];
    const missing = [
      blank(get('Name')) && 'Name',
      blank(get('Dob')) && 'Date of Birth',
      blank(get('Gender')) && 'Gender',
    ].filter(Boolean);
    if (missing.length) {
      errors.push({
        field: 'general',
        message: `Child ${n}: ${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required — Page 2 (Number of Children: ${children}).`,
      });
    }
  }

  // 6b. References — both mandatory, and both must be existing Club members
  const references = [
    { n: 1, name: data.ref1Name, memNo: data.ref1MemNo, relationship: data.ref1Relationship, phone: data.ref1Phone },
    { n: 2, name: data.ref2Name, memNo: data.ref2MemNo, relationship: data.ref2Relationship, phone: data.ref2Phone },
  ] as const;
  for (const ref of references) {
    if (!ref.name || ref.name.trim().length < 2) {
      errors.push({ field: `ref${ref.n}Name`, message: `Reference ${ref.n}: Full Name is required.` });
    }
    if (!ref.memNo || ref.memNo.trim() === '') {
      errors.push({
        field: `ref${ref.n}MemNo`,
        message: `Reference ${ref.n}: Club Member No. is required — references must be existing Club members.`,
      });
    }
    if (!ref.relationship || ref.relationship.trim() === '') {
      errors.push({ field: `ref${ref.n}Relationship`, message: `Reference ${ref.n}: Relationship is required.` });
    }
    if ((ref.phone || '').replace(/[\s\-\+\(\)]/g, '').length < 8) {
      errors.push({ field: `ref${ref.n}Phone`, message: `Reference ${ref.n}: a valid Phone Number is required.` });
    }
  }
  const memNo1 = (data.ref1MemNo || '').trim().toUpperCase();
  if (memNo1 && memNo1 === (data.ref2MemNo || '').trim().toUpperCase()) {
    errors.push({ field: 'ref2MemNo', message: 'Reference 1 and Reference 2 must be two different Club members.' });
  }

  // 6c. Document checklist — every mandatory document must be confirmed as enclosed
  for (const item of checklistItemsFor(data)) {
    if (item.required && !isDocumentEnclosed(data, item)) {
      errors.push({
        field: 'checklist',
        message: `Document Checklist: "${item.name}" is mandatory — please tick it as enclosed on Page 6.`,
      });
    }
  }
  // Two-sided documents (National ID) need both sides when uploaded
  for (const item of DOCUMENT_UPLOADS_ENABLED ? incompleteTwoSidedUploads(data) : []) {
    errors.push({
      field: 'uploads',
      message: `${item.name}: please upload both the front and the back side on Page 6 (one side only is not accepted).`,
    });
  }

  // 7. Required Photo Upload
  if (!data.candidatePhotoUrl && !data.docPassportPhoto) {
    errors.push({
      field: 'uploads',
      message: 'Candidate Passport Photograph is required. Please upload or verify photo.',
    });
  }

  // 8. Required Declarations & Privacy Consent (Requirement 5)
  if (!data.privacyConsent) {
    errors.push({
      field: 'declaration',
      message: 'You must read and accept the Confidentiality & Data Privacy Consent statement.',
    });
  }

  return errors;
}
