import React from 'react';
import { MemberFormData } from '../types';
import { FormEReferencesDeclaration } from './FormEReferencesDeclaration';
import { FormFDocumentChecklist } from './FormFDocumentChecklist';
import { FormGOfficialUseOnlyPage } from './FormGOfficialUseOnlyPage';
import { PageNavigationFooter } from './PageNavigationFooter';

interface Form4Props {
  data: MemberFormData;
  onChange: (field: keyof MemberFormData, value: any) => void;
  docNo: string;
  docDate: string;
  onPrevious?: () => void;
  onSaveAsPdf?: () => void;
  onPrint?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isSavingPdf?: boolean;
}

export const Form4DocumentChecklist: React.FC<Form4Props> = ({
  data,
  onChange,
  docNo,
  docDate,
  onPrevious,
  onSaveAsPdf,
  onPrint,
  onSubmit,
  isSubmitting = false,
  isSavingPdf = false,
}) => {
  return (
    <div className="space-y-6">
      {/* PAGE 5: FORM E - REFERENCES & LEGAL DECLARATION */}
      <FormEReferencesDeclaration
        data={data}
        onChange={onChange}
        docNo={docNo}
        docDate={docDate}
      />

      {/* PAGE 6: FORM F - COMPACT DOCUMENT UPLOAD CHECKLIST & VERIFICATION */}
      <FormFDocumentChecklist
        data={data}
        onChange={onChange}
        docNo={docNo}
        docDate={docDate}
      />

      {/* PAGE 7: FORM G - OFFICIAL USE ONLY & BOARD APPROVAL */}
      <FormGOfficialUseOnlyPage
        data={data}
        docNo={docNo}
        docDate={docDate}
      />

      {/* NAVIGATION ACTION BUTTONS (NO-PRINT) */}
      <PageNavigationFooter
        currentPage={4}
        totalPages={4}
        onPrevious={onPrevious}
        onSaveAsPdf={onSaveAsPdf}
        onPrint={onPrint}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isSavingPdf={isSavingPdf}
      />
    </div>
  );
};
