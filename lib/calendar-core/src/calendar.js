// ── calendar.js ──
// Systematic slot calendar: recurring obligations + planned-ahead events → busy intervals,
// then free-slot finder + suggester for low-priority items and vacations.
import { addDays, iso, parse, diffDays, frenchHolidays, MON, TUE, WED, THU, FRI, SAT, SUN } from './time.js';

// ── Recurring weekly obligations (Phuc's standing rules) ──
// From standing schedule: work 7h/d, gym W/F/Sa/Su, sleep 22:30-06:00 (not a calendar block),
// AF intensive classes Mon-Fri mornings (when enrolled), TickTick-captured appts.
export const DEFAULT_OBLIGATIONS = [
  { id: 'work', label: 'Work (7h)', kind: 'recurring', days: [MON, TUE, WED, THU, FRI], start: '09:30', end: '17:30', priority: 1 },
  { id: 'gym', label: 'Gym', kind: 'recurring', days: [WED, FRI, SAT, SUN], start: '18:30', end: '19:45', priority: 2 },
];

// AF class as a planned-ahead event source (from af-sessions.buildPlan)
export function afClassEvents(plan, { hours = { start: '09:00', end: '13:00' } } = {}) {
  return plan.map(s => ({
    id: `af-${s.level}`,
    label: `AF ${s.level}`,
    kind: 'planned',
    from: s.start,
    to: s.end,
    days: [MON, TUE, WED, THU, FRI],
    start: hours.start,
    end: hours.end,
    priority: 1,
  }));
}

// ── Busy expansion: turn events into concrete date-ranges within a window ──
export function expandBusy(events, windowStart, windowEnd) {
  const ws = parse(windowStart), we = parse(windowEnd);
  const busy = [];
  for (const ev of events) {
    if (ev.kind === 'recurring') {
      for (let d = new Date(ws); d <= we; d = addDays(d, 1)) {
        if (ev.days.includes(d.getUTCDay())) {
          busy.push({ ...ev, date: iso(d) });
        }
      }
    } else { // planned: date-range + days-of-week
      const from = parse(ev.from <= windowStart ? windowStart : ev.from);
      const to = parse(ev.to >= windowEnd ? windowEnd : ev.to);
      for (let d = new Date(Math.max(from, ws)); d <= Math.min(to, we); d = addDays(d, 1)) {
        if (!ev.days || ev.days.includes(d.getUTCDay())) {
          busy.push({ ...ev, date: iso(d) });
        }
      }
    }
  }
  return busy;
}

// ── Free-slot finder ──
// events: mixed list. window: {from, to}. slot: {start, end} time-of-day, minHours.
// Returns list of {date, start, end, hours} where nothing with priority ≤ maxPriority occupies.
export function findFreeSlots({ events, from, to, start = '09:00', end = '22:00', minHours = 2, maxPriority = 2, includeWeekends = true }) {
  const busy = expandBusy(events, from, to);
  const byDate = new Map();
  for (const b of busy) {
    if (b.priority > maxPriority) continue;
    if (!byDate.has(b.date)) byDate.set(b.date, []);
    byDate.get(b.date).push(b);
  }
  const free = [];
  for (let d = parse(from); d <= parse(to); d = addDays(d, 1)) {
    const dow = d.getUTCDay();
    if (!includeWeekends && (dow === SAT || dow === SUN)) continue;
    const date = iso(d);
    const dayBusy = (byDate.get(date) || [])
      .map(b => [toMin(b.start ?? '00:00'), toMin(b.end ?? '23:59')])
      .sort((a, b) => a[0] - b[0]);
    // merge busy intervals, then invert
    const merged = [];
    for (const [s, e] of dayBusy) {
      if (merged.length && s <= merged[merged.length - 1][1]) {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
      } else merged.push([s, e]);
    }
    let cursor = toMin(start);
    const dayEnd = toMin(end);
    for (const [s, e] of merged) {
      if (s - cursor >= minHours * 60) {
        free.push({ date, start: fromMin(cursor), end: fromMin(s), hours: (s - cursor) / 60 });
      }
      cursor = Math.max(cursor, e);
    }
    if (dayEnd - cursor >= minHours * 60) {
      free.push({ date, start: fromMin(cursor), end: fromMin(dayEnd), hours: (dayEnd - cursor) / 60 });
    }
  }
  return free;
}

// ── Suggester: place low-priority tasks / vacations into free capacity ──
// items: [{id, label, hours, priority, deadline?}] — packed into earliest free slots (deadline-aware).
export function suggest({ free, items }) {
  const slots = free.map(f => ({ ...f, remaining: f.hours }));
  const placements = [];
  const sorted = [...items].sort((a, b) =>
    (a.deadline ?? '9999-12-31').localeCompare(b.deadline ?? '9999-12-31') || b.priority - a.priority);
  for (const item of sorted) {
    let need = item.hours;
    const placed = [];
    for (const slot of slots) {
      if (need <= 0) break;
      if (slot.remaining <= 0) continue;
      const take = Math.min(need, slot.remaining);
      placed.push({ date: slot.date, start: fromMin(toMin(slot.end) - take * 60), hours: take });
      slot.remaining -= take;
      need -= take;
    }
    placements.push({
      id: item.id, label: item.label,
      fits: need <= 0,
      shortfallHours: Math.max(0, need),
      placements: placed,
    });
  }
  return placements;
}

// ── Vacation finder: longest contiguous free day-runs in a window ──
// A day is "free" when zero priority-1 obligations (work/AF/exams) touch it.
export function findVacationWindows({ events, from, to, minDays = 4 }) {
  const busy = expandBusy(events.filter(e => e.priority === 1), from, to);
  const busyDates = new Set(busy.map(b => b.date));
  const runs = [];
  let run = null;
  for (let d = parse(from); d <= parse(to); d = addDays(d, 1)) {
    const date = iso(d);
    if (!busyDates.has(date)) {
      if (!run) run = { from: date, days: 0 };
      run.days++;
      run.to = date;
    } else if (run) { runs.push(run); run = null; }
  }
  if (run) runs.push(run);
  return runs.filter(r => r.days >= minDays).sort((a, b) => b.days - a.days);
}

function toMin(hhmm) { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; }
function fromMin(min) { return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`; }
