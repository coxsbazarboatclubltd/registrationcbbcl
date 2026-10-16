import { PDFDocument, PDFFont, PDFPage, StandardFonts, degrees, rgb } from 'pdf-lib';
import { MemberFormData, UploadedDocumentMeta } from '../types';
import { CHECKLIST_ITEMS, uploadSlots } from './documentChecklist';

/**
 * Supporting-document uploads (Form F checklist) and how they are appended to
 * the application PDF — one A4 page per image, one A4 page per page of an
 * uploaded PDF, each with a small identifying header.
 *
 * Budget: the submitted PDF travels to the server inside a JSON body, and
 * Vercel caps request bodies at 4.5 MB. The seven form pages are ~1.1 MB, and
 * base64 adds a third, so attachments must stay within ~2 MB in total.
 */
export const MAX_TOTAL_ATTACHMENT_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_ATTACHMENT_TYPES = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';

// Images are normalised to ~200 dpi on A4 — sharp in print, small on upload.
const MAX_IMAGE_EDGE_PX = 2000;
const IMAGE_QUALITY = 0.82;

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 28;
const HEADER_H = 34;
const FOOTER_H = 18;
const NAVY = rgb(0.102, 0.153, 0.267);
const GOLD = rgb(0.616, 0.498, 0.275);
const GREY = rgb(0.42, 0.42, 0.42);

export const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 KB';
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

/** Largest PDF (as a base64 data URI) that fits in Vercel's 4.5 MB request body with the form data. */
export const MAX_SUBMISSION_PDF_DATA_URI_CHARS = 4_200_000;

const dataUrlBytes = (dataUrl: string): number => {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.floor((base64.length * 3) / 4);
};

const readAsDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error || new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('This image could not be opened.'));
    img.src = src;
  });

/** Total stored size of all uploaded documents. */
export function attachmentBytesUsed(uploadedDocs: Record<string, UploadedDocumentMeta> | undefined): number {
  return Object.values(uploadedDocs || {}).reduce(
    (sum, doc) => sum + (doc.byteSize ?? (doc.fileDataUrl ? dataUrlBytes(doc.fileDataUrl) : 0)),
    0
  );
}

/**
 * Reads an uploaded file into storable form. Images are downscaled and
 * re-encoded as JPEG; PDFs are kept as-is (and validated as readable).
 */
export async function prepareAttachment(file: File): Promise<UploadedDocumentMeta> {
  const name = file.name.toLowerCase();
  const isPdf = file.type === 'application/pdf' || name.endsWith('.pdf');
  const isImage = /^image\/(jpeg|png)$/.test(file.type) || /\.(jpe?g|png)$/.test(name);
  if (!isPdf && !isImage) throw new Error('Please upload a PDF, JPG or PNG file.');

  let fileDataUrl: string;
  let fileType: string;
  if (isPdf) {
    fileDataUrl = await readAsDataUrl(file);
    fileType = 'application/pdf';
    try {
      await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    } catch {
      throw new Error('This PDF could not be read. Please upload an unprotected PDF or an image.');
    }
  } else {
    const img = await loadImage(await readAsDataUrl(file));
    const scale = Math.min(1, MAX_IMAGE_EDGE_PX / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This image could not be processed.');
    ctx.fillStyle = '#ffffff'; // flatten PNG transparency onto white paper
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    fileDataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
    fileType = 'image/jpeg';
  }

  const byteSize = dataUrlBytes(fileDataUrl);
  return {
    fileName: file.name,
    fileSize: formatBytes(byteSize),
    fileType,
    fileDataUrl,
    byteSize,
    uploadedAt: new Date().toISOString().split('T')[0],
  };
}

// Standard PDF fonts only cover Latin-1; drop anything else rather than fail.
const latin1 = (text: string): string => text.replace(/[^\x20-\x7E -ÿ]/g, '').trim();

const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

interface PageChrome {
  title: string;
  subtitle: string;
  bold: PDFFont;
  regular: PDFFont;
}

/** Adds an A4 page with the attachment header/footer; returns the content box. */
function addAttachmentPage(doc: PDFDocument, chrome: PageChrome) {
  const page = doc.addPage(A4);
  const [w, h] = A4;
  page.drawText(latin1(chrome.title), { x: MARGIN, y: h - MARGIN - 10, size: 9.5, font: chrome.bold, color: NAVY });
  page.drawText(latin1(chrome.subtitle), { x: MARGIN, y: h - MARGIN - 23, size: 7.5, font: chrome.regular, color: GREY });
  page.drawLine({
    start: { x: MARGIN, y: h - MARGIN - HEADER_H + 4 },
    end: { x: w - MARGIN, y: h - MARGIN - HEADER_H + 4 },
    thickness: 1,
    color: GOLD,
  });
  page.drawText("COX'S BAZAR BOAT CLUB LTD.  ·  Official Registration Form  ·  Supporting Document", {
    x: MARGIN,
    y: MARGIN - 10,
    size: 6.5,
    font: chrome.regular,
    color: GREY,
  });
  const box = {
    x: MARGIN,
    y: MARGIN + FOOTER_H - 10,
    width: w - MARGIN * 2,
    height: h - MARGIN * 2 - HEADER_H - FOOTER_H + 10,
  };
  return { page, box };
}

/**
 * Places content of (unrotated) size width×height into the box, turned
 * counter-clockwise by `angle` (0/90/180/270), scaled to fit and centred.
 * Returns pdf-lib draw options (pdf-lib rotates around the x/y anchor).
 */
function placeRotated(
  box: { x: number; y: number; width: number; height: number },
  width: number,
  height: number,
  angle: number
) {
  const quarter = ((angle % 360) + 360) % 360;
  const sideways = quarter === 90 || quarter === 270;
  const outW = sideways ? height : width;
  const outH = sideways ? width : height;
  const scale = Math.min(box.width / outW, box.height / outH);
  const w = width * scale;
  const h = height * scale;
  const left = box.x + (box.width - outW * scale) / 2;
  const bottom = box.y + (box.height - outH * scale) / 2;
  const anchor =
    quarter === 90 ? { x: left + h, y: bottom } :
    quarter === 180 ? { x: left + w, y: bottom + h } :
    quarter === 270 ? { x: left, y: bottom + w } :
    { x: left, y: bottom };
  return { ...anchor, width: w, height: h, rotate: degrees(quarter) };
}

// Landscape documents are turned 90° counter-clockwise (top towards the left
// edge) so every printed page stays portrait A4 and the document fills it.
const LANDSCAPE_TURN = 90;

function fitInto(box: { x: number; y: number; width: number; height: number }, width: number, height: number) {
  const scale = Math.min(box.width / width, box.height / height);
  const w = width * scale;
  const h = height * scale;
  return { x: box.x + (box.width - w) / 2, y: box.y + (box.height - h) / 2, width: w, height: h };
}

function drawNotice(page: PDFPage, box: { x: number; y: number; height: number }, font: PDFFont, message: string) {
  page.drawText(latin1(message), { x: box.x, y: box.y + box.height - 20, size: 10, font, color: NAVY, maxWidth: 520 });
}

interface AttachmentFile {
  side: '' | 'Front' | 'Back';
  doc: UploadedDocumentMeta;
}

/** Documents with at least one uploaded file, in checklist order (two-sided ones grouped). */
export function uploadedAttachments(data: MemberFormData) {
  const docs = data.uploadedDocs || {};
  return CHECKLIST_ITEMS.map((item) => ({
    item,
    files: uploadSlots(item)
      .map((slot) => ({ side: slot.side, doc: docs[slot.key] }))
      .filter((f): f is AttachmentFile => !!f.doc?.fileDataUrl),
  })).filter((entry) => entry.files.length > 0);
}

/**
 * Returns the application PDF with every uploaded document appended as A4
 * pages. Returns the input unchanged when nothing has been uploaded.
 */
export async function appendAttachmentsToPdf(basePdf: Blob, data: MemberFormData, refNo: string): Promise<Blob> {
  const attachments = uploadedAttachments(data);
  if (attachments.length === 0) return basePdf;

  const doc = await PDFDocument.load(await basePdf.arrayBuffer());
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const who = [data.candidateName, refNo.trim()].filter(Boolean).join('  ·  ');

  const embedOne = async (file: UploadedDocumentMeta, title: string, subtitle: string) => {
    const bytes = dataUrlToBytes(file.fileDataUrl!);
    try {
      if (file.fileType === 'application/pdf') {
        const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const embedded = await doc.embedPdf(source, source.getPageIndices());
        embedded.forEach((srcPage, p) => {
          // Honour the page's own /Rotate (clockwise) the way PDF viewers show it
          const stored = ((source.getPage(p).getRotation().angle % 360) + 360) % 360;
          const shownW = stored % 180 === 0 ? srcPage.width : srcPage.height;
          const shownH = stored % 180 === 0 ? srcPage.height : srcPage.width;
          const landscape = shownW > shownH;
          const angle = (landscape ? LANDSCAPE_TURN : 0) - stored;
          const pageTitle =
            (embedded.length > 1 ? `${title}  (PAGE ${p + 1} OF ${embedded.length})` : title) +
            (landscape ? '  ·  ROTATED TO FIT' : '');
          const { page, box } = addAttachmentPage(doc, { title: pageTitle, subtitle, bold, regular });
          page.drawPage(srcPage, placeRotated(box, srcPage.width, srcPage.height, angle));
        });
      } else {
        const image = file.fileType === 'image/png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const landscape = image.width > image.height;
        const pageTitle = title + (landscape ? '  ·  ROTATED TO FIT' : '');
        const { page, box } = addAttachmentPage(doc, { title: pageTitle, subtitle, bold, regular });
        page.drawImage(image, placeRotated(box, image.width, image.height, landscape ? LANDSCAPE_TURN : 0));
      }
    } catch (err) {
      console.warn(`Could not embed attachment "${file.fileName}":`, err);
      const { page, box } = addAttachmentPage(doc, { title, subtitle, bold, regular });
      drawNotice(page, box, regular, `This file could not be embedded (${file.fileName}). Please provide a printed copy.`);
    }
  };

  for (let i = 0; i < attachments.length; i++) {
    const { item, files } = attachments[i];
    const base = `ATTACHMENT ${i + 1} OF ${attachments.length}  ·  ${item.name.toUpperCase()}`;
    const bothImages = files.length === 2 && files.every((f) => f.doc.fileType !== 'application/pdf');

    if (bothImages) {
      // Front and back of an ID card on one A4 page, like a photocopy
      try {
        const subtitle = [files.map((f) => f.doc.fileName).join(' + '), who].filter(Boolean).join('  ·  ');
        const { page, box } = addAttachmentPage(doc, { title: `${base}  (FRONT & BACK)`, subtitle, bold, regular });
        const gap = 18;
        const half = (box.height - gap) / 2;
        for (let s = 0; s < 2; s++) {
          const file = files[s].doc;
          const bytes = dataUrlToBytes(file.fileDataUrl!);
          const image = file.fileType === 'image/png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
          const area = { x: box.x, y: box.y + (s === 0 ? half + gap : 0), width: box.width, height: half - 12 };
          page.drawText(files[s].side.toUpperCase() + ' SIDE', {
            x: area.x,
            y: area.y + area.height + 2,
            size: 7.5,
            font: bold,
            color: GREY,
          });
          page.drawImage(image, fitInto(area, image.width, image.height));
        }
        continue;
      } catch (err) {
        console.warn('Could not combine front/back sides, adding them separately:', err);
      }
    }

    for (const f of files) {
      const title = f.side ? `${base}  (${f.side.toUpperCase()} SIDE)` : base;
      await embedOne(f.doc, title, [f.doc.fileName, who].filter(Boolean).join('  ·  '));
    }
  }

  const out = await doc.save();
  return new Blob([out], { type: 'application/pdf' });
}
