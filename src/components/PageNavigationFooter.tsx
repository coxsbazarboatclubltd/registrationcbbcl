import React from 'react';

interface PageNavigationFooterProps {
  currentPage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  onPrevious: () => void;
  onNext: () => void;
  onSaveAsPdf?: () => void;
  onPrint?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isSavingPdf?: boolean;
}

export const PageNavigationFooter: React.FC<PageNavigationFooterProps> = ({
  currentPage,
  onPrevious,
  onNext,
  onSaveAsPdf,
  onPrint,
  onSubmit,
  isSubmitting = false,
  isSavingPdf = false,
}) => {
  const getPageTitle = (page: number) => {
    switch (page) {
      case 1:
        return 'Page 1 of 7: Membership Application';
      case 2:
        return 'Page 2 of 7: Professional & Family Information';
      case 3:
        return 'Page 3 of 7: Membership ID Card Information';
      case 4:
        return 'Page 4 of 7: Member Database Synchronization';
      case 5:
        return 'Page 5 of 7: References & Declaration';
      case 6:
        return 'Page 6 of 7: Document Checklist';
      case 7:
        return 'Page 7 of 7: Official Use Only';
      default:
        return '';
    }
  };

  // For Pages 1 to 5
  if (currentPage < 6) {
    return (
      <div className="no-print my-6 p-3.5 bg-white border border-[#9d7f46]/40 rounded-lg shadow-sm flex items-center justify-between max-w-4xl mx-auto">
        {/* Previous Button (Hidden on Page 1) */}
        {currentPage === 1 ? (
          <div className="w-28 invisible"></div>
        ) : (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1a2744] font-bold text-[11px] uppercase tracking-wider rounded border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>←</span>
            <span>Previous</span>
          </button>
        )}

        {/* Center Page Title */}
        <div className="text-[11px] font-bold text-[#1a2744] uppercase tracking-wider font-['Cinzel'] hidden sm:block">
          {getPageTitle(currentPage)}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2 bg-[#1a2744] hover:bg-[#25365d] text-[#c4a56a] font-bold text-[11px] uppercase tracking-wider rounded border border-[#9d7f46] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Next Page</span>
          <span>→</span>
        </button>
      </div>
    );
  }

  // For Pages 6 and 7 (Action Bar & Navigation)
  return (
    <div className="no-print my-6 p-4 bg-[#faf8f5] border-2 border-[#1a2744] rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-3 max-w-4xl mx-auto">
      {/* Left: Previous / Next Navigation Group */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1a2744] font-bold text-[11px] uppercase tracking-wider rounded border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>←</span>
          <span>Previous</span>
        </button>

        {currentPage < 7 && (
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2.5 bg-[#1a2744] hover:bg-[#25365d] text-[#c4a56a] font-bold text-[11px] uppercase tracking-wider rounded border border-[#9d7f46] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next (Official Use)</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Right Action Group: Save as PDF, Print Application, Submit Application */}
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
        {/* Save as PDF Button */}
        <button
          type="button"
          onClick={onSaveAsPdf}
          disabled={isSavingPdf || isSubmitting}
          className={`px-4 py-2.5 bg-white hover:bg-gray-50 text-[#1a2744] border border-[#1a2744] font-bold text-[11px] uppercase tracking-wider rounded shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
            isSavingPdf || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          title="Download a local PDF copy without submitting"
        >
          {isSavingPdf ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#1a2744] border-t-transparent rounded-full animate-spin"></div>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span>Save as PDF</span>
            </>
          )}
        </button>

        {/* Print Application Button */}
        <button
          type="button"
          onClick={onPrint}
          disabled={isSubmitting}
          className={`px-4 py-2.5 bg-white hover:bg-gray-50 text-[#1a2744] border border-[#1a2744] font-bold text-[11px] uppercase tracking-wider rounded shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          title="Print the application package in A4 format"
        >
          <span>🖨</span>
          <span>Print Application</span>
        </button>

        {/* Submit Application Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2.5 bg-[#1a2744] hover:bg-[#25365d] text-[#c4a56a] font-bold text-[11px] uppercase tracking-widest rounded border border-[#c4a56a] shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#c4a56a] border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <span>📨</span>
              <span>Submit Application</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
