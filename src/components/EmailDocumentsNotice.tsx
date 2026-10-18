import React from 'react';
import { Mail } from 'lucide-react';
import { MemberFormData } from '../types';
import { checklistItemsFor, isDocumentEnclosed } from '../utils/documentChecklist';
import { formatLongDate } from '../utils/formatDate';

export const DOCUMENTS_EMAIL = 'registration@cbbcl.org';

/** mailto: link with the subject and the mandatory details pre-filled. */
export function documentsMailtoHref(data: MemberFormData, docDate: string): string {
  const name = data.candidateName || '';
  const documents = checklistItemsFor(data).filter((item) => isDocumentEnclosed(data, item)).map((item) => `- ${item.name}`);
  const body = [
    'Dear Membership Secretariat,',
    '',
    'Please find attached the documents for my membership application.',
    '',
    `Full Name: ${name}`,
    `Phone Number: ${data.mobile || ''}`,
    `Email Address: ${data.email || ''}`,
    `Application Date: ${formatLongDate(docDate)}`,
    '',
    'Documents attached:',
    ...(documents.length ? documents : ['- ']),
    '',
    'Regards,',
    name,
  ].join('\n');
  const subject = `Membership Application Documents – ${name || 'Applicant'}`;
  return `mailto:${DOCUMENTS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

interface Props {
  data: MemberFormData;
  docDate: string;
  /** Compact wording for the printed A4 page (no button) */
  print?: boolean;
}

/**
 * Red advisory: checklist documents are confidential, so members email them
 * separately to registration@cbbcl.org after submitting the form.
 */
export const EmailDocumentsNotice: React.FC<Props> = ({ data, docDate, print = false }) => {
  if (print) {
    return (
      <div className="border border-red-300 bg-red-50 text-red-800 rounded px-2.5 py-1.5 text-[8px] leading-snug">
        <span className="font-bold uppercase">Submit documents by email:</span> after submitting this form, email clear
        scanned copies of all checklist documents to <span className="font-bold">{DOCUMENTS_EMAIL}</span>, separately
        and under privacy (confidential documents). <span className="font-bold">The email must state:</span> Full Name ·
        Phone Number · Email Address · Application Date.
      </div>
    );
  }

  return (
    <div className="border-2 border-red-300 bg-red-50 rounded-lg p-3 text-[10px] text-red-800 leading-relaxed">
      <div className="font-bold uppercase tracking-wider text-red-700 mb-1 flex items-center gap-1.5">
        <Mail className="w-3.5 h-3.5" aria-hidden="true" /> Submit your documents by email
      </div>
      <p>
        After submitting this form, please email clear scanned copies of <strong>all the checklist documents</strong> to{' '}
        <a href={`mailto:${DOCUMENTS_EMAIL}`} className="font-bold underline">
          {DOCUMENTS_EMAIL}
        </a>
        . As these are confidential documents, they must be sent <strong>separately from this form, under privacy</strong>.
      </p>
      <p className="mt-1">
        <strong>Your email must include:</strong> Full Name · Phone Number · Email Address · Application Date.
      </p>
      <a
        href={documentsMailtoHref(data, docDate)}
        className="mt-2 inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded no-print"
      >
        <Mail className="w-3 h-3" aria-hidden="true" /> Compose email with my details
      </a>
      <span className="ml-2 text-[9px] italic text-red-700/80 no-print">Attach your scanned documents, then send.</span>
    </div>
  );
};
