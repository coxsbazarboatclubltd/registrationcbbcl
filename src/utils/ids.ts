/**
 * Application identifiers.
 *
 * There is no shared database to hand out sequential numbers, and the old
 * per-browser counter gave every first-time applicant CBBCL-2026-000001.
 * Numbers are now built from the date plus a cryptographically random code
 * (Crockford-style alphabet, no 0/O/1/I/L), assigned when the form is
 * submitted: 32^5 ≈ 33.5 million registration codes per day.
 */
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

function randomCode(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

const pad = (n: number) => String(n).padStart(2, '0');

/** e.g. CBBCL-2026-1019-7K3QX */
export function generateRegistrationNumber(date = new Date()): string {
  return `CBBCL-${date.getFullYear()}-${pad(date.getMonth() + 1)}${pad(date.getDate())}-${randomCode(5)}`;
}

/** e.g. CBBCL-DOC-20261019-4HXQ9M */
export function generateDocumentNumber(date = new Date()): string {
  return `CBBCL-DOC-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${randomCode(6)}`;
}

/** Shown in the page headers until the form has been submitted. */
export const REGISTRATION_NUMBER_PENDING = 'Assigned on submission';
