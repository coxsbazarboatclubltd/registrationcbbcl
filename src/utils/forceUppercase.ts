/**
 * Forces every free-text field in the application to CAPITAL LETTERS.
 *
 * Runs as a document-level capture listener so it rewrites the input's value
 * before React's onChange reads it — covers typing, pasting and autofill in
 * every form component without touching each one. Email, phone, date and other
 * non-text inputs are left untouched, as are <select> dropdowns (their option
 * values must stay exact).
 */
function isUppercaseTarget(el: EventTarget | null): el is HTMLInputElement | HTMLTextAreaElement {
  if (el instanceof HTMLTextAreaElement) return !el.readOnly;
  if (el instanceof HTMLInputElement) return el.type === 'text' && !el.readOnly;
  return false;
}

function handleInput(e: Event) {
  const el = e.target;
  if ((e as InputEvent).isComposing || !isUppercaseTarget(el)) return;

  const upper = el.value.toUpperCase();
  if (upper === el.value) return;

  const { selectionStart, selectionEnd } = el;
  el.value = upper;
  if (selectionStart !== null && selectionEnd !== null) {
    el.setSelectionRange(selectionStart, selectionEnd);
  }
}

export function installUppercaseInputs(): () => void {
  document.addEventListener('input', handleInput, true);
  return () => document.removeEventListener('input', handleInput, true);
}
