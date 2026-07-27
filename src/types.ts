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

export const SAMPLE_MEMBER_DATA: MemberFormData = {
  registrationNumber: "CBBCL-2026-000001",
  membershipCategory: "Permanent Member",
  candidateName: "SAYEED REZA CHOWDHURY",
  fatherHusbandName: "Late Alhaj Muzaffar Ahmed Chowdhury",
  motherName: "Begum Anwara Chowdhury",
  dob: "1968-10-14",
  placeOfBirth: "Chittagong",
  nationality: "Bangladeshi",
  bloodGroup: "O+",
  religion: "Islam",
  maritalStatus: "Married",
  nid: "19681592471852936",
  passportNo: "A08492158",
  passportExpiry: "2029-08-15",
  presentAddress: "House 24, Road 8, Block G, Halishahar R/A, Chittagong, Bangladesh",
  permanentAddress: "Chowdhury Villa, West Sultanpur, Raozan, Chittagong, Bangladesh",
  mobile: "+880 1711-582941",
  whatsapp: "+880 1711-582941",
  email: "reza.chowdhury@club-members.org",
  designation: "Senior Corporate Advisor & Director",
  companyName: "Bay of Bengal Trading Services Ltd.",
  officeAddress: "Jahan Building No. 3, Agrabad C/A, Chittagong",
  businessNature: "Corporate Consulting, Trade & Services",
  highestDegree: "Master of Business Administration (MBA)",
  institution: "University of Dhaka",
  degreeYear: "1994",
  tinNumber: "3847-2918-4829",
  circleZone: "Circle 12, Zone 2 (Chittagong)",
  spouseName: "Shahnaz Parveen Chowdhury",
  spouseDob: "1974-04-20",
  weddingAnniversary: "1996-12-18",
  spouseBloodGroup: "B+",
  spouseNidPassport: "19741592354891240",
  spouseMobile: "+880 1819-382941",
  spouseEmail: "shahnaz.p@hotmail.com",
  child01Name: "Tahsin Reza Chowdhury",
  child01Dob: "1998-05-12",
  child01Gender: "Male",
  child01SchoolOccupation: "Software Engineer",
  child01BloodGroup: "O+",
  child02Name: "Samia Reza Chowdhury",
  child02Dob: "2002-11-28",
  child02Gender: "Female",
  child02SchoolOccupation: "University Student",
  child02BloodGroup: "O+",
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
  numberOfChildren: 2,

  preferredMailingAddress: "present",
  commPreference: "email",
  specialInstructions: "Please contact prior to mailing official documents.",
  preferredCardName: "SAYEED R. CHOWDHURY",
  
  membershipNo: "P-0941",
  emergencyContactName: "Mr. Alim-Al-Razi",
  emergencyMobile: "+880 1713-482910",
  emergencyRelationship: "Colleague & Close Friend",
  emergencyAltTel: "+880 31-724190",
  
  title: "mr",
  professionType: "service",
  officeTel: "+880 31-2512345",
  altContact: "+880 1819-382941",
  residenceTel: "+880 31-724151",

  // References
  ref1Name: "Prof. M. A. Kabir",
  ref1Relationship: "Former Professional Colleague",
  ref1Organization: "Chittagong Chamber of Commerce",
  ref1Designation: "Ex-Director",
  ref1Phone: "+880 1712-987654",
  ref1Email: "makabir.consulting@gmail.com",
  ref1Address: "Agrabad Access Road, Chittagong",
  ref1MemNo: "P-0112",

  ref2Name: "Engr. Tanvir Ahmed",
  ref2Relationship: "Business Associate",
  ref2Organization: "Bengal Shipping Lines Ltd",
  ref2Designation: "Managing Director",
  ref2Phone: "+880 1819-234567",
  ref2Email: "tanvir@bengalshipping.com",
  ref2Address: "GEC Circle, Nasirabad, Chittagong",
  ref2MemNo: "P-0488",

  uploadedDocs: {
    'Passport Size Photograph': {
      fileName: 'Sayeed_Photo_2x2.jpg',
      fileSize: '1.2 MB',
      fileType: 'image/jpeg',
      uploadedAt: '2026-07-26',
    },
    'National ID': {
      fileName: 'NID_SmartCard_Sayeed.pdf',
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
      uploadedAt: '2026-07-26',
    },
    'Signature': {
      fileName: 'Specimen_Signature_Sayeed.png',
      fileSize: '450 KB',
      fileType: 'image/png',
      uploadedAt: '2026-07-26',
    },
  },

  privacyConsent: true,
  
  kycPhoto: true,
  kycNid: true,
  kycSponsor: true,
  kycTin: true,
  kycFeeReceipt: true,
  kycCommittee: true,
  
  privMooring: true,
  privDining: true,
  privSwimming: true,
  privGuest: true,
  privVoting: true,
  privDeepSea: true,

  docNidCopy: true,
  docPassportCopy: true,
  docBirthCert: false,
  docDrivingLicense: true,
  docTinCert: true,

  docPassportPhoto: true,
  docFamilyPhoto: true,
  docSpousePhoto: true,
  docChildrenPhoto: true,

  docCompanyId: true,
  docVisitingCard: true,
  docEmploymentCert: true,
  docTradeLicense: false,
  docProfMembershipCert: true,

  docUtilityBill: true,
  docRentalAgreement: false,
  docPropertyDoc: true,
  docProofPermAddress: true,

  docMarriageCert: true,
  docChildrenBirthCert: true,
  docBoatReg: false,
  docBoatInsurance: false,
  docRecLetter: true,
  docOtherDocs: false,
  docDeclarationSigned: true,
};

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
