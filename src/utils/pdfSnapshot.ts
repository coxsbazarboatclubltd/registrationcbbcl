/**
 * Builds a self-contained HTML document of the seven printable form pages,
 * with every field's current value baked into the markup, for the server to
 * print to a vector PDF (api/_lib/renderPdf.js).
 */
const PAGE_IDS = [1, 2, 3, 4, 5, 6, 7].map((n) => `form-${n}-page`);

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';

// One A4 sheet per .page, no browser margins, no on-screen scaling/shadows.
const PRINT_CSS = `
@page { size: A4; margin: 0; }
html, body { margin: 0; padding: 0; background: #ffffff; }
.page {
  transform: none !important;
  margin: 0 !important;
  box-shadow: none !important;
  height: 297mm !important;
  overflow: hidden !important;
  break-after: page;
  page-break-after: always;
}
.page:last-child { break-after: auto; page-break-after: auto; }
/* Paper copy: show values only — no dropdown arrows or date-picker icons */
select {
  -webkit-appearance: none !important;
  appearance: none !important;
  background-image: none !important;
}
input[type="date"]::-webkit-calendar-picker-indicator { display: none !important; }
`;

function collectStyles(): string {
  const parts: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      parts.push(Array.from(sheet.cssRules).map((rule) => rule.cssText).join('\n'));
    } catch {
      // Cross-origin sheet (e.g. Google Fonts) — loaded via the <link> below instead
    }
  }
  return parts.join('\n');
}

/** Copies live form state (which lives in DOM properties, not attributes) into the clone's markup. */
function bakeFormValues(original: HTMLElement, clone: HTMLElement): void {
  const src = original.querySelectorAll('input, select, textarea');
  const dst = clone.querySelectorAll('input, select, textarea');
  src.forEach((el, i) => {
    const target = dst[i];
    if (!target) return;
    if (el instanceof HTMLInputElement && target instanceof HTMLInputElement) {
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked) target.setAttribute('checked', '');
        else target.removeAttribute('checked');
      } else if (el.type === 'file') {
        target.remove();
      } else {
        target.setAttribute('value', el.value);
      }
      // Hint text would read like an answer on paper; empty fields print blank
      target.removeAttribute('placeholder');
    } else if (el instanceof HTMLSelectElement && target instanceof HTMLSelectElement) {
      Array.from(target.options).forEach((opt, j) => {
        if (j === el.selectedIndex) opt.setAttribute('selected', '');
        else opt.removeAttribute('selected');
      });
    } else if (el instanceof HTMLTextAreaElement && target instanceof HTMLTextAreaElement) {
      target.textContent = el.value;
    }
  });
}

export function buildPrintSnapshot(): string {
  const pages: string[] = [];
  for (const id of PAGE_IDS) {
    const original = document.getElementById(id);
    if (!original) continue;
    const clone = original.cloneNode(true) as HTMLElement;
    bakeFormValues(original, clone);
    clone.classList.remove('hidden');
    clone.style.cssText = '';
    pages.push(clone.outerHTML);
  }
  if (pages.length === 0) throw new Error('Form pages were not found for PDF generation.');

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONT_LINK}">
<style>${collectStyles()}</style>
<style>${PRINT_CSS}</style>
</head>
<body>${pages.join('\n')}</body>
</html>`;
}
