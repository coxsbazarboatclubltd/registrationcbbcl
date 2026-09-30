import { get, set, del } from 'idb-keyval';
import { MemberFormData } from '../types';

/**
 * Persists the in-progress application in IndexedDB so it survives page
 * refreshes, browser crashes, power cuts and lost connections. IndexedDB is
 * used instead of localStorage because photos and uploaded documents are held
 * as data URLs and quickly exceed localStorage's ~5 MB quota — once that
 * happens localStorage writes fail and nothing (not even typed text) is saved.
 */
const DRAFT_KEY = 'cbbc_membership_draft_v2';
const LEGACY_LOCAL_STORAGE_KEY = 'cbbc_membership_form_data_v1';

export interface ApplicationDraft {
  formData: Partial<MemberFormData>;
  activeTab: number;
  savedAt: number;
}

export async function loadDraft(): Promise<ApplicationDraft | null> {
  try {
    const draft = await get<ApplicationDraft>(DRAFT_KEY);
    if (draft) return draft;
  } catch (e) {
    console.warn('Could not read saved draft:', e);
  }

  // Migrate drafts saved by earlier builds (localStorage, form data only)
  try {
    const legacy = localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
    if (legacy) return { formData: JSON.parse(legacy), activeTab: 1, savedAt: 0 };
  } catch (e) {
    console.warn('Could not read legacy draft:', e);
  }
  return null;
}

export async function saveDraft(draft: ApplicationDraft): Promise<void> {
  await set(DRAFT_KEY, draft);
  try {
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
  } catch {
    // ignore — legacy cleanup only
  }
}

export async function clearDraft(): Promise<void> {
  try {
    await del(DRAFT_KEY);
  } catch (e) {
    console.warn('Could not clear saved draft:', e);
  }
  try {
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Asks the browser not to evict our storage under disk pressure. */
export function requestPersistentStorage(): void {
  navigator.storage?.persist?.().catch(() => undefined);
}
