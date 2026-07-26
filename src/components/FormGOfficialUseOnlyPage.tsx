import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';

interface FormGProps {
  data: MemberFormData;
  docNo: string;
  docDate: string;
}

export const FormGOfficialUseOnlyPage: React.FC<FormGProps> = ({
  data,
  docNo,
  docDate,
}) => {
  return (
    <div className="page" id="form-7-page">
      {/* WATERMARK */}
      <div className="watermark-overlay" aria-hidden="true">
        <CbbcWatermarkLogo className="w-full h-auto" />
      </div>

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="club-name">
            <div className="est">Established 2026</div>
            <h1>
              COX'S BAZAR<br />BOAT CLUB
            </h1>
            <div className="sub">
              Marine Drive · Cox's Bazar · People's Republic of Bangladesh
            </div>
            <div className="form-title font-bold text-red-800">
              OFFICIAL USE ONLY · INTERNAL PROCESSING &amp; BOARD APPROVAL
            </div>
          </div>
        </div>
        <div className="header-center">
          <CbbcLogo className="w-[58px] h-[58px]" />
        </div>
        <div className="header-right">
          <table className="doc-table">
            <tbody>
              <tr>
                <td>Registration No.:</td>
                <td className="font-bold text-[#0f5132]">{data.registrationNumber || 'CBBCL-2026-000001'}</td>
              </tr>
              <tr>
                <td>Document No.:</td>
                <td>{docNo || 'CBBCL-DOC-20260726-00001'}</td>
              </tr>
              <tr>
                <td>Application Date:</td>
                <td>{docDate}</td>
              </tr>
              <tr>
                <td>Document Version:</td>
                <td>Ver 1.0 / R01</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTICE BANNER */}
      <div className="bg-red-50 border border-red-200 text-red-900 rounded p-2 mb-3 text-[9px]">
        <div className="font-bold uppercase tracking-wider mb-0.5">⚠️ Confidential Internal Secretariat Document</div>
        <p className="text-[8.5px] leading-tight">
          This page is reserved strictly for Secretariat Processing, Background Checks, Balloting, and Executive Board Signatures. It is not editable by applicants and forms the official archival record of Cox's Bazar Boat Club Ltd.
        </p>
      </div>

      {/* SECTION 01 – APPLICATION PROCESSING METADATA */}
      <div className="section mb-2.5">
        <div className="section-title">
          <div className="section-num">01</div>
          <h2>Application Processing Metadata</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] bg-[#faf8f5] p-2 border border-[#9d7f46]/30 rounded">
          <div>
            <span className="text-[#7a5c1e] font-bold block">Application Received Date:</span>
            <span className="font-mono text-[#1a2744] font-bold">{docDate}</span>
          </div>
          <div>
            <span className="text-[#7a5c1e] font-bold block">Document Reference:</span>
            <span className="font-mono text-[#1a2744] font-bold">{docNo || 'CBBCL-DOC-20260726-00001'}</span>
          </div>
          <div>
            <span className="text-[#7a5c1e] font-bold block">Membership Category:</span>
            <span className="font-bold text-[#1a2744]">{data.membershipCategory || 'Permanent Member'}</span>
          </div>
          <div>
            <span className="text-[#7a5c1e] font-bold block">Processing Status:</span>
            <span className="font-bold text-[#0f5132]">Received &amp; Under Audit</span>
          </div>
        </div>
      </div>

      {/* SECTION 02 – VERIFICATION & COMMITTEE RECOMMENDATION */}
      <div className="section mb-2.5">
        <div className="section-title">
          <div className="section-num">02</div>
          <h2>Document &amp; Background Verification</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[9px]">
          <div className="border border-[#c8c8c8] p-2 rounded bg-white">
            <div className="font-bold text-[#1a2744] border-b border-[#c8c8c8] pb-1 mb-1">Document Verification Status</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>NID / Passport Check:</span>
                <span className="font-bold text-[#0f5132]">✓ Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Specimen Photo &amp; Signature:</span>
                <span className="font-bold text-[#0f5132]">✓ Authenticated</span>
              </div>
              <div className="flex justify-between">
                <span>Reference Person Verification:</span>
                <span className="font-bold text-[#0f5132]">✓ Contacted &amp; Cleared</span>
              </div>
            </div>
          </div>

          <div className="border border-[#c8c8c8] p-2 rounded bg-white">
            <div className="font-bold text-[#1a2744] border-b border-[#c8c8c8] pb-1 mb-1">Background Verification Remarks</div>
            <p className="text-[8.5px] text-gray-600 italic">
              Candidate background, financial status, and professional standing reviewed. No adverse security record identified. Recommended for Executive Board balloting.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 03 – BOARD DECISION & MEMBERSHIP STATUS */}
      <div className="section mb-2.5">
        <div className="section-title">
          <div className="section-num">03</div>
          <h2>Membership Committee Recommendation &amp; Board Decision</h2>
        </div>
        <div className="border border-[#9d7f46]/40 bg-[#faf8f5] p-2.5 rounded text-[9px] grid grid-cols-3 gap-3">
          <div>
            <span className="font-bold text-[#1a2744] block mb-1">Committee Recommendation:</span>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 border border-green-300 px-2 py-0.5 rounded font-bold">
                ✓ RECOMMENDED
              </span>
            </div>
          </div>
          <div>
            <span className="font-bold text-[#1a2744] block mb-1">Board Approval Decision:</span>
            <div className="flex items-center gap-2">
              <span className="bg-[#1a2744] text-[#9d7f46] font-bold px-2 py-0.5 rounded border border-[#9d7f46]/40">
                APPROVED BY BOARD
              </span>
            </div>
          </div>
          <div>
            <span className="font-bold text-[#1a2744] block mb-1">Assigned Membership ID / Status:</span>
            <div className="font-mono font-bold text-[#0f5132]">
              ID: P-2026-0812 (Active)
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 04 – OFFICE NOTES & INTERVIEW NOTES */}
      <div className="section mb-2.5">
        <div className="section-title">
          <div className="section-num">04</div>
          <h2>Office Notes &amp; Applicant Interview Remarks</h2>
        </div>
        <div className="border border-[#c8c8c8] p-2 rounded min-h-[55px] bg-white text-[8.5px] text-gray-700">
          <div className="font-bold text-[#1a2744] mb-1">Applicant Interview &amp; Balloting Notes:</div>
          Candidate interviewed by Membership Scrutiny Panel on ________________. Credentials verified against official club membership standards. Passed executive balloting unanimously. Entrance fee and inaugural subscription cleared under Receipt No: _______________.
        </div>
      </div>

      {/* SECTION 05 – OFFICIAL APPROVAL SIGNATURES & CLUB SEAL */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">05</div>
          <h2>Approval Signatures &amp; Official Seal</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-2 text-[8.5px]">
          {/* Row 1 Signatures */}
          <div className="border-t border-[#1a2744] pt-1 text-center">
            <div className="font-bold text-[#1a2744]">PREPARED BY</div>
            <div className="text-gray-500">Membership Desk Officer</div>
          </div>

          <div className="border-t border-[#1a2744] pt-1 text-center">
            <div className="font-bold text-[#1a2744]">VERIFIED BY</div>
            <div className="text-gray-500">Administrative Officer</div>
          </div>

          <div className="border-t border-[#1a2744] pt-1 text-center">
            <div className="font-bold text-[#1a2744]">TREASURER</div>
            <div className="text-gray-500">Cox's Bazar Boat Club Ltd.</div>
          </div>

          {/* Row 2 Signatures */}
          <div className="border-t border-[#1a2744] pt-4 text-center">
            <div className="font-bold text-[#1a2744]">MEMBERSHIP COMMITTEE CHAIR</div>
            <div className="text-gray-500">Selection Panel</div>
          </div>

          <div className="border-t border-[#1a2744] pt-4 text-center">
            <div className="font-bold text-[#1a2744]">SECRETARY GENERAL</div>
            <div className="text-gray-500">Executive Secretariat</div>
          </div>

          <div className="border-t border-[#1a2744] pt-4 text-center">
            <div className="font-bold text-[#1a2744]">PRESIDENT</div>
            <div className="text-gray-500">Executive Committee</div>
          </div>
        </div>

        {/* OFFICIAL SEAL BOX */}
        <div className="mt-3 flex justify-center">
          <div className="border-2 border-dashed border-[#9d7f46] rounded p-2 text-center w-[200px] h-[60px] flex flex-col justify-center items-center">
            <div className="text-[8px] font-bold text-[#9d7f46] uppercase tracking-wider">OFFICIAL CLUB SEAL</div>
            <div className="text-[7px] text-gray-400 font-serif">Cox's Bazar Boat Club Ltd.</div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
          <br />
          Marine Drive, Cox's Bazar, People's Republic of Bangladesh
          <br />
          Tel: +880 1700-000000 | Email: info@coxsbazarboatclub.com | Web: www.coxsbazarboatclub.com
        </div>
        <div className="footer-center">Confidential Document</div>
        <div className="footer-right">Page 7 of 7 &nbsp;|&nbsp; Official Registration Package</div>
      </div>
    </div>
  );
};
