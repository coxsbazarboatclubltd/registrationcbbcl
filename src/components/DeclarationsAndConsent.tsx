import React from 'react';
import { MemberFormData } from '../types';

interface DeclarationsAndConsentProps {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docDate: string;
}

export const DeclarationsAndConsent: React.FC<DeclarationsAndConsentProps> = ({
  data,
  onChange,
  docDate,
}) => {
  return (
    <div className="space-y-4 my-4">
      {/* SELF DECLARATION SECTION */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">07</div>
          <h2>Self Declaration</h2>
        </div>

        {/* Existing declaration */}
        <p className="text-[8.5px] text-[#2c2c2c] leading-relaxed mb-2">
          I hereby declare that all information provided in this application is true and correct to the best of my knowledge. I agree to abide by the rules, regulations, and bye-laws of Cox's Bazar Boat Club Ltd. and understand that any false declaration may result in disqualification or cancellation of membership.
        </p>

        {/* Additional Declaration Paragraph (Requirement 3) */}
        <div className="bg-[#f8f5ee] border-l-2 border-[#9d7f46] p-2.5 my-2 text-[8.5px] text-[#1a2744] font-medium leading-relaxed">
          "I hereby certify that all information and supporting documents submitted with this application are true, complete, and accurate. I understand that providing false, misleading, or incomplete information may result in rejection of my application or cancellation of membership."
        </div>
      </div>

      {/* CONFIDENTIALITY & DATA PRIVACY CONSENT (Requirement 5) */}
      <div className="section bg-[#faf8f5] border border-[#9d7f46]/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#9d7f46]/30 text-[#1a2744]">
          <span className="text-sm">🔒</span>
          <h3 className="font-['Cinzel'] font-bold text-xs uppercase tracking-wider text-[#1a2744]">
            Confidentiality &amp; Data Privacy Consent
          </h3>
        </div>

        <p className="text-[8.5px] text-[#2c2c2c] leading-relaxed mb-3">
          "I understand that the information and documents submitted in this application will be collected, processed, and securely stored by Cox's Bazar Boat Club Ltd. solely for membership administration, verification, legal compliance, and club operations. My personal information will be treated confidentially and will not be disclosed to unauthorized third parties except where required by law."
        </p>

        {/* Mandatory Consent Checkbox */}
        <label className="flex items-start gap-2 cursor-pointer select-none bg-white p-2 rounded border border-[#9d7f46]/40 hover:border-[#1a2744] transition-colors">
          <input
            type="checkbox"
            checked={data.privacyConsent || false}
            onChange={(e) => {
              onChange('privacyConsent', e.target.checked);
              onChange('docDeclarationSigned', e.target.checked);
            }}
            className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-[#1a2744] focus:ring-[#1a2744]"
          />
          <span className="text-[9.5px] font-bold text-[#1a2744] leading-snug">
            I have read and agree to the Confidentiality and Data Privacy Statement. <span className="text-red-600">*</span>
          </span>
        </label>
      </div>

      {/* SIGNATURE SECTION */}
      <div className="section pt-2">
        <div className="field-row mt-2">
          <div className="field w2">
            <label className="text-[8px] font-bold uppercase text-[#1a2744]">Applicant's Signature</label>
            <div className="border-b border-[#c8c8c8] h-8 flex items-end pb-1 text-[10px] font-serif italic text-gray-700">
              {data.candidateName ? `Signed electronically by: ${data.candidateName}` : ''}
            </div>
          </div>
          <div className="field">
            <label className="text-[8px] font-bold uppercase text-[#1a2744]">Date</label>
            <input
              type="date"
              value={docDate}
              readOnly
              className="w-full text-[10px] leading-[2.8] px-2 py-1 border border-[#c8c8c8] rounded bg-gray-50 text-[#2c2c2c]"
            />
          </div>
          <div className="field w2">
            <label className="text-[8px] font-bold uppercase text-[#1a2744]">Proposer's Name &amp; Signature</label>
            <div className="border-b border-[#c8c8c8] h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
