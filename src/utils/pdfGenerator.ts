import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { MemberFormData } from '../types';
import { buildPrintSnapshot } from './pdfSnapshot';
import { appendAttachmentsToPdf } from './attachments';

export interface GeneratedPdfResult {
  blob: Blob;
  dataUri: string;
  filename: string;
}

const PLACEHOLDER_COLOR = '#757575';

// Formats a native <input type="date"> ISO value (YYYY-MM-DD) the same way
// Chromium displays it (M/D/YYYY), since we're about to render the raw
// value as plain text rather than through the native date control.
function formatDateForDisplay(isoValue: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoValue);
  if (!match) return isoValue;
  const [, year, month, day] = match;
  return `${month}/${day}/${year}`;
}

// ROOT CAUSE (full writeup): html2canvas-pro rasterizes the DOM instead of
// laying out real text, and <input>/<select> values go through a
// special-cased renderer (render/canvas/content-renderer.js) that:
//   - for <input>: computes verticalOffset = (contentBoxHeight - fontSize) / 2
//     and draws the value at contentBox.top + verticalOffset + baselineMetric.
//     That's the textbook CSS half-leading formula and would be correct,
//     except baselineMetric (html2canvas's own measured approximation of
//     this webfont's ascent) doesn't exactly match the font's real metrics.
//     Algebraically, that mismatch is a CONSTANT pixel error that is
//     independent of both line-height and padding — proven two ways: (1)
//     deriving the offset equation shows contentBox.top cancels out of the
//     error entirely, so no padding value changes it, and (2) confirmed by
//     directly rendering a real `.field input` through html2canvas-pro at
//     seven different padding values (at the exact scale:1.5 this file
//     captures at) and reading back the rasterized pixels — the error was
//     ~5.1-5.5px every time depending on font-size, never zero, never
//     changed by padding or line-height.
//   - for <select>: SelectElementContainer doesn't extend
//     InputElementContainer in this library, so verticalOffset is never
//     computed at all — its text always starts at the literal top of the
//     content box, with no line-height value able to fix it without
//     coincidentally matching one specific font/size-dependent equation.
// Native browser inputs/selects center their value in their own UA shadow
// DOM, entirely independent of line-height, so none of this is ever visible
// on screen — only in the rasterized PDF.
// Since the bug lives in that one special-cased code path, the correct
// fix is to make html2canvas never use it: replace every <input>/<select>
// with a plain <div> using the SAME computed styles plus
// `display:flex;align-items:center`, which routes through html2canvas's
// normal (and correctly-centering) flex/text layout instead. This only
// touches the temporary DOM clone html2canvas hands to the onclone hook —
// the live, interactive form the user actually edits is never modified.
function replaceFormControlsForCapture(root: HTMLElement): void {
  const controls = root.querySelectorAll('input, select');

  controls.forEach((control) => {
    if (control instanceof HTMLInputElement && (control.type === 'checkbox' || control.type === 'radio')) {
      // Unaffected by this bug (rendered via a separate, correct code path)
      // — leave them as real inputs.
      return;
    }

    let text = '';
    let isPlaceholder = false;

    if (control instanceof HTMLInputElement) {
      if (control.value) {
        text = control.type === 'date' ? formatDateForDisplay(control.value) : control.value;
      } else {
        text = control.placeholder || '';
        isPlaceholder = true;
      }
    } else if (control instanceof HTMLSelectElement) {
      const selected = control.options[control.selectedIndex];
      text = selected ? selected.text : '';
    }

    const computed = getComputedStyle(control);
    const replacement = document.createElement('div');
    replacement.textContent = text;
    replacement.style.display = 'flex';
    replacement.style.alignItems = 'center';
    replacement.style.boxSizing = computed.boxSizing;
    replacement.style.width = computed.width;
    replacement.style.height = computed.height;
    replacement.style.padding = computed.padding;
    replacement.style.border = computed.border;
    replacement.style.borderRadius = computed.borderRadius;
    replacement.style.background = computed.backgroundColor;
    replacement.style.fontFamily = computed.fontFamily;
    replacement.style.fontSize = computed.fontSize;
    replacement.style.fontWeight = computed.fontWeight;
    replacement.style.textAlign = computed.textAlign;
    replacement.style.color = isPlaceholder ? PLACEHOLDER_COLOR : computed.color;

    control.replaceWith(replacement);
  });
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
    elPosition: string;
    elTop: string;
    elLeft: string;
  }
  const originalDisplays: DisplayState[] = [];

  try {
    // Unhide parent containers and elements temporarily so html2canvas can capture all form panels.
    // Every page is pulled off-screen (position:fixed, far outside the viewport) while unhidden —
    // toggling them to display:block in place would visibly shift/resize the page the user is
    // currently looking at (its scale-to-fit transform gets neutralized below) for the ~100ms+
    // capture window, producing a jarring "shake". Off-screen positioning keeps layout/capture
    // correct without ever touching what's on screen.
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
        elPosition: el.style.position,
        elTop: el.style.top,
        elLeft: el.style.left,
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
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.left = '-99999px';
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
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200,
          onclone: async (clonedDocument: Document, clonedElement: HTMLElement) => {
            replaceFormControlsForCapture(clonedElement);
            // Measure text with the real webfont, not a fallback font
            try {
              await clonedDocument.fonts.ready;
            } catch {
              // ignore — render with whatever is loaded
            }
          },
        })
      )
    );

    canvases.forEach((canvas, i) => {
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
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
      item.el.style.position = item.elPosition;
      item.el.style.top = item.elTop;
      item.el.style.left = item.elLeft;
      if (item.elHiddenClass) {
        item.el.classList.add('hidden');
      }
    }
  }

  const blob = pdf.output('blob');
  // jsPDF's own output('datauristring') has a known reliability issue where
  // its internal base64 string-building silently corrupts larger PDFs, while
  // output('blob') (used for the working "Download PDF" button) takes a
  // separate, reliable code path. Deriving the data URI from that same blob
  // via the browser's native FileReader avoids the buggy method entirely.
  const dataUri = await blobToDataUri(blob);

  return {
    blob,
    dataUri,
    filename,
  };
}

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error || new Error('Failed to read PDF blob.'));
    reader.readAsDataURL(blob);
  });
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

/**
 * Produces the application PDF. Prefers the server-side Chromium renderer
 * (/api/pdf), which outputs sharp vector text laid out exactly as on screen;
 * falls back to the in-browser html2canvas capture above if the server is
 * unreachable, so a PDF is always produced.
 */
/** The email-verification session was rejected by /api/pdf; the applicant must verify again. */
export class SessionExpiredError extends Error {
  constructor() {
    super('Your email verification has expired. Please verify your email again — your form is saved.');
    this.name = 'SessionExpiredError';
  }
}

/** The server PDF service could not produce a PDF (after a retry). */
export class PdfServiceUnavailableError extends Error {
  constructor() {
    super("The PDF couldn't be created right now. Please try again in a minute — your form is saved.");
    this.name = 'PdfServiceUnavailableError';
  }
}

async function renderOnServer(otpSessionToken?: string): Promise<Blob> {
  const html = buildPrintSnapshot();
  const response = await fetch('/api/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, otpSessionToken }),
  });
  // An expired/invalid email session must be surfaced (re-verify), never hidden
  // behind the lower-quality in-browser capture.
  if (response.status === 403) throw new SessionExpiredError();
  if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) {
    throw new Error(`PDF service responded with HTTP ${response.status}`);
  }
  return response.blob();
}

/**
 * Produces the application PDF with the server-side Chromium renderer
 * (/api/pdf, sharp vector text), retrying once. The in-browser html2canvas
 * capture misplaces some text/badges, so it is only used when `allowFallback`
 * is set — i.e. for submission, where an imperfect PDF beats losing the
 * application. Downloads/printing instead report PdfServiceUnavailableError.
 */
export async function generateApplicationPdf(
  data: MemberFormData,
  refNo: string,
  docDate: string,
  otpSessionToken?: string,
  { allowFallback = false }: { allowFallback?: boolean } = {}
): Promise<GeneratedPdfResult> {
  const cleanName = (data.candidateName || 'Applicant').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${refNo.trim() || 'CBBCL'}_${cleanName}_Membership_Application.pdf`;

  let formPdf: Blob | null = null;
  for (let attempt = 1; attempt <= 2 && !formPdf; attempt++) {
    try {
      formPdf = await renderOnServer(otpSessionToken);
    } catch (err) {
      if (err instanceof SessionExpiredError) throw err;
      console.warn(`Server PDF attempt ${attempt} failed:`, err);
      if (attempt === 1) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  if (!formPdf) {
    if (!allowFallback) throw new PdfServiceUnavailableError();
    console.warn('Server PDF unavailable; using in-browser capture for the submission.');
    formPdf = (await generateFullApplicationPdf(data, refNo, docDate)).blob;
  }

  // Uploaded supporting documents are appended here, in the browser, as A4 pages.
  const blob = await appendAttachmentsToPdf(formPdf, data, refNo);
  return { blob, dataUri: await blobToDataUri(blob), filename };
}
