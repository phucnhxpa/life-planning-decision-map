// ── time.js ── minimal date helpers (UTC-safe, no deps)
export const MON = 1, TUE = 2, WED = 3, THU = 4, FRI = 5, SAT = 6, SUN = 0;

export function addDays(d, n) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
export function iso(d) { return d.toISOString().slice(0, 10); }
export function parse(s) { return new Date(s + 'T00:00:00Z'); }
export function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }

// French statutory holidays (fixed + computed Easter-based) for any year
export function frenchHolidays(year) {
  const easter = gaussEaster(year);
  const easterMon = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const whitMon = addDays(easter, 50);
  return [
    `${year}-01-01`, iso(easterMon), `${year}-05-01`, `${year}-05-08`,
    iso(ascension), iso(whitMon), `${year}-07-14`, `${year}-08-15`,
    `${year}-11-01`, `${year}-11-11`, `${year}-12-25`,
  ];
}
function gaussEaster(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}
