import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MemberFormData } from '../types';

export interface GeneratedPdfResult {
  blob: Blob;
  dataUri: string;
  filename: string;
}

/**
 * Generates a complete 4-page A4 PDF package containing all registration forms:
 * 1. Form 1: Permanent Membership Application
 * 2. Form 2: Proximity Access Card Requisition
 * 3. Form 3: Profile Synchronization & Database Form
 * 4. Form 4: Document Checklist & Declaration
 */
export async function generateFullApplicationPdf(
  data: MemberFormData,
  refNo: string,
  docDate: string
): Promise<GeneratedPdfResult> {
  const formIds = ['form-1-page', 'form-2-page', 'form-3-page', 'form-4-page'];
  const elements: HTMLElement[] = [];

  for (const id of formIds) {
    const el = document.getElementById(id);
    if (el) {
      elements.push(el);
    }
  }

  if (elements.length === 0) {
    throw new Error('Form pages were not found in the DOM for PDF generation.');
  }

  const cleanName = (data.candidateName || 'Applicant').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${refNo}_${cleanName}_Membership_Package.pdf`;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = 210; // A4 width in mm
  const pdfHeight = 297; // A4 height in mm

  // Store original display styles to restore after capture
  const originalDisplays: { el: HTMLElement; parent: HTMLElement | null; display: string }[] = [];

  try {
    // Unhide parent containers temporarily so html2canvas can capture all 4 form panels
    for (const el of elements) {
      const parent = el.closest('.form-panel') as HTMLElement | null;
      if (parent) {
        originalDisplays.push({
          el,
          parent,
          display: parent.style.display,
        });
        parent.style.display = 'block';
        parent.style.visibility = 'visible';
      }
    }

    // Small delay to allow browser layout reflow
    await new Promise((resolve) => setTimeout(resolve, 100));

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  } finally {
    // Restore original visibility styles
    for (const item of originalDisplays) {
      if (item.parent) {
        item.parent.style.display = item.display;
        item.parent.style.visibility = '';
      }
    }
  }

  const blob = pdf.output('blob');
  const dataUri = pdf.output('datauristring');

  return {
    blob,
    dataUri,
    filename,
  };
}

/**
 * Single-page or target element fallback PDF generator
 */
export async function generateFormPdf(
  elementOrId: HTMLElement | string,
  data: MemberFormData,
  docNo: string
): Promise<GeneratedPdfResult> {
  return generateFullApplicationPdf(data, docNo, new Date().toISOString().split('T')[0]);
}

/**
 * Helper to trigger browser download of a generated PDF Blob.
 */
export function downloadPdfBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
