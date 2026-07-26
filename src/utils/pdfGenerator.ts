import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MemberFormData } from '../types';

export interface GeneratedPdfResult {
  blob: Blob;
  dataUri: string;
  filename: string;
}

/**
 * Converts any CSS color string (e.g. oklab, oklch, color-mix) to standard rgb(...) or rgba(...)
 * using the browser's native DOM style computation engine.
 */
function convertColorToRgb(colorStr: string): string {
  try {
    const tempEl = document.createElement('div');
    tempEl.style.color = colorStr;
    document.body.appendChild(tempEl);
    const computed = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    if (computed && (computed.startsWith('rgb') || computed.startsWith('#'))) {
      return computed;
    }
  } catch (e) {
    // fallback
  }
  return 'rgb(0, 0, 0)';
}

/**
 * Replaces function calls like `oklab(...)`, `oklch(...)`, `color-mix(...)` in CSS strings.
 */
function replaceColorFunc(cssText: string, funcName: string): string {
  let result = cssText;
  let searchIdx = 0;

  while (true) {
    const startIdx = result.toLowerCase().indexOf(funcName + '(', searchIdx);
    if (startIdx === -1) break;

    let openParens = 0;
    let endIdx = -1;
    for (let i = startIdx + funcName.length; i < result.length; i++) {
      if (result[i] === '(') openParens++;
      else if (result[i] === ')') {
        openParens--;
        if (openParens === 0) {
          endIdx = i;
          break;
        }
      }
    }

    if (endIdx !== -1) {
      const originalFunc = result.slice(startIdx, endIdx + 1);
      const rgbValue = convertColorToRgb(originalFunc);
      result = result.slice(0, startIdx) + rgbValue + result.slice(endIdx + 1);
      searchIdx = startIdx + rgbValue.length;
    } else {
      searchIdx = startIdx + funcName.length + 1;
    }
  }

  return result;
}

/**
 * Fixes unsupported CSS color functions (oklab, oklch, color-mix) in a cloned document
 * before html2canvas parses stylesheet rules.
 */
function fixUnsupportedColorsInDoc(clonedDoc: Document) {
  // 1. Process all <style> elements
  const styleElements = clonedDoc.querySelectorAll('style');
  styleElements.forEach((styleEl) => {
    if (styleEl.textContent) {
      let text = styleEl.textContent;
      if (text.includes('oklab') || text.includes('oklch') || text.includes('color-mix')) {
        text = replaceColorFunc(text, 'color-mix');
        text = replaceColorFunc(text, 'oklab');
        text = replaceColorFunc(text, 'oklch');
        styleEl.textContent = text;
      }
    }
  });

  // 2. Process stylesheet cssRules
  try {
    Array.from(clonedDoc.styleSheets).forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach((rule, ruleIdx) => {
          if (
            rule.cssText &&
            (rule.cssText.includes('oklab') ||
              rule.cssText.includes('oklch') ||
              rule.cssText.includes('color-mix'))
          ) {
            const newCssText = replaceColorFunc(
              replaceColorFunc(
                replaceColorFunc(rule.cssText, 'color-mix'),
                'oklab'
              ),
              'oklch'
            );
            sheet.deleteRule(ruleIdx);
            sheet.insertRule(newCssText, ruleIdx);
          }
        });
      } catch (e) {
        // Cross-origin or read-only stylesheet ignored
      }
    });
  } catch (e) {
    // Ignore
  }

  // 3. Process inline style attributes
  const allEls = clonedDoc.querySelectorAll<HTMLElement>('*');
  allEls.forEach((el) => {
    const inlineStyle = el.getAttribute('style');
    if (
      inlineStyle &&
      (inlineStyle.includes('oklab') ||
        inlineStyle.includes('oklch') ||
        inlineStyle.includes('color-mix'))
    ) {
      let fixedStyle = inlineStyle;
      fixedStyle = replaceColorFunc(fixedStyle, 'color-mix');
      fixedStyle = replaceColorFunc(fixedStyle, 'oklab');
      fixedStyle = replaceColorFunc(fixedStyle, 'oklch');
      el.setAttribute('style', fixedStyle);
    }
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
        onclone: (clonedDoc) => {
          fixUnsupportedColorsInDoc(clonedDoc);
        },
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
        item.parent.style.display = item.parentDisplay;
        item.parent.style.visibility = item.parentVisibility;
      }
      item.el.style.display = item.elDisplay;
      item.el.style.visibility = item.elVisibility;
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
