import React from 'react';
import { CbbcLogo } from './CbbcLogo';
import { GeneratedPdfResult, downloadPdfBlob } from '../utils/pdfGenerator';
import { ValidationError } from '../utils/formValidation';
import { TurnstileWidget } from './TurnstileWidget';
import { formatLongDate } from '../utils/formatDate';

interface SubmissionModalProps {
  isOpen: boolean;
  status: 'idle' | 'validating' | 'generating_pdf' | 'sending_email' | 'success' | 'error' | 'validation_error';
  validationErrors: ValidationError[];
  errorDetails?: string;
  pdfResult: GeneratedPdfResult | null;
  applicantEmail: string;
  referenceNumber: string;
  submissionDate: string;
  membershipCategory: string;
  onTurnstileVerify: (token: string) => void;
  onRetry: () => void;
  onClose: () => void;
  onReset: () => void | Promise<void>;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  status,
  validationErrors,
  errorDetails,
  pdfResult,
  applicantEmail,
  referenceNumber,
  submissionDate,
  membershipCategory,
  onTurnstileVerify,
  onRetry,
  onClose,
  onReset,
}) => {
  if (!isOpen) return null;

  const isLoading =
    status === 'validating' || status === 'generating_pdf' || status === 'sending_email';

  const handleDownload = () => {
    if (pdfResult) {
      downloadPdfBlob(pdfResult.blob, pdfResult.filename);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in no-print">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#c4a56a]/30 overflow-hidden text-[#2c2c2c]">
        {/* Modal Header */}
        <div className="bg-[#1a2744] px-6 py-4 border-b border-[#9d7f46] flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <CbbcLogo clipPathId="clippath-modal" className="w-[32px] h-[32px]" />
            <h3 className="font-['Montserrat'] font-bold text-sm sm:text-base tracking-wider text-[#c4a56a]">
              COX'S BAZAR BOAT CLUB LTD.
            </h3>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl font-bold px-2 py-0.5 rounded"
              title="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* LOADING STATES */}
          {isLoading && (
            <div className="py-8 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#1a2744]/20 border-t-[#c4a56a] rounded-full animate-spin"></div>
              <div>
                <h4 className="font-bold text-base text-[#1a2744] mb-1">
                  Processing Application...
                </h4>
                <p className="text-xs text-gray-600">
                  {status === 'validating' && 'Validating applicant profile, required uploads & declarations...'}
                  {status === 'generating_pdf' && 'Compiling 7-page registration form PDF...'}
                  {status === 'sending_email' && 'Transmitting request & emails via /api/submit serverless service...'}
                </p>
              </div>

              {/* Bot Protection Widget */}
              <TurnstileWidget onVerify={onTurnstileVerify} />

              <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-xs mt-2 overflow-hidden">
                <div
                  className="bg-[#c4a56a] h-1.5 transition-all duration-500 rounded-full"
                  style={{
                    width:
                      status === 'validating'
                        ? '30%'
                        : status === 'generating_pdf'
                        ? '65%'
                        : '90%',
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* VALIDATION ERRORS */}
          {status === 'validation_error' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-3.5 rounded-lg border border-amber-200">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-sm">Required Information Missing</h4>
                  <p className="text-xs text-amber-800">
                    Please correct the following required fields before submitting your application:
                  </p>
                </div>
              </div>

              <ul className="space-y-1.5 pl-2 max-h-48 overflow-y-auto">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="text-xs text-red-600 flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{err.message}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1a2744] hover:bg-[#9d7f46] rounded transition-colors"
                >
                  Return to Form
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS PAGE / SCREEN */}
          {status === 'success' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                ✓
              </div>

              <div className="space-y-2">
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#1a2744]">
                  Registration Submitted Successfully
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Your official membership registration has been received and logged.
                </p>

                {/* Details Table */}
                <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-lg p-3 text-left text-xs space-y-1.5 my-3">
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-600 font-medium">Reference Number:</span>
                    <span className="font-bold text-[#0f5132] font-mono">{referenceNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-600 font-medium">Submission Date:</span>
                    <span className="font-semibold text-gray-800">{formatLongDate(submissionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Membership Category:</span>
                    <span className="font-semibold text-[#1a2744] uppercase">
                      {(membershipCategory || 'Permanent').toUpperCase()} MEMBERSHIP
                    </span>
                  </div>
                </div>

                <p className="text-xs text-emerald-800 font-medium bg-emerald-50 py-2.5 px-3 rounded border border-emerald-200">
                  📩 Confirmation Email Sent to{' '}
                  <span className="font-bold">{applicantEmail || 'your email address'}</span>.
                </p>
                <p className="text-xs text-emerald-800 font-medium bg-emerald-50 py-2.5 px-3 rounded border border-emerald-200">
                  🏢 Office Notified at{' '}
                  <span className="font-bold">registration@cbbcl.org</span>.
                </p>
                <p className="text-xs text-gray-600 leading-relaxed pt-1">
                  The Membership Office will review your application package and notify you regarding executive committee approval.
                </p>
              </div>

              {/* SUCCESS ACTION BUTTONS */}
              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                {pdfResult && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#2e7d32] hover:bg-[#1b5e20] rounded shadow transition-all flex items-center justify-center gap-2"
                  >
                    <span>📄</span> Download PDF
                  </button>
                )}
                <button
                  onClick={async () => {
                    await onReset();
                    window.location.href = 'https://www.cbbcl.org/';
                  }}
                  className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1a2744] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-all"
                >
                  Return Home
                </button>
              </div>
            </div>
          )}

          {/* ERROR SCREEN */}
          {status === 'error' && (
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3 bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
                <span className="text-2xl">❌</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Submission Error</h4>
                  <p className="text-xs text-red-700 leading-relaxed">
                    We encountered an issue transmitting your application request.
                  </p>
                  {errorDetails && (
                    <div className="mt-2 p-2 bg-white/80 rounded border border-red-200 text-[11px] font-mono text-red-900 break-words">
                      Details: {errorDetails}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Your entered data and uploaded files have been preserved completely. Your registration PDF is also ready for immediate download.
              </p>

              {/* ERROR BUTTONS */}
              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                {pdfResult && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1a2744] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-all flex items-center gap-1.5"
                  >
                    <span>📄</span> Download PDF
                  </button>
                )}
                <button
                  onClick={onRetry}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1a2744] hover:bg-[#9d7f46] rounded shadow transition-colors"
                >
                  🔄 Retry Submission
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
