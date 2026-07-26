import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { MemberFormData } from '../types';

export interface GeneratedPdfResult {
  blob: Blob;
  dataUri: string;
  filename: string;
}

/**
 * Generates a complete 7-page A4 PDF package containing all registration forms:
 * 1. Form A: Membership Application
 * 2. Form B: Professional & Family Information
 * 3. Form C: Proximity Access Card Requisition
 * 4. Form D: Member Database Synchronization
 * 5. Form E: References & Declaration
 * 6. Form F: Document Checklist
 * 7. Form G: Official Use Only
 */
export async function generateFullApplicationPdf(
  data: MemberFormData,
  refNo: string,
  docDate: string
): Promise<GeneratedPdfResult> {
  const formIds = [
    'form-1-page',
    'form-2-page',
    'form-3-page',
    'form-4-page',
    'form-5-page',
    'form-6-page',
    'form-7-page',
  ];
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
  interface DisplayState {
    el: HTMLElement;
    parent: HTMLElement | null;
    parentDisplay: string;
    parentVisibility: string;
    elDisplay: string;
    elVisibility: string;
    elHiddenClass: boolean;
    elTransform: string;
    elMarginBottom: string;
  }
  const originalDisplays: DisplayState[] = [];

  try {
    // Unhide parent containers and elements temporarily so html2canvas can capture all form panels
    for (const el of elements) {
      const parent = el.closest('.form-panel') as HTMLElement | null;
      const elHiddenClass = el.classList.contains('hidden');
      originalDisplays.push({
        el,
        parent,
        parentDisplay: parent ? parent.style.display : '',
        parentVisibility: parent ? parent.style.visibility : '',
        elDisplay: el.style.display,
        elVisibility: el.style.visibility,
        elHiddenClass,
        elTransform: el.style.transform,
        elMarginBottom: el.style.marginBottom,
      });

      if (parent) {
        parent.style.display = 'block';
        parent.style.visibility = 'visible';
      }

      if (elHiddenClass) {
        el.classList.remove('hidden');
      }
      el.style.display = 'block';
      el.style.visibility = 'visible';
      // Neutralize the mobile-responsive scale-to-fit transform (see .page in
      // index.css) so the PDF always captures the page at true A4 size.
      el.style.transform = 'none';
      el.style.marginBottom = '0';
    }

    // Small delay to allow browser layout reflow
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture all pages concurrently — html2canvas-pro natively supports the
    // oklch/color-mix colors Tailwind v4 generates, so no DOM-wide color-patching
    // pass is needed per page (that traversal was the main source of slow, and
    // occasionally incorrect, PDF generation).
    const canvases = await Promise.all(
      elements.map((element) =>
        html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200,
        })
      )
    );

    canvases.forEach((canvas, i) => {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    });
  } finally {
    // Restore original visibility styles
    for (const item of originalDisplays) {
      if (item.parent) {
        item.parent.style.display = item.parentDisplay;
        item.parent.style.visibility = item.parentVisibility;
      }
      item.el.style.display = item.elDisplay;
      item.el.style.visibility = item.elVisibility;
      item.el.style.transform = item.elTransform;
      item.el.style.marginBottom = item.elMarginBottom;
      if (item.elHiddenClass) {
        item.el.classList.add('hidden');
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
