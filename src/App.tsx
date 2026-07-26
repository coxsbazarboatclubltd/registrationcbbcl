import React, { useState, useMemo, useEffect } from 'react';
import { Form1PermanentMembership } from './components/Form1PermanentMembership';
import { Form2ProximityCard } from './components/Form2ProximityCard';
import { Form3ProfileSync } from './components/Form3ProfileSync';
import { Form4DocumentChecklist } from './components/Form4DocumentChecklist';
import { CbbcLogo } from './components/CbbcLogo';
import { MemberFormData, SAMPLE_MEMBER_DATA, EMPTY_MEMBER_DATA } from './types';
import { SubmissionModal } from './components/SubmissionModal';
import { validateMemberForm, ValidationError } from './utils/formValidation';
import { generateFullApplicationPdf, GeneratedPdfResult } from './utils/pdfGenerator';
import { EmailService } from './services/emailService';
import { ReferenceService } from './services/referenceService';
import { SubmissionService } from './services/submissionService';

const LOCAL_STORAGE_KEY = 'cbbc_membership_form_data_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  // Initialize state from local storage or sample data
  const [formData, setFormData] = useState<MemberFormData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...SAMPLE_MEMBER_DATA, ...parsed };
      }
    } catch (e) {
      console.warn('Could not parse saved local storage form data:', e);
    }
    return SAMPLE_MEMBER_DATA;
  });

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not save form data to local storage:', e);
    }
  }, [formData]);

  // Submission & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    'idle' | 'validating' | 'generating_pdf' | 'sending_email' | 'success' | 'error' | 'validation_error'
  >('idle');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);
  const [pdfResult, setPdfResult] = useState<GeneratedPdfResult | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('mock-turnstile-verified-token');
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  // Auto-generate Doc Numbers and Date once on initial load
  const { dateStr, docNo1, docNo2, docNo3, docNo4 } = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const cleanDate = dStr.replace(/-/g, '');
    const timeBase = String(now.getTime()).slice(-5);

    const uid1 = timeBase + String(Math.floor(Math.random() * 900) + 100);
    const uid2 = timeBase + String(Math.floor(Math.random() * 900) + 100);
    const uid3 = timeBase + String(Math.floor(Math.random() * 900) + 100);
    const uid4 = timeBase + String(Math.floor(Math.random() * 900) + 100);

    return {
      dateStr: dStr,
      docNo1: `CBBC-PM-${cleanDate}-${uid1}`,
      docNo2: `CBBC-PX-${cleanDate}-${uid2}`,
      docNo3: `CBBC-PS-${cleanDate}-${uid3}`,
      docNo4: `CBBC-DC-${cleanDate}-${uid4}`,
    };
  }, []);

  const handleFieldChange = (field: keyof MemberFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrint = () => {
    window.print();
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

    // 1. Validate form fields, formats, uploads & declarations
    const errors = validateMemberForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setModalStatus('validation_error');
      setIsSubmitting(false);
      return;
    }

    // 2. Generate Complete 4-Page Registration PDF Package
    let generated: GeneratedPdfResult | null = null;
    try {
      setModalStatus('generating_pdf');
      generated = await generateFullApplicationPdf(formData, refNo, dateStr);
      setPdfResult(generated);
    } catch (pdfErr: any) {
      console.warn('PDF generation error:', pdfErr);
    }

    // 3. Transmit Application to Serverless Function /api/submit
    try {
      setModalStatus('sending_email');

      const submitRes = await SubmissionService.submitApplication(
        formData,
        refNo,
        dateStr,
        generated?.dataUri || '',
        turnstileToken
      );

      if (submitRes.success) {
        setModalStatus('success');
        setIsSubmitting(false);
      } else {
        // Fallback to EmailJS if serverless endpoint unreachable/unconfigured
        if (EmailService.isConfigured()) {
          const emailJsRes = await EmailService.sendApplication(
            formData,
            refNo,
            dateStr,
            generated?.dataUri
          );
          if (emailJsRes.success) {
            setModalStatus('success');
            setIsSubmitting(false);
            return;
          }
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

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e8e8]">
      {/* SECTION A: TOP BAR (Hidden on print) */}
      <header className="top-bar no-print">
        <div className="flex items-center gap-3">
          <CbbcLogo clipPathId="clippath-topbar" className="w-[42px] h-[42px]" />
          <div className="text-left hidden sm:block">
            <span className="text-[7px] text-gray-300 tracking-[1.5px] uppercase block">
              Established 2026
            </span>
            <span className="font-['Cinzel'] text-[13px] font-bold text-[#c4a56a] tracking-[1px]">
              COX'S BAZAR BOAT CLUB
            </span>
          </div>
        </div>

        <div className="title-center">COX'S BAZAR BOAT CLUB LTD.</div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFormData(SAMPLE_MEMBER_DATA)}
            className="text-[9px] uppercase tracking-wider text-[#c4a56a] hover:text-white underline transition-colors cursor-pointer mr-2"
            title="Pre-fill with sample member profile"
          >
            Sample Data
          </button>
          <button
            onClick={() => setFormData(EMPTY_MEMBER_DATA)}
            className="text-[9px] uppercase tracking-wider text-gray-400 hover:text-white underline transition-colors cursor-pointer mr-2"
            title="Reset form fields"
          >
            Clear Form
          </button>
          <div className="portal-label">Member Portal</div>
        </div>
      </header>

      {/* FOUR TAB BUTTONS (Hidden on print) */}
      <nav className="tab-nav no-print">
        <button
          className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          <span>01</span> Application for Permanent Membership
        </button>
        <button
          className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          <span>02</span> Database for Proximity ID Card
        </button>
        <button
          className={`tab-btn ${activeTab === 3 ? 'active' : ''}`}
          onClick={() => setActiveTab(3)}
        >
          <span>03</span> Profile Synchronization &amp; Database Form
        </button>
        <button
          className={`tab-btn ${activeTab === 4 ? 'active' : ''}`}
          onClick={() => setActiveTab(4)}
        >
          <span>04</span> Document Checklist
        </button>
      </nav>

      {/* CANVAS & ACTIVE FORM PANEL */}
      <main className="canvas-container flex-1">
        {/* Floating / Top Action Buttons (Hidden on print) */}
        <div className="print-btn-wrap no-print flex items-center justify-center gap-3 flex-wrap max-w-4xl mx-auto px-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-[#1a2744] text-[#c4a56a] hover:bg-[#25365d] border border-[#c4a56a] rounded font-['Lato'] text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>📨</span> Submit Application
              </>
            )}
          </button>

          <button onClick={handlePrint} className="print-btn">
            🖨 Print / Save as PDF
          </button>
        </div>

        {/* Form 1 */}
        <div className={`form-panel ${activeTab === 1 ? 'block' : 'hidden'}`}>
          <Form1PermanentMembership
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo1}
            docDate={dateStr}
          />
        </div>

        {/* Form 2 */}
        <div className={`form-panel ${activeTab === 2 ? 'block' : 'hidden'}`}>
          <Form2ProximityCard
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo2}
            docDate={dateStr}
          />
        </div>

        {/* Form 3 */}
        <div className={`form-panel ${activeTab === 3 ? 'block' : 'hidden'}`}>
          <Form3ProfileSync
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo3}
            docDate={dateStr}
          />
        </div>

        {/* Form 4 */}
        <div className={`form-panel ${activeTab === 4 ? 'block' : 'hidden'}`}>
          <Form4DocumentChecklist
            data={formData}
            onChange={handleFieldChange}
            docNo={docNo4}
            docDate={dateStr}
          />
        </div>

        {/* Bottom Submission Action Bar */}
        <div className="no-print mt-8 text-center max-w-2xl mx-auto px-4 bg-white p-5 rounded-lg border border-[#c8c8c8] shadow-sm">
          <h4 className="font-['Cinzel'] text-sm font-bold text-[#1a2744] mb-1">
            Ready to Submit Your Application?
          </h4>
          <p className="text-xs text-gray-600 mb-4">
            Clicking "Submit Application" will validate your entries, generate the official PDF registration document, and automatically transmit your application to <span className="font-bold text-[#1a2744]">membership@coxsbazarboatclubltd.com</span>.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 bg-[#1a2744] text-white hover:bg-[#9d7f46] rounded font-bold text-xs uppercase tracking-widest shadow transition-all flex items-center gap-2 cursor-pointer ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>📨</span> Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      </main>

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
        onReset={() => setFormData(EMPTY_MEMBER_DATA)}
      />
    </div>
  );
}

