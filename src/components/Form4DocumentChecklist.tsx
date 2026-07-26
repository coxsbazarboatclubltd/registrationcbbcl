import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { MemberFormData } from '../types';
import { PhotoUploader } from './PhotoUploader';

interface Form4Props {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

export const Form4DocumentChecklist: React.FC<Form4Props> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  // Array of document keys for calculation
  const checklistKeys: (keyof MemberFormData)[] = [
    // Section 1: Identity (5)
    'docNidCopy',
    'docPassportCopy',
    'docBirthCert',
    'docDrivingLicense',
    'docTinCert',
    // Section 2: Photographs (4)
    'docPassportPhoto',
    'docFamilyPhoto',
    'docSpousePhoto',
    'docChildrenPhoto',
    // Section 3: Professional (5)
    'docCompanyId',
    'docVisitingCard',
    'docEmploymentCert',
    'docTradeLicense',
    'docProfMembershipCert',
    // Section 4: Residential (4)
    'docUtilityBill',
    'docRentalAgreement',
    'docPropertyDoc',
    'docProofPermAddress',
    // Section 5: Supporting (6)
    'docMarriageCert',
    'docChildrenBirthCert',
    'docBoatReg',
    'docBoatInsurance',
    'docRecLetter',
    'docOtherDocs',
  ];

  const totalRequired = checklistKeys.length; // 24
  const submittedCount = checklistKeys.reduce((acc, key) => (data[key] ? acc + 1 : acc), 0);
  const missingCount = totalRequired - submittedCount;
  const completionPercentage = Math.round((submittedCount / totalRequired) * 100);

  return (
    <div className="page" id="form-4-page">
      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="logo-wrap">
            <CbbcLogo clipPathId="clippath-f4" className="w-[52px] h-[52px]" />
          </div>
          <div className="club-name">
            <div className="est">Established 2026</div>
            <h1>
              COX'S BAZAR<br />BOAT CLUB
            </h1>
            <div className="sub">
              Marine Drive · Cox's Bazar · People's Republic of Bangladesh
            </div>
            <div className="form-title">
              04. DOCUMENT CHECKLIST &nbsp;–&nbsp;
              <span className="font-semibold text-[#c4a56a]">Audit &amp; Submission Status</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <table className="doc-table">
            <tbody>
              <tr>
                <td>DOC NO:</td>
                <td>{docNo}</td>
              </tr>
              <tr>
                <td>DATE:</td>
                <td>{docDate}</td>
              </tr>
              <tr>
                <td>VER/REV:</td>
                <td>Ver 1.0 / R01</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PURPOSE BANNER */}
      <div className="bg-[#1a2744]/5 border border-[#1a2744]/20 rounded p-2 mb-3 text-[8.5px] leading-relaxed text-[#2c2c2c] flex items-center justify-between">
        <div>
          <strong className="text-[#1a2744] font-bold uppercase tracking-wider">Purpose:</strong>{' '}
          This audit checklist enables the applicant and secretariat to verify all required supporting documents submitted with the membership application.
        </div>
        <div className="text-[8px] font-bold uppercase tracking-wider text-[#9d7f46] px-2 py-0.5 bg-white border border-[#9d7f46]/30 rounded ml-2 whitespace-nowrap">
          Official Audit Record
        </div>
      </div>

      {/* DOCUMENT SECTIONS GRID (SECTIONS 01 - 05) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* SECTION 01 – IDENTITY DOCUMENTS */}
        <div className="checklist-col">
          <div className="cl-title flex justify-between items-center">
            <span>01. IDENTITY DOCUMENTS</span>
            <span className="text-[7px] text-[#6b6b6b]">
              {[data.docNidCopy, data.docPassportCopy, data.docBirthCert, data.docDrivingLicense, data.docTinCert].filter(Boolean).length}/5 Checked
            </span>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docNidCopy"
              checked={data.docNidCopy}
              onChange={(e) => onChange('docNidCopy', e.target.checked)}
            />
            <label htmlFor="chk_docNidCopy">National ID Copy</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docPassportCopy"
              checked={data.docPassportCopy}
              onChange={(e) => onChange('docPassportCopy', e.target.checked)}
            />
            <label htmlFor="chk_docPassportCopy">Passport Copy</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docBirthCert"
              checked={data.docBirthCert}
              onChange={(e) => onChange('docBirthCert', e.target.checked)}
            />
            <label htmlFor="chk_docBirthCert">Birth Certificate</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docDrivingLicense"
              checked={data.docDrivingLicense}
              onChange={(e) => onChange('docDrivingLicense', e.target.checked)}
            />
            <label htmlFor="chk_docDrivingLicense">Driving License</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docTinCert"
              checked={data.docTinCert}
              onChange={(e) => onChange('docTinCert', e.target.checked)}
            />
            <label htmlFor="chk_docTinCert">Tax Identification Certificate (TIN)</label>
          </div>
        </div>

        {/* SECTION 02 – PHOTOGRAPHS */}
        <div className="checklist-col">
          <div className="cl-title flex justify-between items-center">
            <span>02. PHOTOGRAPHS</span>
            <span className="text-[7px] text-[#6b6b6b]">
              {[data.docPassportPhoto, data.docFamilyPhoto, data.docSpousePhoto, data.docChildrenPhoto].filter(Boolean).length}/4 Checked
            </span>
          </div>

          <div className="space-y-2 my-1">
            {/* Passport Photo */}
            <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 border border-gray-200 rounded">
              <div className="cl-item !mb-0 flex-1">
                <input
                  type="checkbox"
                  id="chk_docPassportPhoto"
                  checked={data.docPassportPhoto}
                  onChange={(e) => onChange('docPassportPhoto', e.target.checked)}
                />
                <label htmlFor="chk_docPassportPhoto" className="font-semibold text-[8px]">
                  Passport Size Photo
                </label>
              </div>
              <PhotoUploader
                label="Upload"
                photoUrl={data.candidatePhotoUrl}
                onPhotoChange={(url) => {
                  onChange('candidatePhotoUrl', url);
                  onChange('docPassportPhoto', Boolean(url));
                }}
                className="w-10 h-10 border-solid"
              />
            </div>

            {/* Family Photo */}
            <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 border border-gray-200 rounded">
              <div className="cl-item !mb-0 flex-1">
                <input
                  type="checkbox"
                  id="chk_docFamilyPhoto"
                  checked={data.docFamilyPhoto}
                  onChange={(e) => onChange('docFamilyPhoto', e.target.checked)}
                />
                <label htmlFor="chk_docFamilyPhoto" className="font-semibold text-[8px]">
                  Family Photograph
                </label>
              </div>
              <PhotoUploader
                label="Upload"
                photoUrl={data.familyPhotoUrl}
                onPhotoChange={(url) => {
                  onChange('familyPhotoUrl', url);
                  onChange('docFamilyPhoto', Boolean(url));
                }}
                className="w-10 h-10 border-solid"
              />
            </div>

            {/* Spouse Photo */}
            <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 border border-gray-200 rounded">
              <div className="cl-item !mb-0 flex-1">
                <input
                  type="checkbox"
                  id="chk_docSpousePhoto"
                  checked={data.docSpousePhoto}
                  onChange={(e) => onChange('docSpousePhoto', e.target.checked)}
                />
                <label htmlFor="chk_docSpousePhoto" className="font-semibold text-[8px]">
                  Spouse Photograph
                </label>
              </div>
              <PhotoUploader
                label="Upload"
                photoUrl={data.spousePhotoUrl}
                onPhotoChange={(url) => {
                  onChange('spousePhotoUrl', url);
                  onChange('docSpousePhoto', Boolean(url));
                }}
                className="w-10 h-10 border-solid"
              />
            </div>

            {/* Children Photo */}
            <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 border border-gray-200 rounded">
              <div className="cl-item !mb-0 flex-1">
                <input
                  type="checkbox"
                  id="chk_docChildrenPhoto"
                  checked={data.docChildrenPhoto}
                  onChange={(e) => onChange('docChildrenPhoto', e.target.checked)}
                />
                <label htmlFor="chk_docChildrenPhoto" className="font-semibold text-[8px]">
                  Children Photograph
                </label>
              </div>
              <PhotoUploader
                label="Upload"
                photoUrl={data.child01PhotoUrl}
                onPhotoChange={(url) => {
                  onChange('child01PhotoUrl', url);
                  onChange('docChildrenPhoto', Boolean(url));
                }}
                className="w-10 h-10 border-solid"
              />
            </div>
          </div>
        </div>

        {/* SECTION 03 – PROFESSIONAL DOCUMENTS */}
        <div className="checklist-col">
          <div className="cl-title flex justify-between items-center">
            <span>03. PROFESSIONAL DOCUMENTS</span>
            <span className="text-[7px] text-[#6b6b6b]">
              {[data.docCompanyId, data.docVisitingCard, data.docEmploymentCert, data.docTradeLicense, data.docProfMembershipCert].filter(Boolean).length}/5 Checked
            </span>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docCompanyId"
              checked={data.docCompanyId}
              onChange={(e) => onChange('docCompanyId', e.target.checked)}
            />
            <label htmlFor="chk_docCompanyId">Company ID</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docVisitingCard"
              checked={data.docVisitingCard}
              onChange={(e) => onChange('docVisitingCard', e.target.checked)}
            />
            <label htmlFor="chk_docVisitingCard">Visiting Card</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docEmploymentCert"
              checked={data.docEmploymentCert}
              onChange={(e) => onChange('docEmploymentCert', e.target.checked)}
            />
            <label htmlFor="chk_docEmploymentCert">Employment Certificate</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docTradeLicense"
              checked={data.docTradeLicense}
              onChange={(e) => onChange('docTradeLicense', e.target.checked)}
            />
            <label htmlFor="chk_docTradeLicense">Business Trade License</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docProfMembershipCert"
              checked={data.docProfMembershipCert}
              onChange={(e) => onChange('docProfMembershipCert', e.target.checked)}
            />
            <label htmlFor="chk_docProfMembershipCert">Professional Membership Certificate</label>
          </div>
        </div>

        {/* SECTION 04 – RESIDENTIAL DOCUMENTS */}
        <div className="checklist-col">
          <div className="cl-title flex justify-between items-center">
            <span>04. RESIDENTIAL DOCUMENTS</span>
            <span className="text-[7px] text-[#6b6b6b]">
              {[data.docUtilityBill, data.docRentalAgreement, data.docPropertyDoc, data.docProofPermAddress].filter(Boolean).length}/4 Checked
            </span>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docUtilityBill"
              checked={data.docUtilityBill}
              onChange={(e) => onChange('docUtilityBill', e.target.checked)}
            />
            <label htmlFor="chk_docUtilityBill">Utility Bill</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docRentalAgreement"
              checked={data.docRentalAgreement}
              onChange={(e) => onChange('docRentalAgreement', e.target.checked)}
            />
            <label htmlFor="chk_docRentalAgreement">Rental Agreement</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docPropertyDoc"
              checked={data.docPropertyDoc}
              onChange={(e) => onChange('docPropertyDoc', e.target.checked)}
            />
            <label htmlFor="chk_docPropertyDoc">Property Ownership Document</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docProofPermAddress"
              checked={data.docProofPermAddress}
              onChange={(e) => onChange('docProofPermAddress', e.target.checked)}
            />
            <label htmlFor="chk_docProofPermAddress">Proof of Permanent Address</label>
          </div>
        </div>
      </div>

      {/* SECTION 05 – SUPPORTING DOCUMENTS (Full width) */}
      <div className="checklist-col mb-3">
        <div className="cl-title flex justify-between items-center">
          <span>05. SUPPORTING DOCUMENTS</span>
          <span className="text-[7px] text-[#6b6b6b]">
            {[data.docMarriageCert, data.docChildrenBirthCert, data.docBoatReg, data.docBoatInsurance, data.docRecLetter, data.docOtherDocs].filter(Boolean).length}/6 Checked
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docMarriageCert"
              checked={data.docMarriageCert}
              onChange={(e) => onChange('docMarriageCert', e.target.checked)}
            />
            <label htmlFor="chk_docMarriageCert">Marriage Certificate</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docChildrenBirthCert"
              checked={data.docChildrenBirthCert}
              onChange={(e) => onChange('docChildrenBirthCert', e.target.checked)}
            />
            <label htmlFor="chk_docChildrenBirthCert">Children's Birth Certificates</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docBoatReg"
              checked={data.docBoatReg}
              onChange={(e) => onChange('docBoatReg', e.target.checked)}
            />
            <label htmlFor="chk_docBoatReg">Boat Registration</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docBoatInsurance"
              checked={data.docBoatInsurance}
              onChange={(e) => onChange('docBoatInsurance', e.target.checked)}
            />
            <label htmlFor="chk_docBoatInsurance">Boat Insurance</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docRecLetter"
              checked={data.docRecLetter}
              onChange={(e) => onChange('docRecLetter', e.target.checked)}
            />
            <label htmlFor="chk_docRecLetter">Recommendation Letter</label>
          </div>
          <div className="cl-item">
            <input
              type="checkbox"
              id="chk_docOtherDocs"
              checked={data.docOtherDocs}
              onChange={(e) => onChange('docOtherDocs', e.target.checked)}
            />
            <label htmlFor="chk_docOtherDocs">Other Supporting Documents</label>
          </div>
        </div>
      </div>

      {/* SECTION 06 – OFFICE USE */}
      <div className="border border-[#1a2744]/30 rounded p-2.5 mb-3 bg-[#f8fafc] text-[#2c2c2c]">
        <div className="flex items-center justify-between border-b border-[#1a2744]/20 pb-1 mb-2">
          <div className="font-['Cinzel'] font-bold text-[9px] uppercase tracking-wider text-[#1a2744] flex items-center gap-1.5">
            <span>🏛</span> 06. OFFICE USE (Secretariat Staff Verification)
          </div>
          <span className="text-[7.5px] font-bold text-[#9d7f46] bg-[#9d7f46]/10 px-1.5 py-0.5 rounded border border-[#9d7f46]/20">
            Internal Audit Only
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[8px]">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <input type="checkbox" disabled readOnly />
            <span className="font-medium">Application Received</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <input type="checkbox" disabled readOnly />
            <span className="font-medium">Document Verification</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <input type="checkbox" disabled readOnly />
            <span className="font-medium">Background Verification</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <input type="checkbox" disabled readOnly />
            <span className="font-medium">Committee Review</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <input type="checkbox" disabled readOnly />
            <span className="font-medium">Board Approval</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <input type="checkbox" disabled readOnly />
            <span className="font-medium">Membership No. Assigned</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <input type="checkbox" disabled readOnly />
            <span className="font-medium">Card Printed</span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded opacity-80 cursor-not-allowed">
            <span className="text-[7.5px] font-bold text-gray-500">Sign: ____________</span>
          </div>
        </div>
      </div>

      {/* SECTION 07 – DECLARATION */}
      <div className="section mb-3">
        <div className="section-title">
          <div className="section-num">07</div>
          <h2>07. Declaration</h2>
        </div>
        <div className="bg-[#fffdf7] border border-[#c4a56a]/40 rounded p-2.5 space-y-2">
          <p className="text-[8.5px] italic text-gray-800 font-medium leading-relaxed">
            "I hereby confirm that all submitted documents are genuine and complete to the best of my knowledge."
          </p>
          <div className="flex items-center gap-2 pt-1 border-t border-[#c4a56a]/20">
            <input
              type="checkbox"
              id="chk_docDeclarationSigned"
              checked={data.docDeclarationSigned}
              onChange={(e) => onChange('docDeclarationSigned', e.target.checked)}
              className="accent-[#1a2744] w-3.5 h-3.5 cursor-pointer"
            />
            <label htmlFor="chk_docDeclarationSigned" className="text-[8px] font-bold text-[#1a2744] cursor-pointer">
              Applicant Signature Confirmation
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[8px]">
            <div>
              <label className="block text-[7px] font-bold uppercase text-[#6b6b6b] mb-0.5">
                Applicant Name
              </label>
              <div className="font-bold text-[#1a2744] border-b border-[#c8c8c8] pb-0.5 min-h-[18px]">
                {data.candidateName || 'Not Provided'}
              </div>
            </div>
            <div>
              <label className="block text-[7px] font-bold uppercase text-[#6b6b6b] mb-0.5">
                Submission Date
              </label>
              <div className="font-bold text-[#1a2744] border-b border-[#c8c8c8] pb-0.5 min-h-[18px]">
                {docDate}
              </div>
            </div>
            <div>
              <label className="block text-[7px] font-bold uppercase text-[#6b6b6b] mb-0.5">
                Applicant Signature Verification
              </label>
              <div className="font-['Cinzel'] font-bold text-[#2e7d32] border-b border-[#c8c8c8] pb-0.5 min-h-[18px]">
                {data.docDeclarationSigned ? `✓ SIGNED BY ${data.candidateName || 'APPLICANT'}` : 'PENDING SIGNATURE'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 08 – FINAL SUBMISSION STATUS */}
      <div className="section mb-2">
        <div className="section-title">
          <div className="section-num">08</div>
          <h2>08. Final Submission Status Summary</h2>
        </div>

        <div className="bg-[#1a2744] text-white rounded p-3 shadow-sm border border-[#c4a56a]/40">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-b border-white/10 pb-2 mb-2">
            <div className="p-1.5 bg-white/5 rounded border border-white/10">
              <div className="text-[7px] uppercase tracking-wider text-[#c4a56a] font-bold">
                Total Required
              </div>
              <div className="font-['Cinzel'] font-bold text-base text-white">{totalRequired}</div>
            </div>
            <div className="p-1.5 bg-white/5 rounded border border-white/10">
              <div className="text-[7px] uppercase tracking-wider text-emerald-400 font-bold">
                Total Submitted
              </div>
              <div className="font-['Cinzel'] font-bold text-base text-emerald-400">{submittedCount}</div>
            </div>
            <div className="p-1.5 bg-white/5 rounded border border-white/10">
              <div className="text-[7px] uppercase tracking-wider text-amber-400 font-bold">
                Missing Documents
              </div>
              <div className="font-['Cinzel'] font-bold text-base text-amber-400">{missingCount}</div>
            </div>
            <div className="p-1.5 bg-white/5 rounded border border-white/10">
              <div className="text-[7px] uppercase tracking-wider text-[#c4a56a] font-bold">
                Completion Rate
              </div>
              <div className="font-['Cinzel'] font-bold text-base text-[#c4a56a]">
                {completionPercentage}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[7.5px] uppercase tracking-wider text-gray-300 font-medium">
              <span>Overall Document Audit Progress</span>
              <span>{submittedCount} of {totalRequired} Verified</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5 border border-white/20">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  completionPercentage >= 80
                    ? 'bg-emerald-400'
                    : completionPercentage >= 50
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
          <br />
          Marine Drive, Cox's Bazar, Bangladesh
        </div>
        <div className="footer-center">Confidential Institutional Document</div>
        <div className="footer-right">Page 4 of 4 &nbsp;|&nbsp; Print-Ready A4</div>
      </div>
    </div>
  );
};
