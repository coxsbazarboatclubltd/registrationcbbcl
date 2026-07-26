export interface MemberFormData {
  candidateName: string;
  fatherHusbandName: string;
  motherName: string;
  dob: string;
  nationality: string;
  bloodGroup: string;
  religion: string;
  nid: string;
  passportNo: string;
  presentAddress: string;
  permanentAddress: string;
  mobile: string;
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
  spouseName: string;
  spouseBloodGroup: string;
  spouseNidPassport: string;
  spouseMobile: string;
  spouseEmail: string;
  child01Name: string;
  child01Dob: string;
  child01BloodGroup: string;
  child02Name: string;
  child02Dob: string;
  child02BloodGroup: string;
  child03Name: string;
  child03Dob: string;
  child03BloodGroup: string;
  
  // Form 2 & 3 specifics
  membershipNo: string;
  emergencyContactName: string;
  emergencyMobile: string;
  emergencyRelationship: string;
  emergencyAltTel: string;
  
  // Form 3 specifics
  membershipCategory: 'permanent' | 'life' | 'associate' | 'honorary' | 'donor';
  title: 'mr' | 'mrs' | 'dr' | 'capt' | 'fl' | 'adm';
  professionType: 'business' | 'service' | 'retired' | 'other';
  officeTel: string;
  altContact: string;
  residenceTel: string;
  
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
}

export const SAMPLE_MEMBER_DATA: MemberFormData = {
  candidateName: "SAYEED REZA CHOWDHURY",
  fatherHusbandName: "Late Alhaj Muzaffar Ahmed Chowdhury",
  motherName: "Begum Anwara Chowdhury",
  dob: "1968-10-14",
  nationality: "Bangladeshi",
  bloodGroup: "O+",
  religion: "Islam",
  nid: "19681592471852936",
  passportNo: "A08492158",
  presentAddress: "House 24, Road 8, Block G, Halishahar R/A, Chittagong, Bangladesh",
  permanentAddress: "Chowdhury Villa, West Sultanpur, Raozan, Chittagong, Bangladesh",
  mobile: "+880 1711-582941",
  email: "reza.chowdhury@navy-veterans.org",
  designation: "Senior Marine Advisor & Director",
  companyName: "Bay of Bengal Maritime Services Ltd.",
  officeAddress: "Jahan Building No. 3, Agrabad C/A, Chittagong",
  businessNature: "Maritime Logistics, Port Operations",
  highestDegree: "Master of Science in Defence Studies",
  institution: "National Defence College (NDC)",
  degreeYear: "1994",
  tinNumber: "3847-2918-4829",
  circleZone: "Circle 12, Zone 2 (Chittagong)",
  spouseName: "Shahnaz Parveen Chowdhury",
  spouseBloodGroup: "B+",
  spouseNidPassport: "19741592354891240",
  spouseMobile: "+888 1819-382941",
  spouseEmail: "shahnaz.p@hotmail.com",
  child01Name: "Tahsin Reza Chowdhury",
  child01Dob: "1998-05-12",
  child01BloodGroup: "O+",
  child02Name: "Samia Reza Chowdhury",
  child02Dob: "2002-11-28",
  child02BloodGroup: "O+",
  child03Name: "",
  child03Dob: "",
  child03BloodGroup: "",
  
  membershipNo: "P-0941",
  emergencyContactName: "Captain Alim-Al-Razi",
  emergencyMobile: "+880 1713-482910",
  emergencyRelationship: "Colleague & Close Friend",
  emergencyAltTel: "+880 31-724190",
  
  membershipCategory: "permanent",
  title: "mr",
  professionType: "service",
  officeTel: "+880 31-2512345",
  altContact: "+880 1819-382941",
  residenceTel: "+880 31-724151",
  
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
};

export const EMPTY_MEMBER_DATA: MemberFormData = {
  candidateName: "",
  fatherHusbandName: "",
  motherName: "",
  dob: "",
  nationality: "Bangladeshi",
  bloodGroup: "",
  religion: "Islam",
  nid: "",
  passportNo: "",
  presentAddress: "",
  permanentAddress: "",
  mobile: "+880",
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
  spouseBloodGroup: "",
  spouseNidPassport: "",
  spouseMobile: "+880",
  spouseEmail: "",
  child01Name: "",
  child01Dob: "",
  child01BloodGroup: "",
  child02Name: "",
  child02Dob: "",
  child02BloodGroup: "",
  child03Name: "",
  child03Dob: "",
  child03BloodGroup: "",
  
  membershipNo: "P-0000",
  emergencyContactName: "",
  emergencyMobile: "+880",
  emergencyRelationship: "",
  emergencyAltTel: "+880",
  
  membershipCategory: "permanent",
  title: "mr",
  professionType: "service",
  officeTel: "+880",
  altContact: "+880",
  residenceTel: "+880",
  
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
};
