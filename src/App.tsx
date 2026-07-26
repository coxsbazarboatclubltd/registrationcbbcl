import React, { useState, useMemo, useEffect } from 'react';
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
import { MemberFormData, SAMPLE_MEMBER_DATA, EMPTY_MEMBER_DATA } from './types';
import { SubmissionModal } from './components/SubmissionModal';
import { validateMemberForm, ValidationError } from './utils/formValidation';
import { generateFullApplicationPdf, downloadPdfBlob, GeneratedPdfResult } from './utils/pdfGenerator';
import { ReferenceService } from './services/referenceService';
import { SubmissionService } from './services/submissionService';

const LOCAL_STORAGE_KEY = 'cbbc_membership_form_data_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

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

  const handleSaveAsPdf = async () => {
    if (isSavingPdf || isSubmitting) return;
    setIsSavingPdf(true);

    try {
      const tempRefNo = formData.registrationNumber || referenceNumber || 'CBBCL-2026-000001';
      const result = await generateFullApplicationPdf(formData, tempRefNo, dateStr);
      downloadPdfBlob(result.blob, result.filename);
    } catch (err) {
      console.error('Save as PDF error:', err);
      alert('Could not generate PDF download. Please ensure all form pages are rendered and try again.');
    } finally {
      setIsSavingPdf(false);
    }
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

    // Update registration number in formData
    const updatedFormData = { ...formData, registrationNumber: refNo };
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
      generated = await generateFullApplicationPdf(updatedFormData, refNo, dateStr);
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
        docNo
      );

      if (submitRes.success) {
        setModalStatus('success');
        setIsSubmitting(false);
      } else {
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
      {/* SECTION A: SITE HEADER (Hidden on print) */}
      <SiteHeader
        onSampleData={() => setFormData(SAMPLE_MEMBER_DATA)}
        onClearForm={() => setFormData(EMPTY_MEMBER_DATA)}
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
