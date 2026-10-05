import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { buildPlan, sessionGrid, gapsBetween, nextMonday, LADDERS } from '../src/af-sessions.js';
import { dedupeGaps } from '../src/af-sessions-extra.js';
import { frenchHolidays, diffDays } from '../src/time.js';
import { DEFAULT_OBLIGATIONS, afClassEvents, findFreeSlots, suggest, findVacationWindows, expandBusy } from '../src/calendar.js';

test('nextMonday', () => {
  assert.equal(nextMonday('2026-10-03').toISOString().slice(0, 10), '2026-10-05'); // Sat → Mon
  assert.equal(nextMonday('2026-10-05').toISOString().slice(0, 10), '2026-10-05'); // Mon stays
});

test('intensive ladder: 9 levels, Mon-start Fri-end, winter break honoured', () => {
  const plan = buildPlan({ from: '2026-09-28', levels: 9, format: 'intensive' });
  assert.equal(plan.length, 9);
  assert.equal(plan[0].level, 'A1.1');
  assert.equal(plan.at(-1).level, 'B2.3');
  assert.equal(plan[1].start, '2026-10-26');
  assert.equal(plan[1].end, '2026-11-20');
  assert.equal(plan[2].start, '2026-11-23');
  assert.equal(plan[2].end, '2026-12-18');
  assert.equal(plan[3].start, '2027-01-04');
  for (const s of plan) {
    const sd = new Date(s.start + 'T00:00:00Z').getUTCDay();
    const ed = new Date(s.end + 'T00:00:00Z').getUTCDay();
    if (s.level === 'B2.1') {
      assert.equal(sd, 2, 'B2.1 starts Tue (Easter Monday 29 Mar closed)');
    } else {
      assert.equal(sd, 1, `${s.level} starts Mon`);
    }
    assert.equal(ed, 5, `${s.level} ends Fri`);
  }
});

test('semi ladder skip=3 starts at A2.1, Thu ends, matches published session', () => {
  const plan = buildPlan({ from: '2026-11-23', levels: 14, format: 'semi', skip: 3 });
  assert.equal(plan[0].level, 'A2.1');
  assert.equal(plan[0].start, '2026-11-23');
  assert.equal(plan[0].end, '2026-12-17'); // AF published: 23 Nov → 17 Dec
  assert.equal(plan.at(-1).level, 'B2.6');
  for (const s of plan) {
    assert.equal(new Date(s.end + 'T00:00:00Z').getUTCDay(), 4, `${s.level} ends Thu`);
  }
});

test('frenchHolidays includes computed Easter Monday 2027-03-29', () => {
  const h = frenchHolidays(2027);
  assert.ok(h.includes('2027-03-29'));
  assert.ok(h.includes('2027-05-06')); // Ascension
});

test('free slots: AF class mornings + work leave expected gaps', () => {
  const intensive = buildPlan({ from: '2026-09-28', levels: 2, format: 'intensive' });
  const events = [...DEFAULT_OBLIGATIONS, ...afClassEvents(intensive)];
  const free = findFreeSlots({ events, from: '2026-09-30', to: '2026-09-30', start: '08:00', end: '22:00', minHours: 1 });
  const spans = free.map(f => `${f.start}-${f.end}`);
  assert.ok(spans.includes('08:00-09:00'), spans.join()); // AF 09:00 class merges with 09:30 work
  assert.ok(spans.includes('17:30-18:30'), spans.join());
  assert.ok(spans.includes('19:45-22:00'), spans.join());
});

test('suggest packs deadline-first and reports shortfall', () => {
  const free = [
    { date: '2027-02-01', start: '18:00', end: '20:00', hours: 2 },
    { date: '2027-02-02', start: '18:00', end: '20:00', hours: 2 },
  ];
  const out = suggest({ free, items: [
    { id: 'a', label: 'A (deadline first)', hours: 3, deadline: '2027-02-02' },
    { id: 'b', label: 'B too big', hours: 5 },
  ]});
  assert.equal(out[0].fits, true);
  assert.equal(out[1].fits, false);
  assert.equal(out[1].shortfallHours, 4); // 1h left in slot 2 after A took 3 of 4 total
});

test('vacation windows: weekend run during winter break', () => {
  const semi = buildPlan({ from: '2026-11-23', levels: 2, format: 'semi' });
  const events = [...DEFAULT_OBLIGATIONS, ...afClassEvents(semi, { hours: { start: '13:30', end: '16:30' } })];
  const vac = findVacationWindows({ events, from: '2026-12-21', to: '2026-12-27', minDays: 2 });
  assert.ok(vac.length >= 1, JSON.stringify(vac));
  assert.equal(vac[0].days, 2); // Sat + Sun (work occupies Mon-Fri as priority 1)
});

test('gapsBetween + dedupeGaps dedupes winter-break overlap', () => {
  const a = buildPlan({ from: '2026-09-28', levels: 3, format: 'intensive' });
  const b = buildPlan({ from: '2026-11-23', levels: 2, format: 'semi' });
  const gaps = dedupeGaps([...gapsBetween(a, 3), ...gapsBetween(b, 3)]);
  const keys = new Set(gaps.map(g => g.from + g.to));
  assert.equal(keys.size, gaps.length);
  assert.ok(gaps.some(g => g.from === '2026-12-19' || g.from === '2026-12-18'));
});
