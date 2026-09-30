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
            Confidentiality &amp; Data Protection Declaration
          </h3>
        </div>

        <p className="text-[8.5px] text-[#2c2c2c] leading-relaxed mb-3">
          "I understand that, as part of my membership with Cox's Bazar Boat Club Ltd., I may have access to confidential information, documents, records, communications, or personal data relating to the Club, its members, guests, employees, and operations. I hereby agree to maintain the confidentiality of such information and to protect it from unauthorized access, use, disclosure, copying, distribution, or misuse. I further undertake not to intentionally or negligently compromise the privacy, security, or reputation of Cox's Bazar Boat Club Ltd. or its members. I acknowledge that any breach of this declaration may result in disciplinary action, suspension or termination of my membership, and any legal action permitted under applicable laws."
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
            I have read and agree to the Confidentiality and Data Protection Declaration. <span className="text-red-600">*</span>
          </span>
        </label>
      </div>

      {/* SIGNATURE SECTION — signatures are made by hand on the final printed copy after submission */}
      <div className="section pt-2">
        <div className="field-row mt-2">
          <div className="field w2">
            <label className="text-[8px] font-bold uppercase text-[#1a2744]">
              Applicant's Signature{' '}
              <span className="normal-case font-normal italic text-gray-500">(sign on final printed copy)</span>
            </label>
            <div className="border-b border-[#c8c8c8] h-8"></div>
          </div>
          <div className="field">
            <label className="text-[8px] font-bold uppercase text-[#1a2744]">Date</label>
            <div
              title="Filled automatically with the application date"
              className="w-full text-[10px] leading-[3.2] px-2 py-1 border border-[#c8c8c8] rounded bg-gray-100 text-[#2c2c2c] font-semibold"
            >
              {docDate}
            </div>
          </div>
          <div className="field w2">
            <label className="text-[8px] font-bold uppercase text-[#1a2744]">
              Proposer's Name &amp; Signature{' '}
              <span className="normal-case font-normal italic text-gray-500">(sign on final printed copy)</span>
            </label>
            <div className="border-b border-[#c8c8c8] h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
