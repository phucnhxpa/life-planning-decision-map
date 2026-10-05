# Life Roadmap — life-planning-decision-map

One codebase, two parts:

```
app/                  → the site (React + Vite, deployed to GitHub Pages)
lib/calendar-core/    → slot-based calendar engine (plain ESM, npm workspace)
```

## Site (`app/`)

Tabs: Roadmap · Timeline & Citizenship · Relationship & Family · Home & Car · Short-term Priority.
Build: `npm run build` (workspace script) → output at repo root (`index.html` + `assets/`).

## Calendar engine (`lib/calendar-core/`)

Slot-based planning library extracted from the French-program timeline work. It models
recurring obligations + planned-ahead events (AF sessions, exams, deadlines), then:

- `buildPlan({from, levels, format, skip})` — AF session calendar: confirmed 2026 anchors,
  winter break, French holidays, Mon-start blocks (intensive→Fri, semi→Thu), prices.
- `findFreeSlots({events, from, to, minHours})` — invert busy intervals → free slots per day.
- `suggest({free, items})` — pack low-priority tasks into free capacity, deadline-first,
  reports shortfalls.
- `findVacationWindows({events, from, to, minDays})` — contiguous priority-1-free day runs.

```js
import { buildPlan, findFreeSlots, suggest, findVacationWindows } from './lib/calendar-core/src/index.js';

const plan = buildPlan({ from: '2026-09-28', levels: 4, format: 'intensive' });
const events = [...DEFAULT_OBLIGATIONS, ...afClassEvents(plan)];
const free = findFreeSlots({ events, from: '2027-02-01', to: '2027-02-07', minHours: 2 });
```

Tests: `npm test` (node --test, 8 passing).
Demo: `node lib/calendar-core/src/example.js`.

## Data flow (intended)

`app/` Short-term tab (timeline rows) → JSON event source → `calendar-core` →
free-slot answers, low-priority suggestions, vacation planning; surfaced back in the UI.
