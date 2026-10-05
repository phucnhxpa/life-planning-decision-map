// ── af-sessions.js additions: dedupe gaps + vacation-friendly views ──

// Dedupe overlapping gaps from multiple session lists
export function dedupeGaps(gaps) {
  const seen = new Set();
  return gaps.filter(g => {
    const key = g.from + '|' + g.to;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.from.localeCompare(b.from));
}

// Vacation-friendly session view: semi classes occupy only 13:30-16:30 Mon/Tue/Thu,
// so long weekends (Fri-Sun) + mornings are travel-capable. A "light week" = week with
// <= N class days.
export function lightWeeks(sessions, events, maxClassDays = 3) {
  // group sessions by ISO week of start
  const byWeek = new Map();
  for (const s of sessions) {
    const d = new Date(s.start + 'T00:00:00Z');
    const week = isoWeek(d);
    if (!byWeek.has(week)) byWeek.set(week, []);
    byWeek.get(week).push(s);
  }
  return [...byWeek.entries()]
    .filter(([, list]) => list.length <= maxClassDays)
    .map(([week, list]) => ({ week, sessions: list }));
}

function isoWeek(d) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const fDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fDayNum + 3);
  return 1 + Math.round((t - firstThursday) / 604800000);
}
