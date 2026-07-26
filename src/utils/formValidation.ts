import { MemberFormData } from '../types';

export interface ValidationError {
  field: keyof MemberFormData | 'general' | 'checklist' | 'declaration' | 'uploads';
  message: string;
}

/**
 * Validates mandatory fields, formats, uploads, declarations, and checklist in MemberFormData.
 */
export function validateMemberForm(data: MemberFormData): ValidationError[] {
  const errors: ValidationError[] = [];

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

  // 7. Required Photo Upload
  if (!data.candidatePhotoUrl && !data.docPassportPhoto) {
    errors.push({
      field: 'uploads',
      message: 'Candidate Passport Photograph is required. Please upload or verify photo.',
    });
  }

  // 8. Required Declarations & Signatures
  if (!data.docDeclarationSigned) {
    errors.push({
      field: 'declaration',
      message: 'You must check the Applicant Declaration in Form 4 (Document Checklist).',
    });
  }

  return errors;
}
