import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';
import { formatLongDate } from '../utils/formatDate';
import { useBlankForm } from './BlankFormContext';
import { REGISTRATION_NUMBER_PENDING } from '../utils/ids';

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
  const isBlankForm = useBlankForm();
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
            <h1 className="whitespace-nowrap">COX'S BAZAR BOAT CLUB LTD.</h1>
            <div className="sub">
              Anderson Road,<br />
              Cox's Bazar 4700. Bangladesh.
            </div>
            <div className="site-url">www.cbbcl.org</div>
          </div>
        </div>
        <div className="header-center">
          <CbbcWatermarkLogo className="w-[92px] h-[92px]" />
        </div>
        <div className="header-right">
          <table className="doc-table">
            <tbody>
              <tr>
                <td>Registration No.:</td>
                <td className="font-bold text-[#0f5132]">{data.registrationNumber || REGISTRATION_NUMBER_PENDING}</td>
              </tr>
              <tr>
                <td>Document No.:</td>
                <td>{docNo}</td>
              </tr>
              <tr>
                <td>Application Date:</td>
                <td>{formatLongDate(docDate)}</td>
              </tr>
              <tr>
                <td>Document Version:</td>
                <td>Ver 1.0 / R01</td>
              </tr>
            </tbody>
          </table>
          <div className="form-title font-bold text-red-800">
            OFFICIAL USE ONLY · INTERNAL PROCESSING &amp; BOARD APPROVAL
          </div>
        </div>
      </div>

      {/* NOTICE BANNER */}
      <div className="bg-red-50 border border-red-200 text-red-900 rounded p-2 mb-3 text-[9px]">
        <div className="font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
          <AlertTriangle className="w-[11px] h-[11px] shrink-0" aria-hidden="true" /> Confidential Internal Secretariat Document
        </div>
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
            <span className="font-mono text-[#1a2744] font-bold">{formatLongDate(docDate)}</span>
          </div>
          <div>
            <span className="text-[#7a5c1e] font-bold block">Document Reference:</span>
            <span className="font-mono text-[#1a2744] font-bold">{docNo}</span>
          </div>
          <div>
            <span className="text-[#7a5c1e] font-bold block">Membership Category:</span>
            <span className="font-bold text-[#1a2744]">{data.membershipCategory || 'Permanent Member'}</span>
          </div>
          <div>
            <span className="text-[#7a5c1e] font-bold block">Processing Status:</span>
            <span className="font-bold text-[#0f5132]">{isBlankForm ? '' : 'Received & Under Audit'}</span>
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
              {['NID / Passport Check:', 'Specimen Photo & Signature:', 'Reference Person Verification:'].map((label) => (
                <div key={label} className="flex items-end gap-2">
                  <span className="shrink-0">{label}</span>
                  <span className="flex-1 border-b border-dotted border-gray-400 h-[12px]" />
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#c8c8c8] p-2 rounded bg-white">
            <div className="font-bold text-[#1a2744] border-b border-[#c8c8c8] pb-1 mb-1">Background Verification Remarks</div>
            <div className="space-y-1">
              <div className="border-b border-dotted border-gray-400 h-[12px]" />
              <div className="border-b border-dotted border-gray-400 h-[12px]" />
              <div className="border-b border-dotted border-gray-400 h-[12px]" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 03 – BOARD DECISION & MEMBERSHIP STATUS */}
      <div className="section mb-2.5">
        <div className="section-title">
          <div className="section-num">03</div>
          <h2>Membership Committee Recommendation &amp; Board Decision</h2>
        </div>
        <p className="text-[8px] text-gray-500 italic mb-1">For Office Use Only — to be completed manually by the Secretariat / Board after printing.</p>
        <div className="border border-[#9d7f46]/40 bg-[#faf8f5] p-2.5 rounded text-[9px] grid grid-cols-3 gap-3">
          <div>
            <span className="font-bold text-[#1a2744] block mb-1">Committee Recommendation:</span>
            <div className="border-b border-dotted border-gray-400 h-[16px]" />
          </div>
          <div>
            <span className="font-bold text-[#1a2744] block mb-1">Board Approval Decision:</span>
            <div className="border-b border-dotted border-gray-400 h-[16px]" />
          </div>
          <div>
            <span className="font-bold text-[#1a2744] block mb-1">Assigned Membership ID / Status:</span>
            <div className="border-b border-dotted border-gray-400 h-[16px]" />
          </div>
        </div>
      </div>

      {/* SECTION 04 – OFFICE NOTES & INTERVIEW NOTES */}
      <div className="section mb-2.5">
        <div className="section-title">
          <div className="section-num">04</div>
          <h2>Office Notes &amp; Applicant Interview Remarks</h2>
        </div>
        <p className="text-[8px] text-gray-500 italic mb-1">For Office Use Only — to be completed manually by the Secretariat after printing.</p>
        <div className="border border-[#c8c8c8] p-2 rounded min-h-[65px] bg-white text-[8.5px] text-gray-700 space-y-3">
          <div className="font-bold text-[#1a2744]">Applicant Interview &amp; Balloting Notes:</div>
          <div className="border-b border-dotted border-gray-400 h-[14px]" />
          <div className="border-b border-dotted border-gray-400 h-[14px]" />
          <div className="border-b border-dotted border-gray-400 h-[14px]" />
        </div>
      </div>

      {/* SECTION 05 – OFFICIAL APPROVAL SIGNATURES & CLUB SEAL */}
      <div className="section">
        <div className="section-title">
          <div className="section-num">05</div>
          <h2>Approval Signatures &amp; Official Seal</h2>
        </div>

        <div className="flex items-end gap-4 mt-6">
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 flex-1 text-[8.5px]">
          {/* Row 1 Signatures */}
          <div className="text-center">
            <div className="h-[34px]" />
            <div className="border-t border-[#1a2744] pt-1">
              <div className="font-bold text-[#1a2744]">FOUNDING PRESIDENT</div>
              <div className="text-gray-500">Cox's Bazar Boat Club Ltd.</div>
            </div>
          </div>

          <div className="text-center">
            <div className="h-[34px]" />
            <div className="border-t border-[#1a2744] pt-1">
              <div className="font-bold text-[#1a2744]">DIRECTOR FINANCE</div>
              <div className="text-gray-500">Executive Committee</div>
            </div>
          </div>

          <div className="text-center">
            <div className="h-[34px]" />
            <div className="border-t border-[#1a2744] pt-1">
              <div className="font-bold text-[#1a2744]">SECRETARY GENERAL</div>
              <div className="text-gray-500">Executive Secretariat</div>
            </div>
          </div>

          {/* Row 2 Signatures */}
          <div className="text-center">
            <div className="h-[34px]" />
            <div className="border-t border-[#1a2744] pt-1">
              <div className="font-bold text-[#1a2744]">DIRECTOR ADMIN</div>
              <div className="text-gray-500">Executive Committee</div>
            </div>
          </div>

          <div className="text-center">
            <div className="h-[34px]" />
            <div className="border-t border-[#1a2744] pt-1">
              <div className="font-bold text-[#1a2744]">DIRECTOR</div>
              <div className="text-gray-500">Executive Committee</div>
            </div>
          </div>

          <div className="text-center">
            <div className="h-[34px]" />
            <div className="border-t border-[#1a2744] pt-1">
              <div className="font-bold text-[#1a2744]">DIRECTOR</div>
              <div className="text-gray-500">Executive Committee</div>
            </div>
          </div>
        </div>

        {/* OFFICIAL SEAL BOX — beside the signatures so the page stays within A4 */}
        <div className="border-2 border-dashed border-[#9d7f46] rounded w-[120px] h-[120px] shrink-0" />
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
          <br />
          Tel: +880 13328 86688<br />
          Email: registration@cbbcl.org
        </div>
        <div className="footer-right-group">
          <div className="footer-center">Confidential Document</div>
          <div className="footer-right">Page 7 of 7 &nbsp;|&nbsp; Official Registration Form</div>
        </div>
      </div>
    </div>
  );
};
