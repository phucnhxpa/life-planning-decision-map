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
      { group: 'French', title: 'A1.1 → A2 progression', start: '2026-09-01', end: '2027-02-28', tone: 'green',
        segments: [
          { start: '2026-09-01', end: '2026-10-31', label: 'A1.1', tone: 'green', detail: 'A1.1 · Sep 1 → Oct 31 2026. Alphabet, numbers, greetings, basic present-tense sentences.' },
          { start: '2026-11-01', end: '2026-12-31', label: 'A1.2', tone: 'blue', detail: 'A1.2 · Nov 1 → Dec 31 2026. Daily-life vocabulary, simple exchanges, present + near future.' },
          { start: '2027-01-01', end: '2027-02-28', label: 'A2', tone: 'purple', detail: 'A2 · Jan 1 → Feb 28 2027. Past tenses, everyday situations, short connected text.' },
        ],
        detail: 'French CEFR progression: A1.1 (Sep–Oct) → A1.2 (Nov–Dec) → A2 (Jan–Feb).' },
      { group: 'French · AF intensive reference', title: 'Alliance Française — intensive pace', start: '2026-09-01', end: '2027-05-31', tone: 'blue',
        segments: [
          { start: '2026-09-01', end: '2026-09-30', label: 'A1.1', tone: 'green', detail: 'AF intensive month 1 · A1.1 — 20h/week. Source: alliancefr.org intensive course progression (1 sub-level = 1 month).' },
          { start: '2026-10-01', end: '2026-10-31', label: 'A1.2', tone: 'green', detail: 'AF intensive month 2 · A1.2. Cumulative: 2/9 months (22%) of the AF staircase to B2.3.' },
          { start: '2026-11-01', end: '2026-11-30', label: 'A2.1', tone: 'blue', detail: 'AF intensive month 3 · A2.1. Cumulative: 3/9 (33%).' },
          { start: '2026-12-01', end: '2026-12-31', label: 'A2.2', tone: 'blue', detail: 'AF intensive month 4 · A2.2 — A2 complete. Cumulative: 4/9 (44%).' },
          { start: '2027-01-01', end: '2027-01-31', label: 'B1.1', tone: 'teal', detail: 'AF intensive month 5 · B1.1. Cumulative: 5/9 (56%).' },
          { start: '2027-02-01', end: '2027-02-28', label: 'B1.2', tone: 'teal', detail: 'AF intensive month 6 · B1.2 — B1 complete. Cumulative: 6/9 (67%).' },
          { start: '2027-03-01', end: '2027-03-31', label: 'B2.1', tone: 'purple', detail: 'AF intensive month 7 · B2.1. Cumulative: 7/9 (78%).' },
          { start: '2027-04-01', end: '2027-04-30', label: 'B2.2', tone: 'purple', detail: 'AF intensive month 8 · B2.2. Cumulative: 8/9 (89%).' },
          { start: '2027-05-01', end: '2027-05-31', label: 'B2.3', tone: 'purple', detail: 'AF intensive month 9 · B2.3 — B2 COMPLETE. Reference staircase from alliancefr.org intensive in-person course.' },
        ],
        marker: true, markerDate: '2027-05-31', markerLabel: 'B2 done',
        detail: 'Alliance Française official intensive staircase (A1.1→A1.2→A2.1→A2.2→B1.1→B1.2→B2.1→B2.2→B2.3, 1 month each = 9 months). Anchored at the real Sep 1 2026 start → B2 complete 31 May 2027. Continuous reference pace, not a commitment.' },
      { group: 'French · AF intensive reference', title: 'Progress to B2 (continuous)', start: '2026-09-01', end: '2027-05-31', tone: 'teal',
        progress: true, progressLabel: '→ B2',
        detail: 'Continuous fill: 0% on Sep 1 2026 → 100% (B2.3 complete) on 31 May 2027, filling linearly at the AF intensive pace. The bar keeps growing past A2 even though the personal plan (row above) stops at A2 in Feb.' },
      { group: 'University', title: 'Sorbonne administrative', start: '2028-09-01', marker: true, markerDate: '2028-09-01', tone: 'purple',
        detail: 'Sorbonne administrative · September 2028 (rentrée). French at A2 by Feb 2027 leaves 19 months of runway before it.' },
      { group: 'Sorbonne 2028 · Dossier vert', title: 'TCF DAP online registration closes', start: '2027-12-15', marker: true, markerDate: '2027-12-15', markerLabel: 'TCF reg', tone: 'red',
        detail: 'TCF DAP online registration at France Éducation international closes 15 Dec 2027, 23:59 French time (annual cycle date). After this, only an approved centre until 13 Feb 2028. Source: Sorbonne Licence Physique Admission Reference 2028 Intake [5][8].' },
      { group: 'Sorbonne 2028 · Dossier vert', title: 'Dossier vert — ministry deadline (postal)', start: '2027-12-15', marker: true, markerDate: '2027-12-15', markerLabel: 'ministry', tone: 'red',
        detail: 'Ministry délai de rigueur: 15 December 2027, postal stamp counts. The conservative true target — preserves the university TCF session window. Same day as TCF reg close.' },
      { group: 'Sorbonne 2028 · Dossier vert', title: 'A-level Jan 2028 series', start: '2028-01-05', end: '2028-01-25', tone: 'blue', markerDate: '2028-03-05', markerLabel: 'results ~5 Mar',
        detail: 'LAST exam sitting that works. Results ~5 Mar 2028, certificates by ~Mar 2028 — both land before the 30 Apr 2028 decisions, so the file completes just in time. May/June 2028 series = too late. One bad paper and there is no second chance.' },
      { group: 'Sorbonne 2028 · Dossier vert', title: 'Dossier vert — Sorbonne Sciences email deadline', start: '2028-01-15', marker: true, markerDate: '2028-01-15', markerLabel: 'faculty', tone: 'red',
        detail: 'Sorbonne Sciences faculty’s own stated DAP reception deadline: 15 January 2028 — the true last date the faculty documents accept. Sworn translations + certificates must be in the envelope by this date.' },
      { group: 'Sorbonne 2028 · Dossier vert', title: 'TCF DAP absolute latest (approved centre)', start: '2028-02-13', marker: true, markerDate: '2028-02-13', markerLabel: 'TCF last', tone: 'red',
        detail: 'Last possible TCF DAP pass: 13 February 2028 at an approved centre — results out ~2 weeks later, just before the 16 Mar commissions. No fallback: a retake needs a 30-day gap, which lands past the commissions.' },
      { group: 'Sorbonne 2028 · Dossier vert', title: 'Pedagogical commissions begin', start: '2028-03-16', marker: true, markerDate: '2028-03-16', markerLabel: 'commissions', tone: 'purple',
        detail: 'Commissions begin 16 March 2028 (annual pattern). All marks, certificates and TCF results must already be in the file by then.' },
      { group: 'Sorbonne 2028 · Decisions', title: 'Universities respond by', start: '2028-04-30', marker: true, markerDate: '2028-04-30', markerLabel: 'decision', tone: 'purple',
        detail: 'All three dossier-vert universities respond by 30 April 2028 at the latest.' },
      { group: 'Sorbonne 2028 · Decisions', title: 'Accept deadline — silence = refusal', start: '2028-05-31', marker: true, markerDate: '2028-05-31', markerLabel: 'accept', tone: 'purple',
        detail: 'Candidate acceptance deadline 31 May 2028. Silence after 1 June = automatic refusal.' },
      { group: 'Sorbonne 2028 · Post-acceptance', title: 'Admin registration closes', start: '2028-09-30', marker: true, markerDate: '2028-09-30', markerLabel: 'reg closes', tone: 'blue',
        detail: 'Licence administrative registration closes 30 September 2028. Opens ~July; CVEC must be paid before registering. Titre de séjour renewal is on its own schedule: file 120–60 days before permit expiry — not tied to this cycle.' },
      { group: 'Cambridge 2028 · Registration', title: 'ESAT booking closes', admissions: true, deadline: '2027-09-28', start: '2027-09-28', marker: true, markerDate: '2027-09-28', markerLabel: 'closes', tone: 'red',
        detail: '2028 entry: official UAT-UK October booking deadline, expected 28 Sep 2027, 6pm BST (2027-entry cycle closed 28 Sep 2026 — same annual pattern; confirm when UAT-UK publishes the 2028 cycle).' },
      { group: 'Cambridge 2028 · Admissions', title: 'Oxford/Cambridge UCAS deadline', admissions: true, deadline: '2027-10-15', start: '2027-10-15', marker: true, markerDate: '2027-10-15', markerLabel: 'UCAS', tone: 'red',
        detail: '2028 entry: Oxford and Cambridge UCAS application deadline is 15 Oct 2027, 18:00 UK time — same annual date, one year later than the 2027-entry cycle.' },
      { group: 'Cambridge 2028 · Admissions', title: 'My Cambridge Application', admissions: true, deadline: '2027-10-22', start: '2027-10-22', marker: true, markerDate: '2027-10-22', markerLabel: 'MCA', tone: 'purple',
        detail: 'Cambridge-specific form deadline for most 2028-entry undergraduate applicants: 22 Oct 2027, 18:00 UK time.' },
      { group: 'Cambridge 2028 · Admissions', title: 'General UCAS / Imperial deadline', admissions: true, deadline: '2028-01-13', start: '2028-01-13', marker: true, markerDate: '2028-01-13', markerLabel: 'UCAS', tone: 'red',
        detail: 'General UCAS equal-consideration deadline for most 2028-entry undergraduate courses: expected 13 Jan 2028, 18:00 UK time. Also the Imperial Physics/Theoretical Physics equal-consideration deadline; later applications are not guaranteed equal consideration.' },
      { group: 'Cambridge 2028 · Admissions', title: 'Imperial interview window', admissions: true, deadline: '2028-02-28', start: '2027-11-01', end: '2028-02-28', tone: 'blue',
        markerDate: '2028-03-31', markerLabel: 'decision aim',
        detail: 'Imperial interviews for 2028 entry usually run Nov 2027 – Feb 2028 if shortlisted; Physics/Theoretical Physics uses ESAT in selection; decisions aimed by end Mar 2028 (annual pattern).' },
      { group: 'Cambridge 2028 · Admissions', title: 'Cambridge interview window', admissions: true, deadline: '2027-12-21', start: '2027-12-01', end: '2027-12-21', tone: 'purple',
        markerDate: '2028-01-27', markerLabel: 'decision',
        detail: 'Most Cambridge College interviews for 2028 entry take place in the first 3 weeks of Dec 2027. Invites mostly arrive in Nov 2027, some early Dec. Outcome for the main interview period: ~27 Jan 2028 (annual pattern; confirm when Cambridge publishes the 2028 cycle).' },
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

    function marker(row, date, label, tone, detailTitle = row.title) {
      return `<div class="marker ${tone}" style="left:${pctAt(date)}%"><span class="marker-line"></span><span class="marker-dot"></span><span class="marker-label">${label}</span>${tip(detailTitle, fmtLong(date), row.detail)}</div>`
    }

    function block(row, segment = row) {
      const left = pctAt(segment.start)
      const width = Math.max(1.2, pctAt(segment.end) - left)
      const label = segment.label || row.title
      const tone = segment.tone || row.tone
      const dates = segment.dates || `${fmt(segment.start)} → ${fmt(segment.end)}`
      const showDates = width >= 6 // short bars: drop in-bar date text so end markers stay readable
      return `<div class="block ${tone}" style="left:${left}%;width:${width}%"><span>${label}</span>${showDates ? `<small>${dates}</small>` : ''}${tip(row.title + (segment.label ? ' · ' + segment.label : ''), `${fmtLong(segment.start)} → ${fmtLong(segment.end)}`, segment.detail || row.detail)}</div>`
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
      // Live share of the runway [1 Oct 2026 -> deadline] still remaining, real clock, 1 decimal.
      const dl = new Date(deadline + 'T23:59:59').getTime()
      const rs = new Date(RUNWAY_START + 'T00:00:00').getTime()
      const now = Date.now()
      const val = ((dl - now) / (dl - rs)) * 100
      return Math.max(0, val)
    }
    function pctTone(v) { return v <= 15 ? 'crit' : v <= 40 ? 'warn' : '' }
    let dividerDone = false
    for (const row of rows.filter(r => r.group !== 'Capacity')) {
      if ((row.admissions || (row.group || '').startsWith('Sorbonne 2028')) && !dividerDone) {
        grid.insertAdjacentHTML('beforeend', `<div class="section-divider"><div class="section-title">Sorbonne 2028 \u00b7 dossier vert \u2014 verified against the Admission Reference PDF</div><div class="section-sub">Hard walls: dossier vert 15 Jan \u2192 TCF DAP 13 Feb \u2192 accept 31 May \u00b7 % left = live runway</div></div>`)
        dividerDone = true
      }
      const cls = row.admissions ? ' row admissions-section' : ''
      const dl = row.deadline || row.end || row.markerDate
      const pctV = dl ? pctLeft(dl) : null
      const pctBadge = pctV !== null
        ? `<span class="pct-left ${pctTone(pctV)}" title="Runway left: from 1 Oct 2026 to ${fmtLong(dl)}">${pctV.toFixed(1)}% left</span>`
        : ''
      const content = row.marker && !row.segments
        ? marker(row, row.start, row.markerLabel || fmt(row.start), row.tone)
        : row.progress
          ? progressBlock(row) + (row.markerDate ? marker(row, row.markerDate, row.markerLabel || 'B2', row.tone, row.markerLabel || row.title) : '')
          : `${(row.segments || [row]).map(s => block(row, s)).join('')}${(row.pauses || []).map(pause).join('')}${row.markerDate ? marker(row, row.markerDate, row.markerLabel || fmt(row.markerDate), row.tone, row.markerLabel || row.title) : ''}`
      grid.insertAdjacentHTML('beforeend', `<div class="row${cls}"><div class="row-label"><div class="group">${row.group}</div><div class="name">${row.title}</div></div><div class="track">${content}</div>${pctBadge}</div>`)
    }

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
      ['Cambridge', () => scrollToDate('2027-10-15')],
      ['Sorbonne', () => scrollToDate('2028-09-01')],
      ['→', () => wrap.scrollBy({ left: Math.round(wrap.clientWidth * .8), behavior: 'smooth' })],
    ]
    for (const [label, fn] of controls) {
      const b = document.createElement('button')
      b.type = 'button'; b.textContent = label; b.onclick = fn
      controlsEl.appendChild(b)
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
