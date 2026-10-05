// ── example.js ── end-to-end demo: AF plan → free slots → suggest low-priority + vacation
import { buildPlan, gapsBetween } from './af-sessions.js';
import { DEFAULT_OBLIGATIONS, afClassEvents, findFreeSlots, suggest, findVacationWindows } from './calendar.js';

// 1) Phuc's plan of record: A1+A2 intensive (skip 0, 4 levels from 28 Sep 2026), then semi B1→B2.
//    (A1.1 already in progress; start the plan generator at his real A1.1 date.)
const intensivePlan = buildPlan({ from: '2026-09-28', levels: 4, format: 'intensive' });
const semiPlan = buildPlan({ from: '2026-11-23', levels: 14, format: 'semi', skip: 3 }); // A2.1→B2.6 (14)

console.log('── Intensive A1.1–A2.2 ──');
for (const s of intensivePlan) console.log(`  ${s.level}: ${s.start} → ${s.end}  (€${s.price})`);
console.log('── Semi A2.1–B2.6 ──');
for (const s of semiPlan.slice(0, 4)) console.log(`  ${s.level}: ${s.start} → ${s.end}  (€${s.price})`);
console.log(`  … ${semiPlan.length} semi sessions total, last: ${semiPlan.at(-1).level} ${semiPlan.at(-1).start} → ${semiPlan.at(-1).end}`);

// 2) Busy model: work + gym + AF classes
const events = [
  ...DEFAULT_OBLIGATIONS,
  ...afClassEvents(intensivePlan),          // Mon-Fri 09:00-13:00 during intensive sessions
  ...afClassEvents(semiPlan, { hours: { start: '13:30', end: '16:30' } }),
];
// Add a planned-ahead low-priority thing + deadline task
events.push({ id: 'permit-appt', label: 'Residence permit RDV', kind: 'planned', from: '2027-05-10', to: '2027-05-10', days: [1,2,3,4,5], start: '10:00', end: '12:00', priority: 1 });

// 3) Free slots in a target week (after A1.2, semi era)
const free = findFreeSlots({
  events,
  from: '2027-02-01', to: '2027-02-07',     // A2.3 semi session week
  start: '08:00', end: '22:00', minHours: 2,
});
console.log('\n── Free slots (week of 1 Feb 2027) ──');
for (const f of free) console.log(`  ${f.date}  ${f.start}–${f.end}  (${f.hours}h)`);

// 4) Suggest low-priority items into that capacity
const placements = suggest({
  free,
  items: [
    { id: 'flashcards', label: 'Physics flashcards backlog', hours: 6, priority: 3 },
    { id: 'paperwork', label: 'Tax paperwork tidy', hours: 2, priority: 3, deadline: '2027-02-07' },
  ],
});
console.log('\n── Suggested placements ──');
for (const p of placements) console.log(`  ${p.label}: fits=${p.fits}`, p.placements.map(x => `${x.date} ${x.start} (${x.hours}h)`).join(', '));

// 5) Vacation windows: no priority-1 stuff at all
const vac = findVacationWindows({ events, from: '2027-06-28', to: '2027-08-31', minDays: 4 });
console.log('\n── Vacation windows (Jul-Aug 2027, ≥4 free days) ──');
for (const v of vac.slice(0, 5)) console.log(`  ${v.from} → ${v.to}  (${v.days} days)`);

// 6) Natural gaps between AF sessions (another vacation signal)
const all = [...intensivePlan, ...semiPlan];
console.log('\n── Gaps between AF sessions (≥3 days) ──');
for (const g of gapsBetween(all, 3)) console.log(`  ${g.from} → ${g.to}  (${g.days}d)`);
