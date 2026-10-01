import React from 'react';

interface OfficialUseOnlySectionProps {
  registrationNumber: string;
  submissionDate?: string;
}

export const OfficialUseOnlySection: React.FC<OfficialUseOnlySectionProps> = ({
  registrationNumber,
  submissionDate,
}) => {
  return (
    <div className="official-use-section border-2 border-[#1a2744] rounded-lg p-3 my-4 bg-[#faf8f5] text-[#1a2744]">
      {/* Title Header */}
      <div className="bg-[#1a2744] text-[#c4a56a] px-3 py-1.5 -mx-3 -mt-3 rounded-t-md flex items-center justify-between border-b border-[#9d7f46]">
        <h3 className="font-['Montserrat'] font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
          <span>🏛️</span> OFFICIAL USE ONLY &nbsp;–&nbsp; SECRETARIAT VERIFICATION
        </h3>
        <span className="text-[8px] text-white/80 uppercase tracking-wider italic">
          For Internal Administrative Records Only
        </span>
      </div>

      <p className="text-[8px] text-[#6b6b6b] italic mt-2 mb-2">
        This section is reserved for office administration, verification committee audits, and executive board approval. Applicant shall leave this section blank.
      </p>

      {/* Grid of official verification fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] mb-3">
        <div className="border border-[#c8c8c8] p-1.5 bg-white rounded">
          <span className="block font-bold text-gray-500 uppercase text-[7.5px]">Application Received Date</span>
          <span className="font-semibold">{submissionDate || '____ / ____ / 2026'}</span>
        </div>
        <div className="border border-[#c8c8c8] p-1.5 bg-white rounded">
          <span className="block font-bold text-gray-500 uppercase text-[7.5px]">Registration Number</span>
          <span className="font-bold text-[#0f5132]">{registrationNumber || 'CBBCL-2026-000001'}</span>
        </div>
        <div className="border border-[#c8c8c8] p-1.5 bg-white rounded">
          <span className="block font-bold text-gray-500 uppercase text-[7.5px]">Document Verification</span>
          <span className="font-semibold text-gray-400">[ ] Complete &nbsp; [ ] Pending</span>
        </div>
        <div className="border border-[#c8c8c8] p-1.5 bg-white rounded">
          <span className="block font-bold text-gray-500 uppercase text-[7.5px]">Background Verification</span>
          <span className="font-semibold text-gray-400">[ ] Cleared &nbsp; [ ] Flagged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[9px] mb-3">
        <div className="border border-[#c8c8c8] p-1.5 bg-white rounded">
          <span className="block font-bold text-gray-500 uppercase text-[7.5px]">Membership Committee Recommendation</span>
          <div className="h-6 border-b border-dashed border-gray-300 mt-1"></div>
        </div>
        <div className="border border-[#c8c8c8] p-1.5 bg-white rounded flex flex-col justify-between">
          <span className="block font-bold text-gray-500 uppercase text-[7.5px]">Board Decision</span>
          <div className="flex items-center gap-4 text-[9px] font-bold mt-1">
            <span className="border border-gray-400 px-2 py-0.5 rounded text-emerald-800 bg-emerald-50">[ &nbsp; ] Membership Approved</span>
            <span className="border border-gray-400 px-2 py-0.5 rounded text-rose-800 bg-rose-50">[ &nbsp; ] Membership Rejected</span>
          </div>
        </div>
      </div>

      <div className="border border-[#c8c8c8] p-1.5 bg-white rounded text-[9px] mb-3">
        <span className="block font-bold text-gray-500 uppercase text-[7.5px]">Remarks / Committee Directives</span>
        <div className="h-8 border-b border-dashed border-gray-200 mt-1"></div>
      </div>

      {/* Staff Signatures Bar */}
      <div className="grid grid-cols-3 gap-2 text-[8px] text-center mb-3 pt-1">
        <div className="border-t border-gray-400 pt-1">
          <span className="font-bold text-gray-700">Prepared By</span>
          <span className="block text-gray-400 text-[7.5px]">Member Services Desk</span>
        </div>
        <div className="border-t border-gray-400 pt-1">
          <span className="font-bold text-gray-700">Verified By</span>
          <span className="block text-gray-400 text-[7.5px]">Secretariat Auditor</span>
        </div>
        <div className="border-t border-gray-400 pt-1">
          <span className="font-bold text-gray-700">Approved By</span>
          <span className="block text-gray-400 text-[7.5px]">Executive Committee</span>
        </div>
      </div>

      {/* Executive Committee Approval Boxes & Official Seal */}
      <div className="border-t border-[#9d7f46]/40 pt-2 grid grid-cols-5 gap-2 items-center text-center">
        <div className="border border-[#9d7f46]/40 p-1.5 bg-white rounded min-h-[50px] flex flex-col justify-between">
          <span className="font-bold text-[7.5px] uppercase text-[#1a2744]">President</span>
          <div className="border-b border-gray-300 my-1"></div>
          <span className="text-[7px] text-gray-400">Signature &amp; Date</span>
        </div>
        <div className="border border-[#9d7f46]/40 p-1.5 bg-white rounded min-h-[50px] flex flex-col justify-between">
          <span className="font-bold text-[7.5px] uppercase text-[#1a2744]">Secretary General</span>
          <div className="border-b border-gray-300 my-1"></div>
          <span className="text-[7px] text-gray-400">Signature &amp; Date</span>
        </div>
        <div className="border border-[#9d7f46]/40 p-1.5 bg-white rounded min-h-[50px] flex flex-col justify-between">
          <span className="font-bold text-[7.5px] uppercase text-[#1a2744]">Membership Chair</span>
          <div className="border-b border-gray-300 my-1"></div>
          <span className="text-[7px] text-gray-400">Signature &amp; Date</span>
        </div>
        <div className="border border-[#9d7f46]/40 p-1.5 bg-white rounded min-h-[50px] flex flex-col justify-between">
          <span className="font-bold text-[7.5px] uppercase text-[#1a2744]">Treasurer</span>
          <div className="border-b border-gray-300 my-1"></div>
          <span className="text-[7px] text-gray-400">Signature &amp; Date</span>
        </div>
        <div className="border-2 border-dashed border-[#9d7f46] p-1.5 bg-white rounded min-h-[50px] flex flex-col items-center justify-center text-[#9d7f46]">
          <span className="font-bold text-[7.5px] uppercase tracking-wider">Official Seal</span>
          <span className="text-[6.5px] text-gray-400 mt-1">Affix Club Stamp</span>
        </div>
      </div>
    </div>
  );
};
