import React, { useRef, useState } from 'react';
import {
  ACCEPTED_ATTACHMENT_TYPES,
  MAX_TOTAL_ATTACHMENT_BYTES,
  attachmentBytesUsed,
  formatBytes,
  prepareAttachment,
} from '../utils/attachments';
import { useBlankForm } from './BlankFormContext';
import { CbbcWatermarkLogo } from './CbbcWatermarkLogo';
import { MemberFormData } from '../types';
import {
  CHECKLIST_ITEMS,
  incompleteTwoSidedUploads,
  isDocumentEnclosed,
  isTwoSided,
  uploadSlots,
} from '../utils/documentChecklist';
import { formatLongDate } from '../utils/formatDate';

interface FormFProps {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
}

// Secretariat verification list: every checklist document, plus reference signatures
const OFFICE_VERIFICATION_ITEMS = [
  ...CHECKLIST_ITEMS.map((item) => item.name),
  'Proposer & Seconder (Reference) Signatures',
];

export const FormFDocumentChecklist: React.FC<FormFProps> = ({
  data,
  onChange,
  docNo,
  docDate,
}) => {
  const uploadedDocs = data.uploadedDocs || {};
  const isEnclosed = (item: (typeof CHECKLIST_ITEMS)[number]) => isDocumentEnclosed(data, item);
  const enclosedCount = CHECKLIST_ITEMS.filter(isEnclosed).length;
  const isBlankForm = useBlankForm();
  const enclosedCountLabel = isBlankForm ? '' : `${enclosedCount} Document${enclosedCount === 1 ? '' : 's'}`;

  // Supporting-document uploads (appended to the generated PDF as A4 pages)
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const bytesUsed = attachmentBytesUsed(uploadedDocs);

  const handleUpload = async (item: (typeof CHECKLIST_ITEMS)[number], slotKey: string, file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    setUploadingName(slotKey);
    try {
      const prepared = await prepareAttachment(file);
      const replacing = uploadedDocs[slotKey];
      const replacingBytes = replacing ? attachmentBytesUsed({ [slotKey]: replacing }) : 0;
      if (bytesUsed - replacingBytes + (prepared.byteSize || 0) > MAX_TOTAL_ATTACHMENT_BYTES) {
        throw new Error(
          `"${file.name}" (${prepared.fileSize}) would exceed the ${formatBytes(MAX_TOTAL_ATTACHMENT_BYTES)} upload limit. ` +
            'Try a photo/scan instead of a large PDF, or remove another upload.'
        );
      }
      onChange('uploadedDocs', { ...uploadedDocs, [slotKey]: prepared });
      onChange(item.field as keyof MemberFormData, true);
    } catch (err: any) {
      setUploadError(err?.message || 'The file could not be uploaded.');
    } finally {
      setUploadingName(null);
      const input = fileInputs.current[slotKey];
      if (input) input.value = '';
    }
  };

  const handleRemoveUpload = (item: (typeof CHECKLIST_ITEMS)[number], slotKey: string) => {
    const next = { ...uploadedDocs };
    delete next[slotKey];
    onChange('uploadedDocs', next);
    // Untick only when no file remains for this document
    if (!uploadSlots(item).some((slot) => next[slot.key])) {
      onChange(item.field as keyof MemberFormData, false);
    }
  };

  return (
    <div className="space-y-4">
      {/* WEB APPLICATION FORM VIEW (NO-PRINT) */}
      <div id="form-6-onscreen" className="no-print zoom-scale space-y-4 max-w-4xl mx-auto bg-[#fffef8] p-4 rounded-lg">
        {/* FORM TITLE BANNER */}
        <div className="bg-white border border-[#9d7f46]/40 rounded-lg p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#1a2744] font-['Montserrat'] tracking-wider uppercase flex items-center gap-2">
              <span>📋</span> FORM F · Document Checklist
            </h2>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Confirm the physical documents enclosed with your membership application package.
            </p>
          </div>
        </div>

        {/* SECTION 01 – ENCLOSED DOCUMENTS DECLARATION */}
        <div className="bg-white border border-[#9d7f46]/40 rounded-lg p-3.5 shadow-xs space-y-3">
          <div className="section-title">
            <div className="section-num">01</div>
            <h2>Declaration of Enclosed Documents</h2>
          </div>
          <p className="text-[10px] text-gray-600 italic">
            Please indicate with a check mark (✓) the documents enclosed with this membership application package. Items marked <span className="text-red-600 font-bold not-italic">*</span> are mandatory.
          </p>

          <div className="border border-[#9d7f46]/40 rounded overflow-hidden">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-[#1a2744] text-white uppercase text-[9px] tracking-wider">
                  <th className="p-2 border-r border-[#9d7f46]/30 text-center w-[10%]">Enclosed</th>
                  <th className="p-2 border-r border-[#9d7f46]/30 w-[32%]">Document Title</th>
                  <th className="p-2 border-r border-[#9d7f46]/30 w-[30%]">Description &amp; Guidelines</th>
                  <th className="p-2 w-[28%]">Upload Copy (PDF / JPG / PNG)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c8c8c8]">
                {CHECKLIST_ITEMS.map((item, idx) => {
                  const isChecked = isEnclosed(item);
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
                        {item.required ? (
                          <span className="text-red-600 font-bold"> *</span>
                        ) : (
                          <span className="ml-1 text-[8px] italic text-gray-500">(Optional)</span>
                        )}
                      </td>
                      <td className="p-2 border-r border-[#c8c8c8] text-gray-600">
                        {item.note}
                      </td>
                      <td className="p-2">
                        {isTwoSided(item) && (
                          <div className="mb-1 text-[8px] font-semibold text-[#9d7f46]">
                            Upload both the front and back of your NID card
                          </div>
                        )}
                        <div className="space-y-1">
                          {uploadSlots(item).map((slot) => {
                            const uploaded = uploadedDocs[slot.key];
                            return (
                              <div key={slot.key} className="flex items-center gap-1.5 min-w-0">
                                {slot.side && (
                                  <span className="shrink-0 w-9 text-[8px] font-bold uppercase text-gray-500">{slot.side}</span>
                                )}
                                <input
                                  type="file"
                                  accept={ACCEPTED_ATTACHMENT_TYPES}
                                  className="hidden"
                                  ref={(el) => (fileInputs.current[slot.key] = el)}
                                  onChange={(e) => handleUpload(item, slot.key, e.target.files?.[0])}
                                />
                                {uploadingName === slot.key ? (
                                  <span className="text-[9px] italic text-gray-500">Processing…</span>
                                ) : uploaded ? (
                                  <>
                                    <span className="text-green-700 font-bold shrink-0">✓</span>
                                    <span className="truncate text-[9px] text-[#1a2744]" title={uploaded.fileName}>
                                      {uploaded.fileName}
                                    </span>
                                    <span className="shrink-0 text-[8px] text-gray-500">{uploaded.fileSize}</span>
                                    <button
                                      type="button"
                                      onClick={() => fileInputs.current[slot.key]?.click()}
                                      className="shrink-0 text-[8px] font-bold uppercase text-[#1a2744] underline cursor-pointer"
                                    >
                                      Replace
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveUpload(item, slot.key)}
                                      className="shrink-0 text-[8px] font-bold uppercase text-red-600 underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => fileInputs.current[slot.key]?.click()}
                                    className="text-[9px] font-bold uppercase tracking-wider text-[#1a2744] bg-white border border-[#9d7f46]/60 hover:bg-[#1a2744] hover:text-white px-2.5 py-1 rounded transition-colors cursor-pointer"
                                  >
                                    {slot.side ? `Upload ${slot.side}` : 'Upload'}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {isTwoSided(item) && incompleteTwoSidedUploads(data).includes(item) && (
                          <div className="mt-1 text-[8px] font-semibold text-red-600">
                            Both sides are required — please also upload the{' '}
                            {uploadedDocs[uploadSlots(item)[0].key] ? 'back' : 'front'} side.
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Upload status: errors + storage budget (Vercel request size limit) */}
          {uploadError && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded flex items-start justify-between gap-2">
              <span>⚠ {uploadError}</span>
              <button type="button" onClick={() => setUploadError(null)} className="font-bold text-red-800 cursor-pointer">
                ×
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 text-[9px] text-gray-600">
            <div className="flex-1 h-1.5 bg-gray-200 rounded overflow-hidden">
              <div
                className={`h-full ${bytesUsed > MAX_TOTAL_ATTACHMENT_BYTES * 0.85 ? 'bg-amber-500' : 'bg-[#0f5132]'}`}
                style={{ width: `${Math.min(100, (bytesUsed / MAX_TOTAL_ATTACHMENT_BYTES) * 100)}%` }}
              />
            </div>
            <span className="shrink-0">
              Uploaded: {formatBytes(bytesUsed)} of {formatBytes(MAX_TOTAL_ATTACHMENT_BYTES)} · Photos are compressed
              automatically; each upload is added to your PDF on its own A4 page.
            </span>
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
                readOnly
                title="Counted automatically from the documents ticked above"
                value={enclosedCountLabel}
                className="w-full border border-[#c8c8c8] rounded px-2.5 py-1.5 text-[10px] bg-gray-100 cursor-not-allowed font-semibold text-[#1a2744]"
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
                {data.candidateName ? (
                  <span className="font-semibold text-[#0f5132]">{data.candidateName}</span>
                ) : (
                  <span className="italic text-gray-400">Filled automatically from Candidate Full Name on Page 1</span>
                )}
              </div>
              <div>
                <span className="font-bold text-[#1a2744] block">Date of Declaration:</span>
                <span className="font-semibold text-[#0f5132]">{formatLongDate(docDate) || '________________________'}</span>
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
              {OFFICE_VERIFICATION_ITEMS.map((label) => (
                <label key={label} className="flex items-center gap-2 text-gray-500">
                  <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                  <span>{label}</span>
                </label>
              ))}
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
                  <td>{formatLongDate(docDate)}</td>
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
            Please indicate with a check mark (✓) the documents enclosed with this membership application package. Items marked <span className="text-red-600 font-bold not-italic">*</span> are mandatory.
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
                  const isChecked = isEnclosed(item);
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}>
                      <td className="px-2 py-1.5 border-r border-[#c8c8c8] text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => onChange(item.field as keyof MemberFormData, e.target.checked)}
                          className="w-4 h-4 accent-[#0f5132] cursor-pointer"
                        />
                      </td>
                      <td className="px-2 py-1.5 border-r border-[#c8c8c8]">
                        <span className="font-bold text-[#1a2744]">{item.name}</span>
                        {item.required ? (
                          <span className="text-red-600 font-bold"> *</span>
                        ) : (
                          <span className="ml-1 text-[8px] italic text-gray-500">(Optional)</span>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600">
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
                readOnly
                title="Counted automatically from the documents ticked above"
                value={enclosedCountLabel}
                className="w-full border border-[#c8c8c8] rounded px-2 py-1 text-[9px] bg-gray-100 cursor-not-allowed font-semibold text-[#1a2744]"
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
                <span className="font-semibold text-[#0f5132]">{formatLongDate(docDate) || '________________________'}</span>
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
            <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 mb-2">
              {OFFICE_VERIFICATION_ITEMS.map((label) => (
                <label key={label} className="flex items-center gap-2 text-gray-500">
                  <input type="checkbox" checked={false} disabled className="accent-[#0f5132]" />
                  <span>{label}</span>
                </label>
              ))}
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
          Email: registration@cbbcl.org
          </div>
          <div className="footer-right-group">
            <div className="footer-center">Confidential Document</div>
            <div className="footer-right">Page 6 of 7 &nbsp;|&nbsp; Official Registration Form</div>
          </div>
        </div>
      </div>
    </div>
  );
};
