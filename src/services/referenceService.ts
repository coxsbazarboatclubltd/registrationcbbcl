/**
 * Generates unique, formatted application reference numbers.
 * Format: CBBCL-YYYY-XXXXXX (e.g. CBBCL-2026-000001)
 */
export class ReferenceService {
  private static STORAGE_KEY = 'cbbc_last_seq_no';

  public static generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    let nextSeq = 1;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > 0) {
          nextSeq = parsed + 1;
        }
      }
    } catch (e) {
      console.warn('Could not read sequence from localStorage:', e);
    }

    // Save incremented sequence
    try {
      localStorage.setItem(this.STORAGE_KEY, String(nextSeq));
    } catch (e) {
      console.warn('Could not save sequence to localStorage:', e);
    }

    // Pad sequence number to 6 digits
    const paddedSeq = String(nextSeq).padStart(6, '0');
    return `CBBCL-${year}-${paddedSeq}`;
  }
}
