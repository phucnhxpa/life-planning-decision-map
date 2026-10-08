import { useEffect, useRef } from 'react'
import stpMarkup from './shortTermPriorityMarkup.html?raw'
import './ShortTermPriority.css'

// Ported 1:1 from https://phucnhxpa.github.io/short-term-priority-timeline/
// Same markup, CSS and vanilla JS behaviour; rendered inside the Life Roadmap
// shell as an internal tab (no iframe, no navigation).
// SECURITY NOTE: stpMarkup is a static, first-party HTML string bundled at
// build time (own file in this repo) — it contains no user-supplied content,
// so dangerouslySetInnerHTML is safe here. The same pattern is used by
// InlineTimelineCitizenship.jsx.
// insertAdjacentHTML calls below inject template strings built exclusively
// from the hardcoded `rows` constant — no user input ever reaches them.

export default function ShortTermPriority() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const root = host.querySelector('.stp-root')
    if (!root) return undefined

    // ── Data (verbatim from the standalone site) ──
    const TODAY = '2026-09-15'
    const START = '2026-09-01'
    const END = '2028-12-31'

        const rows = [
      // ── FRENCH · INTENSIVE A1 → B2 (all intensive: 20h/week, AF 1 sub-level = 1 month) ──
      { group: 'French · intensive', title: 'Intensive A0 → B2', start: '2026-09-28', end: '2027-06-18', tone: 'blue',
        segments: [
          { start: '2026-09-28', end: '2026-10-23', label: 'A1.1', tone: 'green', detail: 'A1.1 · 28 Sep – 23 Oct 2026 (IN PROGRESS — your class). AF intensive, 72h/4wk, 09:00–13:00, €1,460.' },
          { start: '2026-10-26', end: '2026-11-20', label: 'A1.2', tone: 'green', detail: 'A1.2 · 26 Oct – 20 Nov 2026 (confirmed on alliancefr.org). A1 complete Fri 20 Nov.' },
          { start: '2026-11-23', end: '2026-12-18', label: 'A2.1', tone: 'blue', detail: 'A2.1 · 23 Nov – 18 Dec 2026 (confirmed on alliancefr.org).' },
          { start: '2027-01-04', end: '2027-01-29', label: 'A2.2', tone: 'blue', detail: 'A2.2 · 4 – 29 Jan 2027 (winter break 19 Dec – 3 Jan; AF resumes Mon 4 Jan). A2 complete Fri 29 Jan.' },
          { start: '2027-02-01', end: '2027-02-26', label: 'B1.1', tone: 'orange', detail: 'B1.1 · 1 – 26 Feb 2027.' },
          { start: '2027-03-01', end: '2027-03-26', label: 'B1.2', tone: 'orange', detail: 'B1.2 · 1 – 26 Mar 2027. B1 complete Fri 26 Mar.' },
          { start: '2027-03-30', end: '2027-04-23', label: 'B2.1', tone: 'purple', detail: 'B2.1 · Tue 30 Mar – Fri 23 Apr 2027 (starts Tue: Easter Monday 29 Mar, AF closed).' },
          { start: '2027-04-26', end: '2027-05-21', label: 'B2.2', tone: 'purple', detail: 'B2.2 · 26 Apr – 21 May 2027 (Ascension Thu 6 May, Whit Mon 17 May — AF fits the 72h around them).' },
          { start: '2027-05-24', end: '2027-06-18', label: 'B2.3', tone: 'purple', detail: 'B2.3 · 24 May – 18 Jun 2027. B2 course-complete Fri 18 Jun — ready for TCF DAP well before the 13 Feb 2028 last chance.' },
        ],
        marker: true, markerDate: '2027-06-18', markerLabel: 'B2 done',
        detail: 'All-intensive A0 → B2 on AF\u2019s real 4-week session calendar (confirmed sessions: 28 Sep, 26 Oct, 23 Nov 2026 starts; monthly Mon starts thereafter; exact 2027 spring dates follow AF\u2019s published pattern, flag if AF shifts them). 9 sub-levels · 9 sessions. Milestones: A1 20 Nov · A2 29 Jan · B1 26 Mar · B2 18 Jun 2027.' },
      // ── FRENCH · SEMI-INTENSIVE A1 → B2 (A1→A2 intensive, then A2→B1 and B1→B2 semi-intensive) ──
      { group: 'French · semi-intensive', title: 'Intensive A0 A1 → semi A2 B2', start: '2026-09-28', end: '2028-01-13', tone: 'teal',
        segments: [
          { start: '2026-09-28', end: '2026-10-23', label: 'A1.1 · int', tone: 'green', detail: 'A1.1 · 28 Sep – 23 Oct 2026 (IN PROGRESS). Intensive.' },
          { start: '2026-10-26', end: '2026-11-20', label: 'A1.2 · int', tone: 'green', detail: 'A1.2 · 26 Oct – 20 Nov 2026, intensive. A1 complete Fri 20 Nov — then switch to semi (36h/4wk, 9h/wk, €730).' },
          { start: '2026-11-23', end: '2026-12-17', label: 'A2.1', tone: 'blue', detail: 'A2.1 · 23 Nov – 17 Dec 2026, semi (matches AF\u2019s published semi session 23 Nov→17 Dec).' },
          { start: '2027-01-04', end: '2027-01-28', label: 'A2.2', tone: 'blue', detail: 'A2.2 · 4 – 28 Jan 2027, semi.' },
          { start: '2027-02-01', end: '2027-02-25', label: 'A2.3', tone: 'blue', detail: 'A2.3 · 1 – 25 Feb 2027, semi.' },
          { start: '2027-03-01', end: '2027-03-25', label: 'A2.4', tone: 'blue', detail: 'A2.4 · 1 – 25 Mar 2027, semi. A2 complete Thu 25 Mar (semi ladder: A2 = 4 sub-levels).' },
          { start: '2027-03-30', end: '2027-04-22', label: 'B1.1', tone: 'orange', detail: 'B1.1 · Tue 30 Mar – Thu 22 Apr 2027 (starts Tue: Easter Monday 29 Mar, AF closed), semi.' },
          { start: '2027-04-26', end: '2027-05-20', label: 'B1.2', tone: 'orange', detail: 'B1.2 · 26 Apr – 20 May 2027, semi.' },
          { start: '2027-05-24', end: '2027-06-17', label: 'B1.3', tone: 'orange', detail: 'B1.3 · 24 May – 17 Jun 2027, semi.' },
          { start: '2027-06-21', end: '2027-07-15', label: 'B1.4', tone: 'orange', detail: 'B1.4 · 21 Jun – 15 Jul 2027, semi. B1 complete Thu 15 Jul (semi ladder: B1 = 4 sub-levels).' },
          { start: '2027-07-19', end: '2027-08-12', label: 'B2.1', tone: 'purple', detail: 'B2.1 · 19 Jul – 12 Aug 2027, semi.' },
          { start: '2027-08-16', end: '2027-09-09', label: 'B2.2', tone: 'purple', detail: 'B2.2 · 16 Aug – 9 Sep 2027, semi.' },
          { start: '2027-09-13', end: '2027-10-07', label: 'B2.3', tone: 'purple', detail: 'B2.3 · 13 Sep – 7 Oct 2027, semi.' },
          { start: '2027-10-11', end: '2027-11-04', label: 'B2.4', tone: 'purple', detail: 'B2.4 · 11 Oct – 4 Nov 2027, semi.' },
          { start: '2027-11-08', end: '2027-12-02', label: 'B2.5', tone: 'purple', detail: 'B2.5 · 8 Nov – 2 Dec 2027, semi.' },
          { start: '2027-12-06', end: '2028-01-13', label: 'B2.6', tone: 'purple', detail: 'B2.6 · 6 Dec 2027 – 13 Jan 2028 (AF winter break 18 Dec – 3 Jan inside). B2 complete Wed 13 Jan 2028 — 4 weeks before TCF DAP last chance 13 Feb 2028.' },
        ],
        marker: true, markerDate: '2028-01-13', markerLabel: 'B2 done',
        detail: 'A0 → A1 intensive (to 20 Nov 2026), then semi all the way: AF semi ladder has MORE sub-levels (A2: 4, B1: 4, B2: 6) but each is still one 4-week session — 14 sessions total. B2 done ~13 Jan 2028. 14 sessions × €730 ≈ €10.2k.' },
      // ── FRENCH · INTENSIVE A1 → B1, THEN SEMI-INTENSIVE B2 · WITH 1-MONTH BREAK AFTER EACH LEVEL ──
      { group: 'French · intensive → semi', title: 'Int A0→B1 → semi B2 · breaks', start: '2026-09-28', end: '2028-01-17', tone: 'blue',
        segments: [
          { start: '2026-09-28', end: '2026-10-23', label: 'A1.1 · int', tone: 'green', detail: 'A1.1 · 28 Sep – 23 Oct 2026 (IN PROGRESS). Intensive.' },
          { start: '2026-10-26', end: '2026-11-20', label: 'A1.2 · int', tone: 'green', detail: 'A1.2 · 26 Oct – 20 Nov 2026, intensive. A1 COMPLETE → 1-month break.' },
          { start: '2026-11-21', end: '2027-01-03', label: 'break · A1', tone: 'neutral', detail: 'Month break after A1 (21 Nov 2026 – 3 Jan 2027) — merges with AF winter break 19 Dec – 3 Jan. Back Mon 4 Jan.' },
          { start: '2027-01-04', end: '2027-01-29', label: 'A2.1 · int', tone: 'blue', detail: 'A2.1 · 4 – 29 Jan 2027, intensive.' },
          { start: '2027-02-01', end: '2027-02-26', label: 'A2.2 · int', tone: 'blue', detail: 'A2.2 · 1 – 26 Feb 2027, intensive. A2 COMPLETE → 1-month break.' },
          { start: '2027-02-27', end: '2027-04-04', label: 'break · A2', tone: 'neutral', detail: 'Month break after A2 (27 Feb – 4 Apr 2027). Back Mon 5 Apr.' },
          { start: '2027-04-05', end: '2027-04-30', label: 'B1.1 · int', tone: 'orange', detail: 'B1.1 · 5 – 30 Apr 2027, intensive.' },
          { start: '2027-05-03', end: '2027-05-28', label: 'B1.2 · int', tone: 'orange', detail: 'B1.2 · 3 – 28 May 2027, intensive. B1 COMPLETE → 1-month break. 6 sessions × €1,460 ≈ €8.8k.' },
          { start: '2027-05-29', end: '2027-07-04', label: 'break · B1', tone: 'neutral', detail: 'Month break after B1 (29 May – 4 Jul 2027). Back Mon 5 Jul.' },
          { start: '2027-07-05', end: '2027-07-29', label: 'B2.1', tone: 'purple', detail: 'B2.1 · 5 – 29 Jul 2027, semi (Mon–Thu). Semi runs back-to-back — no gaps between sessions.' },
          { start: '2027-08-02', end: '2027-08-26', label: 'B2.2', tone: 'purple', detail: 'B2.2 · 2 – 26 Aug 2027, semi.' },
          { start: '2027-08-30', end: '2027-09-23', label: 'B2.3', tone: 'purple', detail: 'B2.3 · 30 Aug – 23 Sep 2027, semi.' },
          { start: '2027-09-27', end: '2027-10-21', label: 'B2.4', tone: 'purple', detail: 'B2.4 · 27 Sep – 21 Oct 2027, semi.' },
          { start: '2027-10-25', end: '2027-11-18', label: 'B2.5', tone: 'purple', detail: 'B2.5 · 25 Oct – 18 Nov 2027, semi.' },
          { start: '2027-11-22', end: '2027-12-16', label: 'B2.6', tone: 'purple', detail: 'B2.6 · 22 Nov – 16 Dec 2027, semi. B2 complete Thu 16 Dec 2027 — 8 weeks before the TCF DAP last chance 13 Feb 2028.' },
          { start: '2027-12-17', end: '2028-01-17', label: 'break · B2', tone: 'neutral', detail: 'Month break after B2 (17 Dec 2027 – 17 Jan 2028) — merges with AF winter break 18 Dec – 3 Jan. The TCF DAP sitting fits inside/after this break; last chance 13 Feb still ahead.' },
        ],
        marker: true, markerDate: '2027-12-16', markerLabel: 'B2 done',
        detail: 'Intensive A0 → B1 with a 1-month break after each completed level (after A1 · after A2 · after B1), then semi-intensive B2 back-to-back — no gaps (AF semi sessions chain Mon→Thu). B2 done 16 Dec 2027, 8 weeks before the TCF DAP last chance 13 Feb 2028; the post-B2 break starts 17 Dec. 6 × €1,460 + 6 × €730 ≈ €13.1k.' },
      // ── FRENCH UNIVERSITY ──
      { group: 'French university', title: 'French B2 · TCF', rowLabel: 'French B2 · TCF DAP deadline', start: '2028-02-13', marker: true, markerDate: '2028-02-13', markerLabel: 'TCF DAP deadline', tone: 'orange',
        detail: 'French B2 proof for dossier vert: TCF DAP online registration closes 15 Dec 2027 (ministry délai de rigueur); absolute last pass 13 Feb 2028 — results precede the 16 Mar commissions. No retake after that (30-day gap rule). Source: Admission Reference 2028 Intake PDF.' },
      { group: 'French university', title: 'A-level submission', rowLabel: 'A-level certificates deadline', start: '2028-03-31', marker: true, markerDate: '2028-03-31', markerLabel: 'deadline', tone: 'blue',
        detail: 'A-levels for the dossier: last usable sitting is the January 2028 series (exams 5–25 Jan). Results ~5 Mar 2028, certificates by ~31 Mar 2028 — in the file before decisions. Anything later is too late.' },
      { group: 'French university', title: 'Application', rowLabel: 'Application · apply → decision → year starts', start: '2028-01-15', marker: true, markerDate: '2028-01-15', markerLabel: 'last day to apply', tone: 'red',
        markers: [
          { date: '2028-04-30', label: 'decision day' },
          { date: '2028-09-01', label: 'school year' },
        ],
        deadline: '2028-01-15',
        detail: 'Dossier vert application: last day to apply 15 Jan 2028 (Sorbonne faculty outer edge; ministry target 15 Dec 2027). Decision day 30 Apr 2028 — all three dossier-vert universities respond; accept by 31 May or auto-refusal. School year starts 1 Sep 2028.' },
      // ── CAMBRIDGE / IMPERIAL ──
      { group: 'Cambridge/Imperial', title: 'A-level', rowLabel: 'A-level · exam dates', start: '2026-10-09', marker: true, markerDate: '2026-10-09', markerLabel: 'Oct exams', tone: 'blue',
        markers: [
          { date: '2027-01-14', label: 'Jan exams' },
        ],
        detail: 'A-level sittings feeding the 2028-entry UCAS file: Oct 2026 series (P1 9 Oct, M1 13 Oct, P2 15 Oct, S1 19 Oct, P3 21 Oct, M2 22 Oct, P4 28 Oct) and Jan 2027 series (FP1 14 Jan, S2 18 Jan, FP2 20 Jan, FP3 21 Jan, M3 25 Jan).' },
      { group: 'Cambridge/Imperial', title: 'ESAT', rowLabel: 'ESAT · booking & test', start: '2027-09-27', marker: true, markerDate: '2027-09-27', markerLabel: 'booking closes', tone: 'orange',
        markers: [
          { date: '2027-10-11', label: 'test window' },
        ],
        detail: 'ESAT for Oct 2028 entry, sat in the 2027 cycle: booking closes ~27 Sep 2027 (6pm UK, following the official UAT-UK pattern — 2027 entry closed 28 Sep 2026), test window ~11–15 Oct 2027 (Cambridge applicants must sit in October). Dates are projected from the published 2027-entry calendar until UAT-UK announces the 2028 cycle.' },
      { group: 'Cambridge/Imperial', title: 'Application', rowLabel: 'Application · deadline → interview → decision', start: '2027-10-15', marker: true, markerDate: '2027-10-15', markerLabel: 'deadline to apply', tone: 'red',
        markers: [
          { date: '2027-12-01', label: 'interviews' },
          { date: '2028-01-27', label: 'decision day' },
        ],
        deadline: '2027-10-15',
        detail: 'One UCAS form covers Oxford/Cambridge/Imperial: deadline to apply 15 Oct 2027, 18:00 UK (MCA Cambridge extra form 22 Oct). Cambridge interviews first 3 weeks of Dec 2027; Imperial interviews Nov 2027 - Feb 2028. Cambridge decision 27 Jan 2028; Imperial decisions aimed by 31 Mar 2028.' },
      // ── ADMINISTRATIVE ──
      { group: 'Administrative', title: 'Tax · 2026 declaration', rowLabel: 'Tax: 2026 income declaration (2027)', start: '2027-04-01', marker: true, markerDate: '2027-05-20', markerLabel: '', tone: 'orange',
        markers: [
          { date: '2027-04-10', label: 'paper deadline' },
          { date: '2027-05-20', label: 'e-filing deadline' },
          { date: '2027-08-31', label: 'tax assessed' },
        ],
        deadline: '2027-05-20',
        detail: 'Déclaration des revenus 2026, filed spring 2027 (auto-entrepreneur turnover + any wages). Paper deadline ~10 Apr 2027; online ~20 May 2027 (départements vary by a few days). AVI/balance usually debited late Sep 2027. The spring-2027 avis is the income proof for the CROUS dossier social and the residence-permit renewal filed the same summer. Exact zone dates publish on impots.gouv.fr in April.' },
      { group: 'Administrative', title: 'Change company status', rowLabel: 'Change auto-entreprise status', start: '2027-01-15', marker: true, markerDate: '2027-01-15', markerLabel: 'target filing', tone: 'blue',
        deadline: '2027-01-15',
        detail: 'Guichet unique (INPI) filing to move from micro-entrepreneur to a société (or adjust APE/activity). Plan ~1 month for SIRET update + bank/social-security follow-ups. Target filing 15 Jan 2027 — placeholder date, move freely.' },
      { group: 'Administrative', title: 'Residence permit', rowLabel: 'Residence permit · renew', start: '2027-05-10', marker: true, markerDate: '2027-05-10', markerLabel: '', tone: 'purple',
        markers: [
          { date: '2027-05-10', label: 'contact InExpat' },
          { date: '2027-08-10', label: 'submission' },
          { date: '2027-11-10', label: 'expiry' },
        ],
        deadline: '2027-08-10',
        detail: 'Titre de séjour: contact InExpat (Nathalie/Léa) 10 May 2027, compile dossier, then submit 10 Aug 2027 = 3 months before the 10 Nov 2027 expiry. ATT (récépissé) covers the gap if the decision is pending at expiry.' },
      // ── LIFE ──
      { group: 'Life', title: 'Rental · end → new apartment', rowLabel: 'Rental: lease ends → search → move', start: '2027-11-01', end: '2028-03-31', tone: 'orange',
        segments: [
          { start: '2027-11-01', end: '2028-01-31', label: 'Lease ends', tone: 'red', detail: 'End of current rental (placeholder: 31 Jan 2028). Préavis = 1 month for furnished leases, so give notice by 31 Dec 2027 at the latest.' },
          { start: '2027-12-01', end: '2028-02-28', label: 'Find new apartment', tone: 'blue', detail: '3-month search block: dossier (garant, payslips/attestations), visits, offer. Overlaps the last lease month on purpose — never let them not overlap.' },
          { start: '2028-03-01', end: '2028-03-31', label: 'New apt', tone: 'green', detail: 'Sign the new bail, move in March 2028 — 6 months before the Sorbonne rentrée, comfortably before the A2 2027 plan ends.' },
        ],
        marker: true, markerDate: '2028-03-01', markerLabel: 'moved',
        detail: 'Rental chain: lease ends 31 Jan 2028 → 3-month find-new-apartment block (Dec 2027 – Feb 2028) → move into new apartment Mar 2028. Dates are planning placeholders — adjust to the real bail.' },
    ]

    const startMs = new Date(START).getTime()
    const endMs = new Date(END).getTime()
    const total = endMs - startMs
    const pctAt = (d) => Math.min(100, Math.max(0, ((new Date(d).getTime() - startMs) / total) * 100))
    const fmt = (d, opts = { day: '2-digit', month: 'short' }) => new Date(d).toLocaleDateString('en-GB', opts)
    const fmtLong = (d) => fmt(d, { day: '2-digit', month: 'short', year: '2-digit' })

    const axis = root.querySelector('#stpAxis')
    const grid = root.querySelector('#stpGrid')
    const lines = root.querySelector('#stpGridLines')
    const wrap = root.querySelector('#stpTimelineView')
    const controlsEl = root.querySelector('#stpControls')
    const capacityList = root.querySelector('#stpCapacityList')

    function months() {
      const out = []
      const d = new Date(START)
      d.setDate(1)
      const e = new Date(END)
      while (d <= e) {
        const label = d.getMonth() === 0 ? d.toLocaleDateString('en-GB', { month: 'short' }) + ' ' + String(d.getFullYear()).slice(2) : d.toLocaleDateString('en-GB', { month: 'short' })
        out.push({ label, date: d.toISOString().slice(0, 10), year: d.getMonth() === 0 })
        d.setMonth(d.getMonth() + 1)
      }
      return out
    }

    function tip(title, date, detail) {
      return `<span class="tip"><strong>${title}</strong><em>${date}</em>${detail}</span>`
    }

    // Track placed label boxes per row so consecutive markers nudge instead of overlapping.
    let placedLabels = []
    function resetLabels() { placedLabels = [] }
    function marker(row, date, label, tone, detailTitle = row.title) {
      if (!label) { console.error('marker label missing', row && row.title, date); label = fmt(date) }
      const leftPct = pctAt(date)
      // estimated label box in % of track width (label ~6.1px/char at 8.5px font, canvas ~1800px)
      const estW = Math.min(40, (label.length * 6.1 + 16) / 18)
      const lane = placedLabels.length % 2 // alternate up/down
      placedLabels.push({ lane, left: leftPct, w: estW })
      const topStyle = lane === 1 ? 'top:-13px;transform:translateY(0)' : 'transform:translateY(-50%)'
      const shiftStyle = ''
      return `<div class="marker ${tone}${lane === 1 ? ' lane-up' : ''}" style="left:${leftPct}%"><span class="marker-line"></span><span class="marker-dot"></span><span class="marker-label" style="${[topStyle, shiftStyle].filter(Boolean).join(';')}">${label}</span>${tip(detailTitle, fmtLong(date), row.detail)}</div>`
    }

    function block(row, segment = row) {
      const left = pctAt(segment.start)
      const width = Math.max(1.2, pctAt(segment.end) - left)
      const label = segment.label || row.title
      const tone = segment.tone || row.tone
      const dates = segment.dates || `${fmt(segment.start)} → ${fmt(segment.end)}`
      const showDates = width >= 6 // short bars: drop in-bar date text so end markers stay readable
      return `<div class="block ${tone}" style="left:${left}%;width:${width}%"><span>${label}</span>${showDates ? `<small>${dates}</small>` : ''}${tip((row.rowLabel || row.title) + (segment.label ? ' · ' + segment.label : ''), `${fmtLong(segment.start)} → ${fmtLong(segment.end)}`, segment.detail || row.detail)}</div>`
    }

    function pause(p) {
      const left = pctAt(p.start)
      const width = Math.max(1.2, pctAt(p.end) - left)
      return `<div class="pause" style="left:${left}%;width:${width}%"><span>${p.label}</span>${tip(p.label, `${fmtLong(p.start)} → ${fmtLong(p.end)}`, 'Protected blank break — no scheduling here.')}</div>`
    }

    // SECURITY: progressBlock builds HTML only from hardcoded row constants (same as block/marker above); no user input.
    function progressBlock(row) {
      const left = pctAt(row.start)
      const width = Math.max(1.2, pctAt(row.end) - left)
      const nowPct = Math.max(0, Math.min(100, ((new Date(TODAY).getTime() - new Date(row.start).getTime()) / (new Date(row.end).getTime() - new Date(row.start).getTime())) * 100))
      return `<div class="block ${row.tone} progress-block" style="left:${left}%;width:${width}%"><span class="pct">${nowPct.toFixed(0)}% ${row.progressLabel || ''} · today</span>${tip(row.title, `${fmtLong(row.start)} → ${fmtLong(row.end)}`, row.detail + ` · As of ${fmtLong(TODAY)}: ${nowPct.toFixed(0)}% of the way to B2.`)}</div>`
    }

    for (const m of months()) {
      axis.insertAdjacentHTML('beforeend', `<div class="tick ${m.year ? 'year' : ''}" style="left:${pctAt(m.date)}%"><span>${m.label}</span></div>`)
      lines.insertAdjacentHTML('beforeend', `<span style="left:${pctAt(m.date)}%"></span>`)
    }
    axis.insertAdjacentHTML('beforeend', `<div class="today-line" style="left:${pctAt(TODAY)}%"><span>today · ${fmt(TODAY)}</span></div>`)
    lines.insertAdjacentHTML('beforeend', `<span class="today" style="left:${pctAt(TODAY)}%"></span>`)

    // Percentage of runway left to each deadline, measured from the start of October 2027 (i.e. the
    // admissions-cycle kickoff). pctLeft = (deadline - TODAY) / (deadline - 2027-10-01). 100% = full runway
    // remaining at Oct 1; 0% = deadline reached. Values >100% mean the deadline sits before Oct 1 (ESAT booking).
    const RUNWAY_START = '2026-10-01'
    function pctLeft(deadline) {
      // Share of the runway [today -> rentrée 1 Sep 2028] still left when this deadline arrives.
      // 100% = far future / before today (not yet binding), 0% = at or after rentrée.
      const dl = new Date(deadline + 'T23:59:59').getTime()
      const rs = new Date(RUNWAY_START + 'T00:00:00').getTime()
      const now = Date.now()
      if (dl <= now) return 0            // deadline already passed
      const val = ((dl - now) / (rs - now)) * 100
      return Math.min(100, Math.max(0, val))
    }
    function pctTone(v) { return v <= 15 ? 'crit' : v <= 40 ? 'warn' : '' }
    // ── Vacation & free-time finder ──
    // A day is "busy" when a hard commitment touches it: any row's block/markers (exams, deadlines,
    // class blocks, admin windows). Soft rows (progress bars) don't block. Weekends are always lighter.
    function busyDaysFromRows() {
      const busy = new Map() // date -> [reasons]
      const mark = (d, reason) => {
        if (!d) return
        const key = d.slice(0, 10)
        if (key < START || key > END) return
        if (!busy.has(key)) busy.set(key, [])
        busy.get(key).push(reason)
      }
      for (const row of rows) {
        if (row.progress) continue
        const why = row.rowLabel || row.title
        if (row.segments) for (const s of row.segments) {
          let d = new Date(s.start + 'T00:00:00Z'); const end = new Date(s.end + 'T00:00:00Z')
          for (; d <= end; d = new Date(d.getTime() + 864e5)) mark(d.toISOString().slice(0, 10), why)
        } else {
          let d = new Date(row.start + 'T00:00:00Z'); const end = new Date(row.end + 'T00:00:00Z')
          for (; d <= end; d = new Date(d.getTime() + 864e5)) mark(d.toISOString().slice(0, 10), why)
        }
        if (row.markerDate) {
          const m0 = new Date(row.markerDate + 'T00:00:00Z')
          for (let i = -1; i <= 1; i++) mark(new Date(m0.getTime() + i * 864e5).toISOString().slice(0, 10), row.markerLabel || why)
        }
        for (const m of (row.markers || [])) {
          const m0 = new Date(m.date + 'T00:00:00Z')
          for (let i = -1; i <= 1; i++) mark(new Date(m0.getTime() + i * 864e5).toISOString().slice(0, 10), m.label)
        }
      }
      return busy
    }
    function vacationWindows(busy) {
      const out = []
      let run = null
      for (let d = new Date(START + 'T00:00:00Z'); d <= new Date(END + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) {
        const key = d.toISOString().slice(0, 10)
        const dow = d.getUTCDay()
        const weekend = dow === 6 || dow === 0
        if (!busy.has(key) || (weekend && (busy.get(key) || []).every(r => /AF |French ·/.test(r)))) {
          if (!run) run = { from: key, days: 0, reasons: new Set() }
          run.days++; run.to = key
          for (const r of (busy.get(key) || [])) run.reasons.add(r)
        } else {
          if (run && run.days >= 3) out.push(run)
          run = null
        }
      }
      if (run && run.days >= 3) out.push(run)
      const rank = w => {
        let score = w.days
        const d0 = new Date(w.from + 'T00:00:00Z')
        if (d0.getUTCDay() === 5 || d0.getUTCDay() === 6) score += 1
        // bonus: inside AF winter break / summer (Jul-Aug)
        const mo = d0.getUTCMonth() + 1
        if (mo === 7 || mo === 8 || (mo === 12 && d0.getUTCDate() >= 18)) score += 2
        w.score = score
        return score
      }
      out.forEach(rank)
      return out.sort((a, b) => b.score - a.score)
    }

    const VACATION_WINS = vacationWindows(busyDaysFromRows())

    // Vacation windows as rows IN the timeline grid (same coordinate system as other rows).
    // Rendered after the main loop as a dedicated section with translucent teal bars.
    function renderVacationRows() {
      if (!VACATION_WINS.length) return
      const grid2 = root.querySelector('#stpGrid')
      const wins = VACATION_WINS.slice(0, 6)
      grid2.insertAdjacentHTML('beforeend', `<div class="section-divider vacation-divider"><div class="section-title">Vacation windows \u2014 computed from every row above</div><div class="section-sub">Free day-runs with zero hard commitments \u00b7 one row \u00b7 hover a bar for dates</div></div>`)
      const pct = (d) => pctAt(d)
      const placed = []  // lanes of [fromPct, toPct]
      const bars = wins.map(w => {
        const tier = w.days >= 7 ? 'prime' : w.days >= 4 ? 'good' : 'mini'
        const why = w.reasons.size ? [...w.reasons].slice(0, 3).join(' \u00b7 ') : 'nothing booked \u2014 completely clear'
        const left = pct(w.from)
        const width = Math.max(1.2, pct(w.to) - left)
        // lane packing: first lane whose bars don't horizontally overlap this one
        let lane = placed.findIndex(l => l.every(([a, b]) => left + width <= a || left >= b))
        if (lane === -1) { placed.push([[left, left + width]]); lane = placed.length - 1 }
        else placed[lane].push([left, left + width])
        const label = `${w.days}d \u00b7 ${tier}`
        const detail = `${w.days} free days (${tier}) \u00b7 clear of: ${why}`
        return `<div class="block vacation-block-bar ${tier} vlane${lane}" style="left:${left}%;width:${width}%"><span>${label}</span><small>${fmt(w.from)} \u2192 ${fmt(w.to)}</small>${tip(`Vacation window \u00b7 ${tier}`, `${fmtLong(w.from)} \u2192 ${fmtLong(w.to)}`, detail)}</div>`
      }).join('')
      grid2.insertAdjacentHTML('beforeend', `<div class="row vacation-row"><div class="row-label"><div class="group">Vacation</div><div class="name">${wins.length} clear windows</div></div><div class="track">${bars}</div></div>`)
    }

    let dividerDone = false
    let adminDividerDone = false
    for (const row of rows.filter(r => r.group !== 'Capacity')) {
      if ((row.group || '') === 'Administrative' && !adminDividerDone) {
        grid.insertAdjacentHTML('beforeend', `<div class="section-divider"><div class="section-title">Administrative \u2014 tax \u00b7 company \u00b7 residence permit</div><div class="section-sub">French administrative calendar \u00b7 % = time elapsed since 1 Sep 2026, per deadline</div></div>`)
        adminDividerDone = true
      }
      if ((row.admissions || (row.group || '').startsWith('French university') || (row.group || '').startsWith('Cambridge/Imperial')) && !dividerDone) {
        grid.insertAdjacentHTML('beforeend', `<div class="section-divider"><div class="section-title">University deadlines \u2014 verified against the Admission Reference PDF</div><div class="section-sub">French: apply 15 Jan \u2192 TCF DAP 13 Feb \u2192 decision 30 Apr \u00b7 UK: UCAS 15 Oct 2027 \u2192 decision Jan\u2013Mar 2028 \u00b7 % = time elapsed since 1 Sep 2026, per deadline</div></div>`)
        dividerDone = true
      }
      resetLabels()
      const cls = row.admissions ? ' row admissions-section' : ''
      const dl = row.deadline || row.end || row.markerDate
      const pctV = dl ? pctLeft(dl) : null
      const monthsLeft = dl ? ((new Date(dl + 'T23:59:59') - Date.now()) / (30.44 * 864e5)) : null
      // % elapsed from the common plan baseline 1 Sep 2026 → this deadline (clamped, shared scale for every row)
      const PLAN_START = new Date('2026-09-01T00:00:00')
      const RUNWAY_END = new Date('2028-09-01T00:00:00')
      const pctFromSep = dl === null ? null : Math.max(0, Math.min(100, Math.round(100 * (Date.now() - PLAN_START) / (new Date(dl + 'T23:59:59') - PLAN_START))))
      const badge = dl === null ? '' : monthsLeft <= 0
        ? `<span class="pct-left red" title="Deadline ${fmtLong(dl)} has passed">passed</span>`
        : `<span class="pct-left ${pctTone(pctV)}" title="${pctFromSep}% of the time from 1 Sep 2026 to ${fmtLong(dl)} has elapsed; ${monthsLeft >= 1 ? Math.floor(monthsLeft) + 'm ' + Math.round((monthsLeft % 1) * 4.33) + 'w' : Math.max(1, Math.round(monthsLeft * 4.33)) + 'w'} left">${pctFromSep}%</span>`
      const extra = (row.markers || []).map(m => marker(row, m.date, m.label, m.tone || row.tone, m.label)).join('')
      const content = row.marker && !row.segments
        ? marker(row, row.start, row.markerLabel || fmt(row.start), row.tone) + extra
        : row.progress
          ? progressBlock(row) + (row.markerDate ? marker(row, row.markerDate, row.markerLabel || 'B2', row.tone, row.markerLabel || row.title) : '') + extra
          : `${(row.segments || [row]).map(s => block(row, s)).join('')}${(row.pauses || []).map(pause).join('')}${row.markerDate ? marker(row, row.markerDate, row.markerLabel || fmt(row.markerDate), row.tone, row.markerLabel || row.title) : ''}` + extra
      grid.insertAdjacentHTML('beforeend', `<div class="row${cls}"><div class="row-label"><div class="group">${row.group}</div><div class="name">${row.rowLabel || row.title}</div></div><div class="track">${content}</div>${badge}</div>`)
    }

    // ── Daily study window (09:00–13:00) — rendered INSIDE the grid, same % coordinates as rows ──
    // Monthly demand model (h/day inside the 4h window), from the plan's real phases:
    //   maths: 17.6 → 20h/wk · physics 8 → 10h/wk (Jun 27) · French 20h/wk int / 9h semi / 2h breaks
    //   crunch months add UCAS/ESAT/interview/dossier load
    const DAYWIN_MONTHS = (() => {
      const out = []
      let y = 2026, m = 9
      while (y < 2028 || (y === 2028 && m <= 9)) {
        out.push({ y, m })
        m++; if (m > 12) { m = 1; y++ }
      }
      return out
    })()
    const DAYWIN = DAYWIN_MONTHS.map(({ y, m }) => {
      let maths = 17.6
      if (y === 2026 && m >= 10) maths = 19
      if (y >= 2027) maths = 20
      let phys = 8
      if ((y === 2027 && m >= 6) || y >= 2028) phys = 10
      let fr = 0
      if (y === 2026 && m === 12) fr = 2
      else if (y === 2027 && m === 3) fr = 2
      else if (y === 2027 && m === 6) fr = 2
      else if (y === 2026 || (y === 2027 && m <= 5)) fr = 20
      else if (y === 2027 && m >= 7 && m <= 12) fr = 9
      else if (y === 2028 && m === 1) fr = 2
      let crunch = 0
      if (y === 2026 && m === 10) crunch = 3
      if (y === 2027 && m === 1) crunch = 3
      if (y === 2027 && m === 10) crunch = 4
      if (y === 2027 && (m === 11 || m === 12)) crunch = 2
      if (y === 2028 && m === 1) crunch = 4
      if (y === 2028 && m === 2) crunch = 2
      const daily = (maths + phys + fr + crunch) / 6
      const monthStart = new Date(Date.UTC(y, m - 1, 1))
      const monthEnd = new Date(Date.UTC(y, m, 1))
      const label = monthStart.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })
      return { y, m, label, maths, phys, fr, crunch, daily,
        left: pctAt(monthStart.toISOString().slice(0, 10)),
        width: Math.max(0.5, pctAt(monthEnd.toISOString().slice(0, 10)) - pctAt(monthStart.toISOString().slice(0, 10))) }
    })

    function renderDayWinChart() {
      const grid2 = root.querySelector('#stpGrid')
      if (!grid2) return
      const CAP = 4
      const H = 150
      // pixel-true width: use the track's real rendered width (canvas minus label col) — no stretching
      const probe = grid2.querySelector('.row:not(.daywin-row) .track')
      const trackW = Math.max(600, Math.round(probe ? probe.getBoundingClientRect().width : 1800))
      const maxV = Math.max(CAP + 0.5, ...DAYWIN.map(d => d.daily))
      const xOf = pct => (pct / 100) * trackW
      const yOf = v => H - 22 - (v / maxV) * (H - 40)
      let inner = ''
      for (let v = 0; v <= Math.ceil(maxV); v++) {
        const gy = yOf(v)
        inner += `<line x1="0" y1="${gy}" x2="${trackW}" y2="${gy}" stroke="rgba(0,0,0,${v === 0 ? 0.22 : 0.06})" stroke-width="1"/>`
        inner += `<text x="6" y="${gy - 3}" font-size="9.5" fill="#8e8e93">${v}h</text>`
      }
      const capY = yOf(CAP)
      inner += `<line x1="0" y1="${capY}" x2="${trackW}" y2="${capY}" stroke="#1d1d1f" stroke-width="1.4" stroke-dasharray="6 4" opacity=".75"/>`
      DAYWIN.forEach(d => {
        const x = xOf(d.left), w = xOf(d.width)
        const cx = x + w / 2
        const totalWk = d.maths + d.phys + d.fr + d.crunch
        const segs = [['dw-maths', d.maths], ['dw-phys', d.phys], ['dw-fr', d.fr], ['dw-other', d.crunch]]
        let acc = 0
        for (const [cls, wk] of segs) {
          if (!wk) continue
          const hFr = (wk / totalWk) * d.daily
          const y1 = yOf(acc + hFr), y2 = yOf(acc)
          inner += `<rect x="${(x + w * 0.18).toFixed(1)}" y="${y1.toFixed(1)}" width="${Math.max(2, w * 0.64).toFixed(1)}" height="${Math.max(1, y2 - y1).toFixed(1)}" rx="2" class="dw-seg ${cls}"><title>${d.label} ${d.y} — ${cls.replace('dw-', '')}: ${(wk / 6).toFixed(1)}h/day</title></rect>`
          acc += hFr
        }
        if (d.daily > CAP) {
          inner += `<rect x="${(x + w * 0.18).toFixed(1)}" y="${yOf(d.daily).toFixed(1)}" width="${Math.max(2, w * 0.64).toFixed(1)}" height="${(capY - yOf(d.daily)).toFixed(1)}" class="dw-over"><title>${d.label} ${d.y}: ${d.daily.toFixed(1)}h/day — ${(d.daily - CAP).toFixed(1)}h ABOVE the window</title></rect>`
        } else {
          inner += `<line x1="${cx.toFixed(1)}" y1="${yOf(d.daily).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${capY.toFixed(1)}" stroke="#1e8e3e" stroke-width="1.3" stroke-dasharray="2 3" opacity=".6"/>`
        }
        inner += `<text x="${cx.toFixed(1)}" y="${H - 8}" font-size="9.5" fill="${d.daily > CAP ? '#b3261e' : '#6e6e73'}" text-anchor="middle" font-weight="${d.daily > CAP ? 700 : 400}">${d.label}</text>`
        inner += `<rect x="${x.toFixed(1)}" y="0" width="${Math.max(2, w).toFixed(1)}" height="${H}" fill="transparent"><title>${d.label} ${d.y} — total ${d.daily.toFixed(1)}h/day in the 09:00–13:00 window (capacity 4h/day)</title></rect>`
      })
      const pts = DAYWIN.map(d => `${(xOf(d.left) + xOf(d.width) / 2).toFixed(1)},${(yOf(d.daily) - 2).toFixed(1)}`)
      let path = ''
      pts.forEach((pt, i3) => { path += (i3 === 0 ? 'M' : ' L') + pt })
      inner += `<path d="${path}" fill="none" stroke="#6d5dfc" stroke-width="1.6" opacity=".7" stroke-linejoin="round"/>`
      inner += `<text x="${trackW - 6}" y="${capY - 5}" font-size="9.5" fill="#1d1d1f" text-anchor="end" font-weight="600">4h/day window capacity</text>`

      grid2.insertAdjacentHTML('beforeend', `<div class="section-divider daywin-divider"><div class="section-title">Daily study window · 09:00 → 13:00 — same months as above</div><div class="section-sub">bars = study demand/month (maths · physics · french · crunch) in your 4h morning window · dashed line = capacity · green tick = spare · red = above window</div></div>`)
      grid2.insertAdjacentHTML('beforeend', `<div class="row daywin-row"><div class="row-label"><div class="group">Study window</div><div class="name">4h/day capacity</div></div><div class="track daywin-track"><svg viewBox="0 0 ${trackW} ${H}" width="${trackW}" height="${H}" style="display:block">${inner}</svg></div></div>`)
      const over = DAYWIN.filter(d => d.daily > CAP)
      const spare = DAYWIN.filter(d => d.daily <= CAP - 0.75)
      const vTxt = over.length
        ? `<strong>Above window:</strong> ${over.map(d => `${d.label} ${d.y} (${d.daily.toFixed(1)}h/day)`).join(' · ')} — needs evening top-ups or the work cut.` + (spare.length ? ` <strong>Spare:</strong> ${spare.map(d => `${d.label} ${d.y} (+${(CAP - d.daily).toFixed(1)}h/day)`).join(' · ')}.` : '')
        : `<strong>Everything fits</strong> in 09:00–13:00.`
      grid2.insertAdjacentHTML('beforeend', `<div class="row daywin-caption-row"><div class="row-label"><div class="group">Read-out</div><div class="name">capacity check</div></div><div class="track"><div class="daywin-caption">${vTxt}</div></div></div>`)
    }

    renderVacationRows()
    renderDayWinChart()

    // Second layout pass: measure real label boxes and nudge any same-lane overlaps to the right.
    // (Estimates at render time underestimate long labels; real rects are authoritative.)
    requestAnimationFrame(() => {
      root.querySelectorAll('.row').forEach(row => {
        const laneOf = el => el.closest('.marker')?.classList.contains('lane-up') ? 1 : 0
        const byLane = new Map()
        row.querySelectorAll('.marker-label').forEach(el => {
          const lane = laneOf(el)
          if (!byLane.has(lane)) byLane.set(lane, [])
          byLane.get(lane).push(el)
        })
        byLane.forEach(labels => {
          let prevRight = null
          labels.forEach(el => {
            const r = el.getBoundingClientRect()
            const canvas = el.closest('.timeline-canvas')
            if (!canvas) return
            const cw = canvas.getBoundingClientRect().width
            const leftPct = ((r.left - canvas.getBoundingClientRect().left) / cw) * 100
            let nudgePct = 0
            if (prevRight !== null) {
              const prevLeftPct = prevRight.pct
              const myRightPct = leftPct + (r.width / cw) * 100
              if (leftPct < prevRight.pct + (prevRight.w / cw) * 100) {
                nudgePct = prevRight.pct + (prevRight.w / cw) * 100 + 0.6 - leftPct
              }
            }
            if (nudgePct > 0) el.style.left = `calc(7px + ${(nudgePct / 100) * cw}px)`
            const nr = el.getBoundingClientRect()
            const canvasRect = el.closest('.timeline-canvas').getBoundingClientRect()
            prevRight = { pct: ((nr.left - canvasRect.left) / canvasRect.width) * 100, w: nr.width }
          })
        })
      })
    })
    const scrollToDate = (date) => {
      const canvas = root.querySelector('.timeline-canvas')
      const target = (pctAt(date) / 100) * canvas.scrollWidth
      wrap.scrollTo({ left: Math.max(0, target - wrap.clientWidth * 0.24), behavior: 'smooth' })
    }

    const controls = [
      ['←', () => wrap.scrollBy({ left: -Math.round(wrap.clientWidth * .8), behavior: 'smooth' })],
      ['Today', () => scrollToDate(TODAY)],
      ['A1.1', () => scrollToDate('2026-09-01')],
      ['A1.2', () => scrollToDate('2026-11-01')],
      ['A2', () => scrollToDate('2027-01-01')],
      ['TCF', () => scrollToDate('2027-12-15')],
      ['apply', () => scrollToDate('2028-01-15')],
      ['decision', () => scrollToDate('2028-04-30')],
      ['ESAT', () => scrollToDate('2027-10-11')],
      ['UCAS', () => scrollToDate('2027-10-15')],
      ['permit', () => scrollToDate('2027-08-10')],
      ['move', () => scrollToDate('2028-03-01')],
      ['rentrée', () => scrollToDate('2028-09-01')],
      ['→', () => wrap.scrollBy({ left: Math.round(wrap.clientWidth * .8), behavior: 'smooth' })],
    ]
    for (const [label, fn] of controls) {
      const b = document.createElement('button')
      b.type = 'button'; b.textContent = label; b.onclick = fn
      controlsEl.appendChild(b)
    }

    const vacationStrip = root.querySelector('#stpVacationStrip')
    if (vacationStrip) {
      const wins = VACATION_WINS
      const fmd = k => k.slice(8, 10) + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+k.slice(5, 7) - 1]
      for (const w of wins) {
        const tier = w.days >= 7 ? 'prime' : w.days >= 4 ? 'good' : 'mini'
        const why = w.reasons.size ? [...w.reasons].slice(0, 3).join(' · ') : 'nothing booked — completely clear'
        // Safe DOM construction (textContent, no HTML parsing): every value here derives from
        // the hardcoded rows constant in this file — no user-supplied content exists — but we
        // keep it injection-proof by construction anyway.
        const el = document.createElement('button')
        el.type = 'button'
        el.className = `vacation-card ${tier}`
        el.title = `${w.days} free days · clear of: ${why}`
        const mk = (cls, text) => { const sp = document.createElement('span'); sp.className = cls; sp.textContent = text; return sp }
        el.appendChild(mk('v-tier', tier))
        el.appendChild(mk('v-days', `${w.days} days`))
        el.appendChild(mk('v-range', `${fmd(w.from)} → ${fmd(w.to)}`))
        el.appendChild(mk('v-why', why))
        el.onclick = () => scrollToDate(w.from)
        vacationStrip.appendChild(el)
      }
      if (!wins.length) vacationStrip.innerHTML = '<div class="v-empty">No clear windows before end of 2028 — everything overlaps a commitment.</div>'
    }

    // Collapsible vacation section (persists across visits)
    const vacToggle = root.querySelector('#stpVacationToggle')
    const vacBody = root.querySelector('#stpVacationBody')
    if (vacToggle && vacBody) {
      const apply = openState => {
        vacBody.style.display = openState ? '' : 'none'
        vacToggle.setAttribute('aria-expanded', openState ? 'true' : 'false')
        vacToggle.querySelector('.v-caret').textContent = openState ? '\u25be' : '\u25b8'
      }
      let openState = localStorage.getItem('stpVacationOpen') !== '0'
      apply(openState)
      vacToggle.addEventListener('click', () => {
        openState = !openState
        localStorage.setItem('stpVacationOpen', openState ? '1' : '0')
        apply(openState)
      })
    }


    for (const row of rows.filter(r => r.group === 'Capacity')) {
      capacityList.insertAdjacentHTML('beforeend', `<section class="capacity-item"><h3>${row.title}</h3><div class="dates">${fmtLong(row.start)} → ${fmtLong(row.end)}</div><p>${row.detail}</p></section>`)
    }

    // Tabs (timeline / capacity) inside this component
    const tabButtons = [...root.querySelectorAll('.stp-tab-btn')]
    const controlsBar = controlsEl
    const timelineView = wrap
    const capacityView = root.querySelector('#stpCapacityView')
    function setTab(tab) {
      const showTimeline = tab === 'timeline'
      timelineView.classList.toggle('active', showTimeline)
      capacityView.classList.toggle('active', !showTimeline)
      controlsBar.style.display = showTimeline ? 'flex' : 'none'
      for (const b of tabButtons) {
        const active = b.dataset.tab === tab
        b.classList.toggle('active', active)
        b.setAttribute('aria-selected', active ? 'true' : 'false')
      }
    }
    for (const b of tabButtons) b.addEventListener('click', () => setTab(b.dataset.tab))

    // Drag / wheel horizontal scrolling
    let dragging = false, startX = 0, startScroll = 0
    const onDown = e => {
      if (e.button !== 0) return
      dragging = true; startX = e.clientX; startScroll = wrap.scrollLeft
      wrap.classList.add('dragging'); wrap.setPointerCapture?.(e.pointerId)
    }
    const onMove = e => {
      if (!dragging) return
      e.preventDefault(); wrap.scrollLeft = startScroll - (e.clientX - startX)
    }
    const stopDrag = e => { dragging = false; wrap.classList.remove('dragging'); try { wrap.releasePointerCapture?.(e.pointerId) } catch {} }
    wrap.addEventListener('pointerdown', onDown)
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerup', stopDrag)
    wrap.addEventListener('pointerleave', stopDrag)
    const onWheel = e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { wrap.scrollLeft += e.deltaY; e.preventDefault() }
    }
    wrap.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      wrap.removeEventListener('pointerdown', onDown)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerup', stopDrag)
      wrap.removeEventListener('pointerleave', stopDrag)
      wrap.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div ref={hostRef}>
      <div dangerouslySetInnerHTML={{ __html: stpMarkup }} />
    </div>
  )
}
