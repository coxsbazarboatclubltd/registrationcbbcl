import React, { useRef, useState } from 'react';
import { UploadedDocumentMeta } from '../types';

interface DocumentUploadChecklistProps {
  uploadedDocs: Record<string, UploadedDocumentMeta>;
  onUploadChange: (docName: string, meta: UploadedDocumentMeta | null) => void;
}

const REQUIRED_DOCUMENTS = [
  { name: 'Passport Size Photograph', note: '2 inch × 2 inch, recent clear photo', required: true },
  { name: 'National ID', note: 'Smart NID or 10/13/17 digit copy', required: true },
  { name: 'Passport (if applicable)', note: 'For foreign or diplomat members or dual national', required: false },
  { name: 'Signature', note: 'Specimen signature on white paper', required: true },
  { name: 'Birth Certificate (if applicable)', note: 'For dependent children or verification', required: false },
  { name: 'Company ID (if applicable)', note: 'Corporate / Official ID card copy', required: false },
  { name: 'Trade License (Corporate Members)', note: 'Mandatory for Corporate & Business members', required: false },
  { name: 'Supporting Documents', note: 'TIN Certificate, Utility Bill, or Recommendation Letter', required: false },
  { name: 'Other Attachments', note: 'Any additional club or professional certifications', required: false },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export const DocumentUploadChecklist: React.FC<DocumentUploadChecklistProps> = ({
  uploadedDocs,
  onUploadChange,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`"${file.name}" exceeds the maximum 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !file.name.match(/\.(pdf|jpg|jpeg|png)$/i)) {
      setErrorMsg(`Invalid file type for "${file.name}". Accepted formats: PDF, JPG, JPEG, PNG.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const formattedSize = file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      onUploadChange(docName, {
        fileName: file.name,
        fileSize: formattedSize,
        fileType: file.type,
        fileDataUrl: dataUrl,
        uploadedAt: new Date().toISOString().split('T')[0],
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (docName: string) => {
    onUploadChange(docName, null);
    if (fileInputRefs.current[docName]) {
      fileInputRefs.current[docName]!.value = '';
    }
  };

  return (
    <div className="bg-white border border-[#9d7f46]/30 rounded-lg p-3 my-3 shadow-sm">
      <div className="border-b border-[#9d7f46]/30 pb-2 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
        <div>
          <h3 className="text-xs font-bold text-[#1a2744] uppercase tracking-wider font-['Cinzel'] flex items-center gap-1.5">
            <span>📂</span> Document Upload Checklist
          </h3>
          <p className="text-[9px] text-[#6b6b6b]">
            Accepted Formats: <strong className="text-[#1a2744]">PDF, JPG, JPEG, PNG</strong> &nbsp;|&nbsp; Max size per file: <strong className="text-[#1a2744]">10 MB</strong>
          </p>
        </div>
        <div className="text-[9px] font-semibold text-[#0f5132] bg-[#d1e7dd] border border-[#badbcc] px-2 py-0.5 rounded">
          {Object.keys(uploadedDocs).length} of {REQUIRED_DOCUMENTS.length} Uploaded
        </div>
      </div>

      {errorMsg && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-800 font-bold ml-2">×</button>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const uploaded = uploadedDocs[doc.name];
          return (
            <div
              key={doc.name}
              className="py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 hover:bg-gray-50/80 px-1.5 rounded transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#1a2744]">
                    {doc.name}
                  </span>
                  {doc.required && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1 rounded border border-red-200">
                      Required
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-gray-500 truncate">{doc.note}</div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {uploaded ? (
                  <>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                        <span>✓</span> Uploaded
                      </span>
                      <div className="text-[8.5px] text-gray-600 font-mono mt-0.5 max-w-[140px] truncate" title={uploaded.fileName}>
                        📄 {uploaded.fileName} ({uploaded.fileSize})
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[doc.name]?.click()}
                        className="text-[9px] font-bold text-[#1a2744] bg-[#f0e8d8] hover:bg-[#e4d5b7] border border-[#9d7f46]/40 px-2 py-1 rounded transition-colors"
                      >
                        Replace File
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(doc.name)}
                        className="text-[9px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-1.5 py-1 rounded transition-colors"
                        title="Remove uploaded document"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Not Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[doc.name]?.click()}
                      className="text-[9.5px] font-bold text-white bg-[#1a2744] hover:bg-[#28385e] border border-[#9d7f46] px-2.5 py-1 rounded shadow-sm transition-colors flex items-center gap-1"
                    >
                      <span>📤</span> Upload Button
                    </button>
                  </>
                )}

                <input
                  type="file"
                  ref={(el) => (fileInputRefs.current[doc.name] = el)}
                  onChange={(e) => handleFileSelect(doc.name, e)}
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="hidden"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
