export type MembershipCategoryType =
  | 'Founder Member'
  | 'Donor Member'
  | 'Life Member'
  | 'Permanent Member'
  | 'Associate Member'
  | 'Diplomat Member'
  | 'Foreign Member'
  | 'Corporate Member'
  | 'Honorary Member';

export const MEMBERSHIP_CATEGORIES: MembershipCategoryType[] = [
  'Founder Member',
  'Donor Member',
  'Life Member',
  'Permanent Member',
  'Associate Member',
  'Diplomat Member',
  'Foreign Member',
  'Corporate Member',
  'Honorary Member',
];

export interface UploadedDocumentMeta {
  fileName: string;
  fileSize: string;
  fileType: string;
  fileDataUrl?: string;
  uploadedAt: string;
}

export interface MemberFormData {
  // Registration Number & Category
  registrationNumber: string;
  membershipCategory: MembershipCategoryType;

  candidateName: string;
  fatherHusbandName: string;
  motherName: string;
  dob: string;
  placeOfBirth: string;
  nationality: string;
  bloodGroup: string;
  religion: string;
  maritalStatus: string;
  nid: string;
  passportNo: string;
  passportExpiry: string;
  presentAddress: string;
  permanentAddress: string;
  mobile: string;
  whatsapp: string;
  email: string;
  designation: string;
  companyName: string;
  officeAddress: string;
  businessNature: string;
  highestDegree: string;
  institution: string;
  degreeYear: string;
  tinNumber: string;
  circleZone: string;

  // Family / Spouse & Children
  spouseName: string;
  spouseDob: string;
  weddingAnniversary: string;
  spouseBloodGroup: string;
  spouseNidPassport: string;
  spouseMobile: string;
  spouseEmail: string;

  child01Name: string;
  child01Dob: string;
  child01Gender: string;
  child01SchoolOccupation: string;
  child01BloodGroup: string;

  child02Name: string;
  child02Dob: string;
  child02Gender: string;
  child02SchoolOccupation: string;
  child02BloodGroup: string;

  child03Name: string;
  child03Dob: string;
  child03Gender: string;
  child03SchoolOccupation: string;
  child03BloodGroup: string;

  child04Name: string;
  child04Dob: string;
  child04Gender: string;
  child04SchoolOccupation: string;
  child04BloodGroup: string;

  child05Name: string;
  child05Dob: string;
  child05Gender: string;
  child05SchoolOccupation: string;
  child05BloodGroup: string;

  child06Name: string;
  child06Dob: string;
  child06Gender: string;
  child06SchoolOccupation: string;
  child06BloodGroup: string;

  numberOfChildren: number;

  preferredMailingAddress: 'present' | 'office' | 'permanent';
  commPreference: 'sms' | 'email' | 'whatsapp' | 'phone';
  specialInstructions: string;
  preferredCardName: string;
  
  // Uploaded Photo Data URLs
  candidatePhotoUrl?: string;
  spousePhotoUrl?: string;
  familyPhotoUrl?: string;
  child01PhotoUrl?: string;
  child02PhotoUrl?: string;
  child03PhotoUrl?: string;
  child04PhotoUrl?: string;
  child05PhotoUrl?: string;
  child06PhotoUrl?: string;

  // Form 2 & 3 specifics
  membershipNo: string;
  emergencyContactName: string;
  emergencyMobile: string;
  emergencyRelationship: string;
  emergencyAltTel: string;
  
  // Form 3 specifics
  title: string;
  professionType: 'business' | 'service' | 'retired' | 'other';
  officeTel: string;
  altContact: string;
  residenceTel: string;
  
  // References (Requirement 9)
  ref1Name: string;
  ref1Relationship: string;
  ref1Organization: string;
  ref1Designation: string;
  ref1Phone: string;
  ref1Email: string;
  ref1Address: string;
  ref1MemNo: string;

  ref2Name: string;
  ref2Relationship: string;
  ref2Organization: string;
  ref2Designation: string;
  ref2Phone: string;
  ref2Email: string;
  ref2Address: string;
  ref2MemNo: string;

  // Dedicated Upload Checklist files (Requirement 4)
  uploadedDocs: Record<string, UploadedDocumentMeta>;

  // Confidentiality & Privacy Consent (Requirement 5)
  privacyConsent: boolean;

  // Checkboxes
  kycPhoto: boolean;
  kycNid: boolean;
  kycSponsor: boolean;
  kycTin: boolean;
  kycFeeReceipt: boolean;
  kycCommittee: boolean;
  
  privMooring: boolean;
  privDining: boolean;
  privSwimming: boolean;
  privGuest: boolean;
  privVoting: boolean;
  privDeepSea: boolean;

  // Form 4 - Document Checklist fields
  docNidCopy: boolean;
  docPassportCopy: boolean;
  docBirthCert: boolean;
  docDrivingLicense: boolean;
  docTinCert: boolean;

  docPassportPhoto: boolean;
  docFamilyPhoto: boolean;
  docSpousePhoto: boolean;
  docChildrenPhoto: boolean;

  docCompanyId: boolean;
  docVisitingCard: boolean;
  docEmploymentCert: boolean;
  docTradeLicense: boolean;
  docProfMembershipCert: boolean;

  docUtilityBill: boolean;
  docRentalAgreement: boolean;
  docPropertyDoc: boolean;
  docProofPermAddress: boolean;

  docMarriageCert: boolean;
  docChildrenBirthCert: boolean;
  docBoatReg: boolean;
  docBoatInsurance: boolean;
  docRecLetter: boolean;
  docOtherDocs: boolean;
  docDeclarationSigned: boolean;
}

export const EMPTY_MEMBER_DATA: MemberFormData = {
  registrationNumber: "CBBCL-2026-000001",
  membershipCategory: "Permanent Member",
  candidateName: "",
  fatherHusbandName: "",
  motherName: "",
  dob: "",
  placeOfBirth: "",
  nationality: "Bangladeshi",
  bloodGroup: "",
  religion: "Islam",
  maritalStatus: "",
  nid: "",
  passportNo: "",
  passportExpiry: "",
  presentAddress: "",
  permanentAddress: "",
  mobile: "+880",
  whatsapp: "+880",
  email: "",
  designation: "",
  companyName: "",
  officeAddress: "",
  businessNature: "",
  highestDegree: "",
  institution: "",
  degreeYear: "",
  tinNumber: "",
  circleZone: "",
  spouseName: "",
  spouseDob: "",
  weddingAnniversary: "",
  spouseBloodGroup: "",
  spouseNidPassport: "",
  spouseMobile: "+880",
  spouseEmail: "",
  child01Name: "",
  child01Dob: "",
  child01Gender: "",
  child01SchoolOccupation: "",
  child01BloodGroup: "",
  child02Name: "",
  child02Dob: "",
  child02Gender: "",
  child02SchoolOccupation: "",
  child02BloodGroup: "",
  child03Name: "",
  child03Dob: "",
  child03Gender: "",
  child03SchoolOccupation: "",
  child03BloodGroup: "",
  child04Name: "",
  child04Dob: "",
  child04Gender: "",
  child04SchoolOccupation: "",
  child04BloodGroup: "",
  child05Name: "",
  child05Dob: "",
  child05Gender: "",
  child05SchoolOccupation: "",
  child05BloodGroup: "",
  child06Name: "",
  child06Dob: "",
  child06Gender: "",
  child06SchoolOccupation: "",
  child06BloodGroup: "",
  numberOfChildren: 0,

  preferredMailingAddress: "present",
  commPreference: "email",
  specialInstructions: "",
  preferredCardName: "",
  
  membershipNo: "P-0000",
  emergencyContactName: "",
  emergencyMobile: "+880",
  emergencyRelationship: "",
  emergencyAltTel: "+880",
  
  title: "mr",
  professionType: "service",
  officeTel: "+880",
  altContact: "+880",
  residenceTel: "+880",

  ref1Name: "",
  ref1Relationship: "",
  ref1Organization: "",
  ref1Designation: "",
  ref1Phone: "+880",
  ref1Email: "",
  ref1Address: "",
  ref1MemNo: "",

  ref2Name: "",
  ref2Relationship: "",
  ref2Organization: "",
  ref2Designation: "",
  ref2Phone: "+880",
  ref2Email: "",
  ref2Address: "",
  ref2MemNo: "",

  uploadedDocs: {},
  privacyConsent: false,
  
  kycPhoto: false,
  kycNid: false,
  kycSponsor: false,
  kycTin: false,
  kycFeeReceipt: false,
  kycCommittee: false,
  
  privMooring: false,
  privDining: false,
  privSwimming: false,
  privGuest: false,
  privVoting: false,
  privDeepSea: false,

  docNidCopy: false,
  docPassportCopy: false,
  docBirthCert: false,
  docDrivingLicense: false,
  docTinCert: false,

  docPassportPhoto: false,
  docFamilyPhoto: false,
  docSpousePhoto: false,
  docChildrenPhoto: false,

  docCompanyId: false,
  docVisitingCard: false,
  docEmploymentCert: false,
  docTradeLicense: false,
  docProfMembershipCert: false,

  docUtilityBill: false,
  docRentalAgreement: false,
  docPropertyDoc: false,
  docProofPermAddress: false,

  docMarriageCert: false,
  docChildrenBirthCert: false,
  docBoatReg: false,
  docBoatInsurance: false,
  docRecLetter: false,
  docOtherDocs: false,
  docDeclarationSigned: false,
};
