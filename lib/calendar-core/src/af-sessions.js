// ── af-sessions.js ──
// Alliance Française Paris session calendar generator.
// Confirmed pattern (from alliancefr.org, Sep 2026 – Dec 2026):
//   Intensive (72h/4wk, Mon–Fri 09:00-13:00): Mon-start, Fri-end 4-week blocks, €1,460/session.
//   Semi-int. (36h/4wk, Mon/Tue/Thu 13:30-16:30): Mon-start, Thu-end 4-week blocks, €730/session.
//   Ladders: intensive A1.1→B2.3 (9 sub-levels); semi A1.1-A1.3, A2.1-A2.4, B1.1-B1.4, B2.1-B2.6 (17 sub-levels).
// Winter break: AF closed ~18 Dec – 3 Jan. French holidays shift session starts (Easter Mon, etc.).
import { addDays, MON, FRI, THU } from './time.js';

export const AF = {
  intensive: { price: 1460, hoursPerWeek: 18, startDow: MON, endDow: FRI },
  semi: { price: 730, hoursPerWeek: 9, startDow: MON, endDow: THU },
  // Confirmed 2026 anchors (from alliancefr.org course pages, checked 3 Oct 2026)
  anchors: {
    intensive: [
      { start: '2026-10-26', end: '2026-11-20' },
      { start: '2026-11-23', end: '2026-12-18' },
    ],
    semi: [
      { start: '2026-10-26', end: '2026-11-19' },
      { start: '2026-11-23', end: '2026-12-17' },
    ],
  },
  winterBreak: { from: '2026-12-19', to: '2027-01-03' }, // resumes Mon 4 Jan
  holidays: [ // French statutory holidays that close AF Paris (dates each year)
    '2027-03-29', // Easter Monday
    '2027-05-01', '2027-05-06', '2027-05-08', '2027-05-17', // Labour, Ascension, VE, Whit Monday
    '2027-07-14', '2027-08-15', '2027-11-01', '2027-11-11',
  ],
};

// Next Monday strictly after `date` (or same day if Monday)
export function nextMonday(date) {
  const d = new Date(date);
  const delta = (MON - d.getUTCDay() + 7) % 7;
  return addDays(d, delta === 0 ? 0 : delta);
}

// Walk the 4-week session grid forward from a start date, honouring winter break + holiday nudges.
// Returns [{start, end, label?}] — end computed from format (Fri for intensive, Thu for semi),
// start nudged +1 day when it lands on a French statutory holiday.
export function sessionGrid({ from, count, format = 'intensive' }) {
  const cfg = AF[format];
  const sessions = [];
  let cursor = nextMonday(from);
  for (let i = 0; i < count; i++) {
    // winter break: push to resume Monday
    const wb = AF.winterBreak;
    if (cursor >= new Date(wb.from) && cursor <= new Date(wb.to)) {
      cursor = nextMonday(winterBreakEnd(wb));
    }
    // holiday nudge: Monday-on-a-holiday → Tuesday
    if (AF.holidays.includes(iso(cursor))) cursor = addDays(cursor, 1);
    const end = endOfSession(cursor, cfg.endDow);
    sessions.push({ start: iso(cursor), end: iso(end), format });
    cursor = nextMonday(addDays(end, 1));
  }
  return sessions;
}

function winterBreakEnd(wb) { return new Date(wb.to); }

function endOfSession(start, endDow) {
  // 4 calendar weeks: find the last occurrence of endDow within start..start+27d
  for (let off = 27; off >= 0; off--) {
    const d = addDays(start, off);
    if (d.getUTCDay() === endDow) return d;
  }
  return addDays(start, 25);
}

export function iso(d) { return d.toISOString().slice(0, 10); }

// Named sub-level ladders
export const LADDERS = {
  intensive: ['A1.1', 'A1.2', 'A2.1', 'A2.2', 'B1.1', 'B1.2', 'B2.1', 'B2.2', 'B2.3'],
  semi: ['A1.1', 'A1.2', 'A1.3', 'A2.1', 'A2.2', 'A2.3', 'A2.4', 'B1.1', 'B1.2', 'B1.3', 'B1.4', 'B2.1', 'B2.2', 'B2.3', 'B2.4', 'B2.5', 'B2.6'],
};

// Build a full study plan: sub-levels with exact session dates.
// plan = { from, levels: n, format, skip?: n } — skip lets you start mid-ladder.
export function buildPlan({ from, levels, format, skip = 0 }) {
  const ladder = LADDERS[format].slice(skip, skip + levels);
  const grid = sessionGrid({ from, count: levels, format });
  return grid.map((s, i) => ({ level: ladder[i], ...s, price: AF[format].price }));
}

// Free slots BETWEEN sessions (gaps ≥ minDays), useful for vacation placement.
export function gapsBetween(sessions, minDays = 3) {
  const out = [];
  for (let i = 1; i < sessions.length; i++) {
    const prev = new Date(sessions[i - 1].end);
    const next = new Date(sessions[i].start);
    const gapDays = Math.round((next - prev) / 86400000) - 1;
    if (gapDays >= minDays) {
      out.push({ from: iso(addDays(prev, 1)), to: iso(addDays(next, -1)), days: gapDays });
    }
  }
  return out;
}
