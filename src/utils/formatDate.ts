const ordinal = (day: number): string => {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th';
  return ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[day % 10] || 'th';
};

/** "2026-10-01" → "Thursday, October 1st, 2026". Non-ISO input is returned unchanged. */
export function formatLongDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
  if (!match) return isoDate;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${weekday}, ${month} ${d}${ordinal(d)}, ${y}`;
}
