import { createContext, useContext } from 'react';

/**
 * True while the pages are rendered for the printable blank form (to be
 * filled in by hand). Values the pages compute themselves — counts, totals —
 * read this to print empty instead of "0".
 */
export const BlankFormContext = createContext(false);

export const useBlankForm = (): boolean => useContext(BlankFormContext);
