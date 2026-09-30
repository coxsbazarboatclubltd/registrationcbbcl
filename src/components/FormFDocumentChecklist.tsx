import React, { useRef, useState } from 'react';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';

interface FormFProps {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

const CHECKLIST_ITEMS = [
  { field: 'docPassportPhoto', name: 'Passport Size Photograph', note: '2 inch × 2 inch, recent clear photo (Mandatory)' },
  { field: 'docNidCopy', name: 'National ID (NID)', note: 'Smart NID or 10/13/17 digit clear copy (Mandatory)' },
  { field: 'docPassportCopy', name: 'Passport Copy', note: 'For foreign / diplomat / dual national members' },
  { field: 'docSpecimenSignature', name: 'Specimen Signature', note: 'Signature on white paper (Mandatory)' },
  { field: 'docBirthCertificate', name: 'Birth Certificate', note: 'Children / dependent birth certificate copies' },
  { field: 'docMarriageCertificate', name: 'Marriage Certificate', note: 'For spouse card registration' },
  { field: 'docTradeLicense', name: 'Trade License / Employment ID', note: 'Mandatory for Corporate & Business members' },
  { field: 'docCompanyId', name: 'Company ID / Official Card', note: 'Official ID card or employment proof' },
  { field: 'docTinCertificate', name: 'TIN Certificate', note: 'Tax identification certificate copy' },
  { field: 'docOtherAttachments', name: 'Supporting Documents & Other Attachments', note: 'Utility Bill, Organization Letter, Recommendation' },
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export const FormFDocumentChecklist: React.FC<FormFProps> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const uploadedDocs = data.uploadedDocs || {};

  const handleFileSelect = (docKey: string, fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`"${file.name}" exceeds the maximum 10 MB limit.`);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !file.name.match(/\.(pdf|jpg|jpeg|png)$/i)) {
      setErrorMsg(`Invalid file format. Please upload PDF, JPG, or PNG.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const formattedSize = file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const updated = {
        ...uploadedDocs,
        [docKey]: {
          fileName: file.name,
          fileSize: formattedSize,
          fileType: file.type,
          fileDataUrl: dataUrl,
          uploadedAt: new Date().toISOString().split('T')[0],
        },
      };
      onChange('uploadedDocs', updated);
      // Auto-check corresponding checkbox field
      if (fieldName) {
        onChange(fieldName as keyof MemberFormData, true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (docKey: string) => {
    const updated = { ...uploadedDocs };
    delete updated[docKey];
    onChange('uploadedDocs', updated);
    if (fileInputRefs.current[docKey]) {
      fileInputRefs.current[docKey]!.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* WEB APPLICATION FORM VIEW (NO-PRINT) */}
      <div id="form-6-onscreen" className="no-print zoom-scale space-y-4 max-w-4xl mx-auto bg-[#fffef8] p-4 rounded-lg">
        {/* FORM TITLE BANNER */}
        <div className="bg-white border border-[#9d7f46]/40 rounded-lg p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#1a2744] font-['Cinzel'] tracking-wider uppercase flex items-center gap-2">
              <span>📋</span> FORM F · Document Checklist &amp; Attachments
            </h2>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Confirm enclosed physical documents and attach digital copies (PDF, JPG, PNG up to 10MB each) for online submission.
            </p>
          </div>
          <div className="text-[10px] font-bold text-[#0f5132] bg-green-50 border border-green-200 px-3 py-1 rounded-md shrink-0">
            {Object.keys(uploadedDocs).length} File(s) Attached
          </div>
        </div>

        {/* DIGITAL ATTACHMENTS & FILE UPLOADS */}
        <div className="bg-white border border-[#9d7f46]/40 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#9d7f46]/20">
            <h3 className="text-xs font-bold text-[#1a2744] uppercase tracking-wider font-['Cinzel'] flex items-center gap-1.5">
              <span>📎</span> Optional Digital Document Attachments
            </h3>
            <span className="text-[9px] text-gray-500">Supported: PDF, JPG, PNG (Max 10MB)</span>
          </div>

          {errorMsg && (
            <div className="mb-2.5 p-2 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded flex items-center justify-between">
              <span>⚠️ {errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-red-800 font-bold ml-2 text-xs">×</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {CHECKLIST_ITEMS.map((item, idx) => {
              const uploaded = uploadedDocs[item.name];
              return (
                <div key={idx} className="p-2 border border-gray-200 rounded bg-[#faf8f5] flex items-center justify-between text-[9px]">
                  <div className="truncate pr-2">
                    <span className="font-bold text-[#1a2744] block truncate">{item.name}</span>
                    {uploaded ? (
                      <span className="text-green-700 font-mono text-[8px] truncate block">
                        ✓ {uploaded.fileName} ({uploaded.fileSize})
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[8px]">Not attached</span>
                    )}
                  </div>
                  <div>
                    {uploaded ? (
                      <button
                        type="button"
                        onClick={() => handleRemove(item.name)}
                        className="text-red-600 hover:text-red-800 text-[9px] font-bold px-1.5 py-0.5 bg-red-50 border border-red-200 rounded cursor-pointer"
                        title="Remove file"
                      >
                        Remove
                      </button>
                    ) : (
                      <>
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[item.name] = el)}
                          onChange={(e) => handleFileSelect(item.name, item.field, e)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[item.name]?.click()}
                          className="text-[8px] font-bold text-[#1a2744] bg-white border border-[#9d7f46]/50 hover:bg-[#1a2744] hover:text-white px-2 py-0.5 rounded transition-colors cursor-pointer"
                        >
                          Upload
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 01 – ENCLOSED DOCUMENTS DECLARATION */}
        <div className="bg-white border border-[#9d7f46]/40 rounded-lg p-3.5 shadow-xs space-y-3">
          <div className="section-title">
            <div className="section-num">01</div>
            <h2>Declaration of Enclosed Documents</h2>
          </div>
          <p className="text-[10px] text-gray-600 italic">
            Please indicate with a check mark (✓) the documents enclosed with this membership application package:
          </p>

          <div className="border border-[#9d7f46]/40 rounded overflow-hidden">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-[#1a2744] text-white uppercase text-[9px] tracking-wider">
                  <th className="p-2 border-r border-[#9d7f46]/30 text-center w-[12%]">Enclosed</th>
                  <th className="p-2 border-r border-[#9d7f46]/30 w-[43%]">Document Title</th>
                  <th className="p-2 w-[45%]">Description &amp; Guidelines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c8c8c8]">
                {CHECKLIST_ITEMS.map((item, idx) => {
                  const isChecked = !!data[item.field as keyof MemberFormData] || !!uploadedDocs[item.name];
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}>
                      <td className="p-2 border-r border-[#c8c8c8] text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => onChange(item.field as keyof MemberFormData, e.target.checked)}
                          className="w-4 h-4 accent-[#0f5132] cursor-pointer"
                        />
                      </td>
                      <td className="p-2 border-r border-[#c8c8c8]">
                        <span className="font-bold text-[#1a2744]">{item.name}</span>
                      </td>
                      <td className="p-2 text-gray-600">
                        {item.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[10px]">
            <div className="field">
              <label className="block font-bold text-[#1a2744] mb-1">Enclosure Details / Remarks:</label>
              <input
                type="text"
                placeholder="e.g. 3 Photos, Attested NID Copy, Trade License 2025-26"
                value={data.attachmentNotes || ''}
                onChange={(e) => onChange('attachmentNotes', e.target.value)}
                className="w-full border border-[#c8c8c8] rounded px-2.5 py-1.5 text-[10px] bg-white text-[#1a2744]"
              />
            </div>
            <div className="field">
              <label className="block font-bold text-[#1a2744] mb-1">Total Number of Attachments Enclosed:</label>
              <input
                type="text"
                placeholder="e.g. 4 Documents"
                value={data.totalAttachments || ''}
                onChange={(e) => onChange('totalAttachments', e.target.value)}
                className="w-full border border-[#c8c8c8] rounded px-2.5 py-1.5 text-[10px] bg-white text-[#1a2744]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 02 – APPLICANT DECLARATION & SIGNATURE */}
        <div className="bg-white border border-[#9d7f46]/40 rounded-lg p-3.5 shadow-xs space-y-2">
          <div className="section-title">
            <div className="section-num">02</div>
            <h2>Applicant Enclosure Declaration</h2>
          </div>
          <div className="bg-[#faf8f5] border border-[#9d7f46]/30 rounded p-3 text-[10px] text-gray-800 leading-normal">
            <p className="mb-2">
              I hereby confirm that the documents marked above are enclosed herewith in physical original / certified true copy format. I understand that failure to submit mandatory documents may delay membership processing by the Executive Secretariat.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3 pt-2.5 border-t border-[#9d7f46]/30 text-[10px]">
              <div>
                <span className="font-bold text-[#1a2744] block">Applicant Full Name:</span>
                <span className="font-semibold text-[#0f5132]">{data.candidateName || '________________________'}</span>
              </div>
              <div>
                <span className="font-bold text-[#1a2744] block">Date of Declaration:</span>
                <span className="font-semibold text-[#0f5132]">{docDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 03 – SECRETARIAT OFFICE VERIFICATION CHECKLIST (office-only; left blank for manual sign-off after printing) */}
        <div className="bg-white border border-[#9d7f46]/40 rounded-lg p-3.5 shadow-xs space-y-2">
          <div className="section-title">
            <div className="section-num">03</div>
            <h2>Office Document Verification Checklist</h2>
          </div>
          <p className="text-[9px] text-gray-500 italic">
            For Office Use Only — to be marked by the Secretariat after printing. Not editable by the applicant.
          </p>
          <div className="bg-white border border-[#c8c8c8] rounded p-3 text-[10px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>Photograph Specimen &amp; Bio-Data Verified</span>
              </label>
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>National ID / Passport Authenticated</span>
              </label>
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>Proposer &amp; Seconder Signatures Verified</span>
              </label>
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>Tax / TIN &amp; Professional Documents Cleared</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* PRINTABLE PAGE: FORM F - DOCUMENT CHECKLIST (OFFICIAL PRINT / PDF ONLY) */}
      <div className="page hidden print:block" id="form-6-page">
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
            <div className="form-title text-[#1a2744]">FORM F · Document Checklist</div>
          </div>
        </div>

        {/* SECTION 01 – ENCLOSED DOCUMENTS DECLARATION */}
        <div className="section mb-3">
          <div className="section-title">
            <div className="section-num">01</div>
            <h2>Declaration of Enclosed Documents</h2>
          </div>
          <p className="text-[9px] text-gray-600 mb-2 italic">
            Please indicate with a check mark (✓) the documents enclosed with this membership application package:
          </p>

          <div className="border border-[#9d7f46]/40 rounded overflow-hidden">
            <table className="w-full text-left text-[9px] border-collapse">
              <thead>
                <tr className="bg-[#1a2744] text-white uppercase text-[8px] tracking-wider">
                  <th className="p-2 border-r border-[#9d7f46]/30 text-center w-[12%]">Enclosed</th>
                  <th className="p-2 border-r border-[#9d7f46]/30 w-[43%]">Document Title</th>
                  <th className="p-2 w-[45%]">Description &amp; Guidelines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c8c8c8]">
                {CHECKLIST_ITEMS.map((item, idx) => {
                  const isChecked = !!data[item.field as keyof MemberFormData] || !!uploadedDocs[item.name];
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}>
                      <td className="p-2 border-r border-[#c8c8c8] text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => onChange(item.field as keyof MemberFormData, e.target.checked)}
                          className="w-4 h-4 accent-[#0f5132] cursor-pointer"
                        />
                      </td>
                      <td className="p-2 border-r border-[#c8c8c8]">
                        <span className="font-bold text-[#1a2744]">{item.name}</span>
                      </td>
                      <td className="p-2 text-gray-600">
                        {item.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-[9px] grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="field">
              <label className="block font-bold text-[#1a2744] mb-0.5">Enclosure Details / Remarks:</label>
              <input
                type="text"
                placeholder="e.g. 3 Photos, Attested NID Copy, Trade License 2025-26"
                value={data.attachmentNotes || ''}
                onChange={(e) => onChange('attachmentNotes', e.target.value)}
                className="w-full border border-[#c8c8c8] rounded px-2 py-1 text-[9px] bg-white text-[#1a2744]"
              />
            </div>
            <div className="field">
              <label className="block font-bold text-[#1a2744] mb-0.5">Total Number of Attachments Enclosed:</label>
              <input
                type="text"
                placeholder="e.g. 4 Documents"
                value={data.totalAttachments || ''}
                onChange={(e) => onChange('totalAttachments', e.target.value)}
                className="w-full border border-[#c8c8c8] rounded px-2 py-1 text-[9px] bg-white text-[#1a2744]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 02 – APPLICANT DECLARATION & SIGNATURE */}
        <div className="section mb-3">
          <div className="section-title">
            <div className="section-num">02</div>
            <h2>Applicant Enclosure Declaration</h2>
          </div>
          <div className="bg-[#faf8f5] border border-[#9d7f46]/30 rounded p-2.5 text-[9px] text-gray-800 leading-normal">
            <p className="mb-2">
              I hereby confirm that the documents marked above are enclosed herewith in physical original / certified true copy format. I understand that failure to submit mandatory documents may delay membership processing by the Executive Secretariat.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3 pt-2 border-t border-[#9d7f46]/30">
              <div>
                <span className="font-bold text-[#1a2744] block">Applicant Full Name:</span>
                <span className="font-semibold text-[#0f5132]">{data.candidateName || '________________________'}</span>
              </div>
              <div>
                <span className="font-bold text-[#1a2744] block">Date of Declaration:</span>
                <span className="font-semibold text-[#0f5132]">{docDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 03 – SECRETARIAT OFFICE VERIFICATION CHECKLIST (office-only; left blank for manual sign-off after printing) */}
        <div className="section">
          <div className="section-title">
            <div className="section-num">03</div>
            <h2>Office Document Verification Checklist</h2>
          </div>
          <p className="text-[8px] text-gray-500 italic mb-1">For Office Use Only — to be marked by the Secretariat after printing.</p>
          <div className="bg-white border border-[#c8c8c8] rounded p-2.5 text-[9px]">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>Photograph Specimen &amp; Bio-Data Verified</span>
              </label>
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>National ID / Passport Authenticated</span>
              </label>
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>Proposer &amp; Seconder Signatures Verified</span>
              </label>
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                <span>Tax / TIN &amp; Professional Documents Cleared</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-[#c8c8c8] text-[9px]">
              <div>
                <span className="font-bold text-[#1a2744]">Verified By (Office Desk):</span>
                <div className="border-b border-[#c8c8c8] h-4 mt-1"></div>
              </div>
              <div>
                <span className="font-bold text-[#1a2744]">Verification Date &amp; Stamp:</span>
                <div className="border-b border-[#c8c8c8] h-4 mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-left">
            <strong>COX'S BAZAR BOAT CLUB LTD.</strong>
            <br />
            Tel: +880 13328 86688<br />
          Email: membership@cbbcl.org
          </div>
          <div className="footer-right-group">
            <div className="footer-center">Confidential Document</div>
            <div className="footer-right">Page 6 of 7 &nbsp;|&nbsp; Official Registration Package</div>
          </div>
        </div>
      </div>
    </div>
  );
};
