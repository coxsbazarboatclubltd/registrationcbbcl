import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FormAPersonalInfo } from './components/FormAPersonalInfo';
import { FormBProfessionalFamily } from './components/FormBProfessionalFamily';
import { Form2ProximityCard } from './components/Form2ProximityCard';
import { Form3ProfileSync } from './components/Form3ProfileSync';
import { FormEReferencesDeclaration } from './components/FormEReferencesDeclaration';
import { FormFDocumentChecklist } from './components/FormFDocumentChecklist';
import { FormGOfficialUseOnlyPage } from './components/FormGOfficialUseOnlyPage';
import { PageNavigationFooter } from './components/PageNavigationFooter';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { MemberFormData, EMPTY_MEMBER_DATA } from './types';
import { SubmissionModal } from './components/SubmissionModal';
import { validateMemberForm, ValidationError } from './utils/formValidation';
import { generateApplicationPdf, downloadPdfBlob, GeneratedPdfResult } from './utils/pdfGenerator';
import { buildPrintSnapshot } from './utils/pdfSnapshot';
import { ReferenceService } from './services/referenceService';
import { SubmissionService } from './services/submissionService';
import { EmailGate } from './components/EmailGate';
import { installUppercaseInputs } from './utils/forceUppercase';
import { loadDraft, saveDraft, clearDraft, requestPersistentStorage } from './utils/draftStore';

const OTP_SESSION_KEY = 'cbbc_otp_session_v1';
const DRAFT_SAVE_DELAY_MS = 300;

type TabNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface OtpSession {
  email: string;
  token: string;
}

export default function App() {
  // Kept in localStorage (not sessionStorage) so a browser crash or power cut
  // doesn't force the applicant to re-verify; the token itself expires server-side.
  const [otpSession, setOtpSession] = useState<OtpSession | null>(() => {
    try {
      const saved = localStorage.getItem(OTP_SESSION_KEY) || sessionStorage.getItem(OTP_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<TabNumber>(1);
  const [formData, setFormData] = useState<MemberFormData>(EMPTY_MEMBER_DATA);
  const [draftReady, setDraftReady] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  // Set once the application is submitted so the draft isn't re-saved afterwards
  const draftClosedRef = useRef(false);

  // Restore the saved draft (form fields, photos, uploads and current page)
  useEffect(() => {
    requestPersistentStorage();
    loadDraft().then((draft) => {
      // Earlier builds pre-filled a sample profile and persisted it; discard
      // those drafts so returning visitors start from a clean form.
      if (draft && draft.formData?.candidateName !== 'SAYEED REZA CHOWDHURY') {
        setFormData((prev) => ({ ...EMPTY_MEMBER_DATA, ...draft.formData, email: prev.email || draft.formData.email || '' }));
        if (draft.activeTab >= 1 && draft.activeTab <= 7) setActiveTab(draft.activeTab as TabNumber);
        if (draft.savedAt) setDraftSavedAt(draft.savedAt);
      }
      setDraftReady(true);
    });
  }, []);

  // Auto-save the draft shortly after every change
  useEffect(() => {
    if (!draftReady || draftClosedRef.current) return;
    const timer = setTimeout(() => {
      const savedAt = Date.now();
      saveDraft({ formData, activeTab, savedAt })
        .then(() => setDraftSavedAt(savedAt))
        .catch((e) => console.warn('Could not save draft:', e));
    }, DRAFT_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [formData, activeTab, draftReady]);

  const discardDraft = async () => {
    setFormData({ ...EMPTY_MEMBER_DATA, email: otpSession?.email || EMPTY_MEMBER_DATA.email });
    setActiveTab(1);
    setDraftSavedAt(null);
    await clearDraft();
  };

  const handleClearForm = () => {
    const confirmed = window.confirm(
      'Discard this application draft?\n\nAll information, photos and documents you have entered will be permanently erased. This cannot be undone.'
    );
    if (confirmed) discardDraft();
  };

  // All free-text fields are captured in CAPITAL LETTERS (emails excluded)
  useEffect(() => installUppercaseInputs(), []);

  // Scale + re-center the fixed A4-width (210mm) page canvas to fit any
  // viewport so mobile users see a shrunk-but-readable page instead of a
  // horizontally clipped desktop layout. Exposed as --page-scale/--page-offset
  // and consumed by the .page rule in index.css; never applies to print/PDF
  // output (pdfGenerator.ts resets both before capturing each page).
  // Manual zoom multiplier layered on top of the auto-fit scale below, so
  // users can read/edit fine print without depending on viewport width.
  const [zoomLevel, setZoomLevel] = useState(1);
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2, +(z + 0.1).toFixed(2)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.4, +(z - 0.1).toFixed(2)));
  const handleZoomReset = () => setZoomLevel(1);

  useEffect(() => {
    const A4_WIDTH_PX = 210 * (96 / 25.4);
    const VIEWPORT_GUTTER_PX = 16;
    // The A4 canvas uses print-size type (8–10px); on wide screens enlarge it
    // up to this factor so the text is comfortably readable.
    const MAX_AUTO_SCALE = 1.5;
    // Natural max width of the fluid (non-A4) Document Checklist editor (max-w-4xl)
    const FLUID_CONTENT_WIDTH_PX = 896;

    const updateScale = () => {
      const available = window.innerWidth - VIEWPORT_GUTTER_PX;
      const rawScale = Math.min(MAX_AUTO_SCALE, available / A4_WIDTH_PX);
      const fitScale = Math.max(rawScale, 0.28);
      const scale = fitScale * zoomLevel;
      const offsetPx = Math.max(0, (window.innerWidth - A4_WIDTH_PX * scale) / 2);
      // Fluid content is wider than A4, so cap its enlargement separately to
      // keep it inside the viewport (identical to --page-scale when shrinking).
      const fluidScale = Math.min(scale, Math.max(1, available / FLUID_CONTENT_WIDTH_PX) * zoomLevel);
      document.documentElement.style.setProperty('--page-scale', scale.toFixed(4));
      document.documentElement.style.setProperty('--page-offset', `${offsetPx.toFixed(2)}px`);
      document.documentElement.style.setProperty('--fluid-scale', fluidScale.toFixed(4));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [zoomLevel]);

  // The margin-bottom compensation for the scale transform (see .page/.zoom-scale
  // in index.css) needs the ACTIVE page's real unscaled height, since content
  // can run longer than the nominal 297mm (min-height is a floor, not a cap).
  // A stale/fixed height there is why the page-navigation footer could hide
  // under the visually-scaled page on longer pages. offsetHeight is a layout
  // property and ignores the CSS transform, so it's always the true height.
  useEffect(() => {
    const activeEl = document.getElementById(
      activeTab === 6 ? 'form-6-onscreen' : `form-${activeTab}-page`
    );
    if (!activeEl) return;

    const updateNaturalHeight = () => {
      document.documentElement.style.setProperty('--page-natural-height', `${activeEl.offsetHeight}px`);
    };

    updateNaturalHeight();
    const observer = new ResizeObserver(updateNaturalHeight);
    observer.observe(activeEl);
    return () => observer.disconnect();
  }, [activeTab]);

  // Submission & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    'idle' | 'validating' | 'generating_pdf' | 'sending_email' | 'success' | 'error' | 'validation_error'
  >('idle');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);
  const [pdfResult, setPdfResult] = useState<GeneratedPdfResult | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('mock-turnstile-verified-token');
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  // Auto-generate Doc Number and Application Date once on initial load
  const { dateStr, docNo } = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const cleanDate = dStr.replace(/-/g, '');
    const timeBase = String(now.getTime()).slice(-5);
    const randDigits = String(Math.floor(Math.random() * 900) + 100);

    return {
      dateStr: dStr,
      docNo: `CBBCL-DOC-${cleanDate}-${timeBase}${randDigits}`,
    };
  }, []);

  const handleVerified = (verifiedEmail: string, token: string) => {
    const session: OtpSession = { email: verifiedEmail, token };
    setOtpSession(session);
    localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
    setFormData((prev) => ({ ...prev, email: verifiedEmail }));
  };

  const handleFieldChange = (field: keyof MemberFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextPage = () => {
    if (activeTab < 7) {
      setActiveTab((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (activeTab > 1) {
      setActiveTab((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Same completeness check as Submit; shows the validation list and returns
  // false when anything required is missing.
  const ensureFormComplete = (): boolean => {
    const errors = validateMemberForm({ ...formData, email: otpSession?.email || formData.email });
    if (errors.length === 0) return true;
    setValidationErrors(errors);
    setModalStatus('validation_error');
    setIsModalOpen(true);
    return false;
  };

  const handleSaveAsPdf = async () => {
    if (isSavingPdf || isSubmitting) return;
    if (!ensureFormComplete()) return;
    setIsSavingPdf(true);

    try {
      const tempRefNo = formData.registrationNumber || referenceNumber || 'CBBCL-2026-000001';
      const result = await generateApplicationPdf(formData, tempRefNo, dateStr, otpSession?.token);
      downloadPdfBlob(result.blob, result.filename);
    } catch (err) {
      console.error('Save as PDF error:', err);
      alert('Could not generate PDF download. Please ensure all form pages are rendered and try again.');
    } finally {
      setIsSavingPdf(false);
    }
  };

  // Prints the same A4 snapshot the PDF uses (one sheet per page, no
  // on-screen scaling), via a hidden iframe so the app UI isn't printed.
  const handlePrint = () => {
    if (!ensureFormComplete()) return;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    iframe.onload = async () => {
      const win = iframe.contentWindow;
      if (!win) return;
      try {
        await win.document.fonts.ready;
      } catch {
        // print anyway
      }
      win.focus();
      win.print();
      setTimeout(() => iframe.remove(), 60_000);
    };
    iframe.srcdoc = buildPrintSnapshot();
    document.body.appendChild(iframe);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsModalOpen(true);
    setModalStatus('validating');
    setValidationErrors([]);
    setErrorDetails(undefined);

    // Generate unique application reference number (Format: CBBCL-YYYY-000001)
    const refNo = referenceNumber || ReferenceService.generateReferenceNumber();
    setReferenceNumber(refNo);

    // Update registration number in formData. Pin email to the verified OTP
    // session as a final safeguard — the field is meant to be locked, but
    // Clear Form/stale local storage could otherwise desync it
    // from the address that was actually verified, breaking the submit-time
    // token check.
    // Card name mirrors the candidate name and the membership number is
    // assigned by the Secretariat, so neither is taken from stale drafts.
    const updatedFormData = {
      ...formData,
      email: otpSession?.email || formData.email,
      registrationNumber: refNo,
      preferredCardName: formData.candidateName,
      membershipNo: '',
    };
    setFormData(updatedFormData);

    // 1. Validate form fields, formats, uploads & declarations across all pages
    const errors = validateMemberForm(updatedFormData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setModalStatus('validation_error');
      setIsSubmitting(false);
      return;
    }

    // 2. Generate Complete 7-Page Registration PDF Package
    let generated: GeneratedPdfResult | null = null;
    try {
      setModalStatus('generating_pdf');
      // Let React render the final values (reference number, pinned email)
      // into the pages before they're snapshotted for the PDF.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      generated = await generateApplicationPdf(updatedFormData, refNo, dateStr, otpSession?.token);
      setPdfResult(generated);
    } catch (pdfErr: any) {
      console.warn('PDF generation error:', pdfErr);
    }

    // 3. Transmit Application to Serverless Function /api/submit
    try {
      setModalStatus('sending_email');

      const submitRes = await SubmissionService.submitApplication(
        updatedFormData,
        refNo,
        dateStr,
        generated?.dataUri || '',
        turnstileToken,
        docNo,
        otpSession?.token
      );

      if (submitRes.success) {
        setModalStatus('success');
        setIsSubmitting(false);
        // Application is submitted — stop auto-saving and remove the draft
        draftClosedRef.current = true;
        clearDraft();
      } else {
        if (submitRes.errorDetails?.includes('Email verification session')) {
          setOtpSession(null);
          localStorage.removeItem(OTP_SESSION_KEY);
          sessionStorage.removeItem(OTP_SESSION_KEY);
        }
        setErrorDetails(submitRes.errorDetails || submitRes.message);
        setModalStatus('error');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorDetails(err?.message || 'An unexpected error occurred during submission.');
      setModalStatus('error');
      setIsSubmitting(false);
    }
  };

  if (!otpSession) {
    return <EmailGate onVerified={handleVerified} />;
  }

  if (!draftReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8] text-[#1a2744] text-sm font-semibold uppercase tracking-wider">
        Restoring your saved application…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e8e8]">
      {/* FLOATING ZOOM CONTROL (Hidden on print, visible on every form page) */}
      <div className="no-print fixed bottom-4 right-4 z-50 flex items-center gap-1 bg-white border border-[#1a2744]/30 rounded-full shadow-lg px-2 py-1.5">
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#1a2744] font-bold text-[14px] cursor-pointer"
        >
          −
        </button>
        <span className="text-[10px] font-bold text-[#1a2744] w-9 text-center select-none">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#1a2744] font-bold text-[14px] cursor-pointer"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomReset}
          title="Reset zoom"
          className="ml-1 px-2 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#1a2744] text-[9px] font-bold uppercase tracking-wider cursor-pointer border-l border-gray-200"
        >
          Reset
        </button>
      </div>

      {/* SECTION A: SITE HEADER (Hidden on print) */}
      <SiteHeader
        onClearForm={handleClearForm}
        draftSavedAt={draftSavedAt}
      />

      {/* SEVEN TAB NAVIGATION (Hidden on print) */}
      <nav className="tab-nav no-print">
        <button
          className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          <span>01</span> Membership Application
        </button>
        <button
          className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          <span>02</span> Professional &amp; Family Information
        </button>
        <button
          className={`tab-btn ${activeTab === 3 ? 'active' : ''}`}
          onClick={() => setActiveTab(3)}
        >
          <span>03</span> Membership ID Card Information
        </button>
        <button
          className={`tab-btn ${activeTab === 4 ? 'active' : ''}`}
          onClick={() => setActiveTab(4)}
        >
          <span>04</span> Member Database Synchronization
        </button>
        <button
          className={`tab-btn ${activeTab === 5 ? 'active' : ''}`}
          onClick={() => setActiveTab(5)}
        >
          <span>05</span> References &amp; Declaration
        </button>
        <button
          className={`tab-btn ${activeTab === 6 ? 'active' : ''}`}
          onClick={() => setActiveTab(6)}
        >
          <span>06</span> Document Checklist
        </button>
        <button
          className={`tab-btn ${activeTab === 7 ? 'active' : ''}`}
          onClick={() => setActiveTab(7)}
        >
          <span>07</span> Official Use Only
        </button>
      </nav>

      {/* CANVAS & ACTIVE FORM PANEL */}
      <main className="canvas-container flex-1 pb-12">
        {/* Tab 01: Form A - Membership Application */}
        <div className={`form-panel ${activeTab === 1 ? 'block' : 'hidden'}`}>
          <FormAPersonalInfo
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo}
            docDate={dateStr}
            lockedEmail={otpSession?.email}
          />
          <PageNavigationFooter
            currentPage={1}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </div>

        {/* Tab 02: Form B - Professional & Family Information */}
        <div className={`form-panel ${activeTab === 2 ? 'block' : 'hidden'}`}>
          <FormBProfessionalFamily
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo}
            docDate={dateStr}
          />
          <PageNavigationFooter
            currentPage={2}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </div>

        {/* Tab 03: Form C - Membership ID Card Information */}
        <div className={`form-panel ${activeTab === 3 ? 'block' : 'hidden'}`}>
          <Form2ProximityCard
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo}
            docDate={dateStr}
          />
          <PageNavigationFooter
            currentPage={3}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </div>

        {/* Tab 04: Form D - Member Database Synchronization */}
        <div className={`form-panel ${activeTab === 4 ? 'block' : 'hidden'}`}>
          <Form3ProfileSync
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo}
            docDate={dateStr}
          />
          <PageNavigationFooter
            currentPage={4}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </div>

        {/* Tab 05: Form E - References & Declaration */}
        <div className={`form-panel ${activeTab === 5 ? 'block' : 'hidden'}`}>
          <FormEReferencesDeclaration
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo}
            docDate={dateStr}
          />
          <PageNavigationFooter
            currentPage={5}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </div>

        {/* Tab 06: Form F - Document Checklist */}
        <div className={`form-panel ${activeTab === 6 ? 'block' : 'hidden'}`}>
          <FormFDocumentChecklist
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo}
            docDate={dateStr}
          />
          <PageNavigationFooter
            currentPage={6}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onSaveAsPdf={handleSaveAsPdf}
            onPrint={handlePrint}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSavingPdf={isSavingPdf}
          />
        </div>

        {/* Tab 07: Form G - Official Use Only */}
        <div className={`form-panel ${activeTab === 7 ? 'block' : 'hidden'}`}>
          <FormGOfficialUseOnlyPage
            data={formData}
            docNo={docNo}
            docDate={dateStr}
          />
          <PageNavigationFooter
            currentPage={7}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onSaveAsPdf={handleSaveAsPdf}
            onPrint={handlePrint}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSavingPdf={isSavingPdf}
          />
        </div>
      </main>

      <SiteFooter />

      {/* PDF GENERATION OVERLAY */}
      {isSavingPdf && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-lg shadow-2xl px-8 py-6 max-w-sm w-full text-center border-t-4 border-[#c4a56a]">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-[#1a2744]/15 border-t-[#1a2744] animate-spin" />
            <p className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">Generating your PDF…</p>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Please wait while your 7-page application is prepared. This can take up to 20 seconds — the download will
              start automatically.
            </p>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      <SubmissionModal
        isOpen={isModalOpen}
        status={modalStatus}
        validationErrors={validationErrors}
        errorDetails={errorDetails}
        pdfResult={pdfResult}
        applicantEmail={formData.email}
        referenceNumber={referenceNumber}
        submissionDate={dateStr}
        membershipCategory={formData.membershipCategory || 'Permanent'}
        onTurnstileVerify={(token) => setTurnstileToken(token)}
        onRetry={handleSubmit}
        onClose={() => setIsModalOpen(false)}
        onReset={discardDraft}
      />
    </div>
  );
}
