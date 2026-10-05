# phuc-calendar-core

Systematic slot-based calendar engine — models recurring obligations + planned-ahead events
(AF course sessions, exams, deadlines), then finds free slots, suggests placements for
low-priority items, and locates vacation windows.

Built for integration with the Life Roadmap site (source of the French-program dates) and
future agent-driven scheduling ("what free time do I have in March?", "when can I take a trip?").

## Modules

- `src/time.js` — UTC-safe date helpers + French statutory holidays (computed Easter).
- `src/af-sessions.js` — Alliance Française session calendar generator:
  - confirmed 2026 anchors (26 Oct→20 Nov / 23 Nov→18 Dec intensive; 26 Oct→19 Nov / 23 Nov→17 Dec semi),
  - 4-week Mon-start blocks (intensive ends Fri, semi ends Thu),
  - winter break 19 Dec–3 Jan, holiday nudges (Easter Monday etc.),
  - sub-level ladders: intensive A1.1→B2.3 (9), semi A1.1→B2.6 (17),
  - `buildPlan({from, levels, format, skip})` → named sessions with prices,
  - `gapsBetween(sessions)` → vacation-capable gaps.
- `src/af-sessions-extra.js` — `dedupeGaps`, `lightWeeks` (weeks with ≤N class days).
- `src/calendar.js` — the general engine:
  - `DEFAULT_OBLIGATIONS` — work 7h/d Mon–Fri, gym W/F/Sa/Su (standing rules),
  - `afClassEvents(plan)` — AF sessions as busy events (morning intensive / afternoon semi),
  - `findFreeSlots` — invert busy intervals per day → free time-of-day slots (min hours, priorities),
  - `suggest({free, items})` — deadline-first packing of tasks into free capacity, reports shortfalls,
  - `findVacationWindows` — contiguous priority-1-free day runs (≥N days).

## Usage

```js
import { buildPlan, findFreeSlots, suggest, findVacationWindows } from './src/index.js';

const plan = buildPlan({ from: '2026-09-28', levels: 4, format: 'intensive' });
const events = [...DEFAULT_OBLIGATIONS, ...afClassEvents(plan)];
const free = findFreeSlots({ events, from: '2027-02-01', to: '2027-02-07', minHours: 2 });
const placements = suggest({ free, items: [{ id: 'x', label: 'Flashcards', hours: 6 }] });
const trips = findVacationWindows({ events, from: '2027-07-01', to: '2027-08-31', minDays: 4 });
```

Demo: `node src/example.js` · Tests: `npm test` (node:test, 8 passing)

## Data sources

- AF session anchors + prices + ladders: alliancefr.org course pages & progression charts (checked 3 Oct 2026).
- Standing schedule (work 7h/d, gym W/F/Sa/Su): Phuc's standing conventions.
- Planned-ahead events (Sorbonne dossier vert, UCAS/ESAT, permit renewal): Life Roadmap Short-term tab.

## Next steps (intended)

- Wire the website's Short-term tab data as an event source (JSON export).
- Agent integration: `findFreeSlots`/`suggest` as tools for scheduling questions.
- iCal export of the generated plans.
