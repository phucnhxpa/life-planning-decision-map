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
      { group: 'French · intensive', title: 'Intensive A1 → B2', start: '2026-09-01', end: '2027-05-31', tone: 'blue',
        segments: [
          { start: '2026-09-01', end: '2026-10-31', label: 'A1 → A2', tone: 'green', detail: 'A1.1 + A1.2 · Sep → Oct 2026, intensive (20h/week). A2 reached end of Oct — matches the A1.1/A1.2 plan blocks above.' },
          { start: '2026-11-01', end: '2026-12-31', label: 'A2 → B1', tone: 'blue', detail: 'A2.1 + A2.2 · Nov → Dec 2026, intensive. B1 entered January 2027.' },
          { start: '2027-01-01', end: '2027-05-31', label: 'B1 → B2', tone: 'purple', detail: 'B1.1 + B1.2 + B2.1–B2.3 · Jan → May 2027, intensive. B2.3 complete 31 May 2027.' },
        ],
        marker: true, markerDate: '2027-05-31', markerLabel: 'B2 done',
        detail: 'Intensive path A1 → B2: AF staircase 1 sub-level/month at 20h/week (A1: 2, A2: 2, B1: 2, B2: 3 months = 9 months). Sep 1 2026 → B2 done 31 May 2027.' },
      // ── FRENCH · SEMI-INTENSIVE A1 → B2 (A1→A2 intensive, then A2→B1 and B1→B2 semi-intensive) ──
      { group: 'French · semi-intensive', title: 'Semi A1 → B2', start: '2026-09-01', end: '2027-12-31', tone: 'teal',
        segments: [
          { start: '2026-09-01', end: '2026-10-31', label: 'A1 → A2', tone: 'green', detail: 'A1.1 + A1.2 · Sep → Oct 2026 — the only intensive stretch of this path (20h/week), identical to the personal plan.' },
          { start: '2026-11-01', end: '2027-02-28', label: 'A2 → B1 · semi', tone: 'blue', detail: 'A2.3–A2.x + B1 sub-levels · Nov 2026 → Feb 2027, semi-intensive (9h/week, Mon/Tue/Thu). Slower: ~4 months for the A2→B1 span.' },
          { start: '2027-03-01', end: '2027-12-31', label: 'B1 → B2 · semi', tone: 'purple', detail: 'B1.1–B1.4 · Mar → Jun 2027, then B2.1–B2.6 · Jul → Dec 2027, all semi-intensive. B2 complete 31 Dec 2027 — 6 weeks before TCF DAP last chance 13 Feb 2028.' },
        ],
        marker: true, markerDate: '2027-12-31', markerLabel: 'B2 done',
        detail: 'Semi-intensive path: A1 → A2 intensive (Sep–Oct 2026), then A2 → B1 semi (Nov 2026 – Feb 2027) and B1 → B2 semi (Mar – Dec 2027). B2 done 31 Dec 2027. AF semi chart: B1 = 4 sessions, B2 = 6 sessions, 1 session = 4 weeks at 9h/week.' },
      // ── FRENCH UNIVERSITY ──
      { group: 'French university', title: 'French B2 · TCF', rowLabel: 'French B2 · TCF DAP submission', start: '2027-11-15', end: '2028-02-13', tone: 'orange',
        markers: [
          { date: '2027-12-15', label: 'TCF reg' },
          { date: '2028-02-13', label: 'TCF DAP last' },
        ],
        detail: 'French B2 proof for dossier vert: TCF DAP online registration closes 15 Dec 2027 (ministry délai de rigueur); absolute last pass 13 Feb 2028 — results precede the 16 Mar commissions. No retake after that (30-day gap rule). Source: Admission Reference 2028 Intake PDF.' },
      { group: 'French university', title: 'A-level submission', start: '2028-01-05', end: '2028-03-31', tone: 'blue',
        markers: [
          { date: '2028-03-05', label: 'results' },
          { date: '2028-03-31', label: 'certificates' },
        ],
        detail: 'A-levels for the dossier: last usable sitting is the January 2028 series (exams 5–25 Jan). Results ~5 Mar 2028, certificates by ~31 Mar 2028 — in the file before decisions. Anything later is too late.' },
      { group: 'French university', title: 'Application', rowLabel: 'Application · apply → decision → year starts', start: '2027-11-15', end: '2028-09-01', tone: 'red',
        markers: [
          { date: '2028-01-15', label: 'last day to apply' },
          { date: '2028-04-30', label: 'decision day' },
          { date: '2028-09-01', label: 'school year' },
        ],
        deadline: '2028-01-15',
        detail: 'Dossier vert application: last day to apply 15 Jan 2028 (Sorbonne faculty outer edge; ministry target 15 Dec 2027). Decision day 30 Apr 2028 — all three dossier-vert universities respond; accept by 31 May or auto-refusal. School year starts 1 Sep 2028.' },
      // ── CAMBRIDGE / IMPERIAL ──
      { group: 'Cambridge/Imperial', title: 'A-level', rowLabel: 'A-level · exams & results', start: '2026-05-24', end: '2027-01-25', tone: 'blue',
        markers: [
          { date: '2026-10-09', label: 'Oct exams' },
          { date: '2027-01-14', label: 'Jan exams' },
        ],
        detail: 'A-level sittings feeding the 2028-entry UCAS file: Oct 2026 series (P1 9 Oct, M1 13 Oct, P2 15 Oct, S1 19 Oct, P3 21 Oct, M2 22 Oct, P4 28 Oct) and Jan 2027 series (FP1 14 Jan, S2 18 Jan, FP2 20 Jan, FP3 21 Jan, M3 25 Jan).' },
      { group: 'Cambridge/Imperial', title: 'ESAT', rowLabel: 'ESAT · booking & test', start: '2026-09-28', end: '2026-10-16', tone: 'orange',
        blockLabel: 'ESAT',
        markers: [
          { date: '2026-09-28', label: 'booking closes' },
          { date: '2026-10-12', label: 'test window' },
        ],
        detail: 'ESAT (Cambridge + Imperial Physics/Theoretical Physics): official UAT-UK booking closes 28 Sep 2026, 6pm BST; test window opens 12 Oct 2026. Math + Physics prep rows feed this.' },
      { group: 'Cambridge/Imperial', title: 'Application', rowLabel: 'Application · deadline → interview → decision', start: '2027-09-05', end: '2028-03-31', tone: 'red',
        markers: [
          { date: '2027-10-15', label: 'deadline to apply' },
          { date: '2027-12-01', label: 'interviews' },
          { date: '2028-01-27', label: 'decision day' },
        ],
        deadline: '2027-10-15',
        detail: 'One UCAS form covers Oxford/Cambridge/Imperial: deadline to apply 15 Oct 2027, 18:00 UK (MCA Cambridge extra form 22 Oct). Cambridge interviews first 3 weeks of Dec 2027; Imperial interviews Nov 2027 – Feb 2028. Cambridge decision 27 Jan 2028; Imperial decisions aimed by 31 Mar 2028.' },
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
      if ((row.admissions || (row.group || '').startsWith('French university') || (row.group || '').startsWith('Cambridge/Imperial')) && !dividerDone) {
        grid.insertAdjacentHTML('beforeend', `<div class="section-divider"><div class="section-title">University deadlines \u2014 verified against the Admission Reference PDF</div><div class="section-sub">French: apply 15 Jan \u2192 TCF DAP 13 Feb \u2192 decision 30 Apr \u00b7 UK: UCAS 15 Oct 2027 \u2192 decision Jan\u2013Mar 2028 \u00b7 % left = live runway</div></div>`)
        dividerDone = true
      }
      resetLabels()
      const cls = row.admissions ? ' row admissions-section' : ''
      const dl = row.deadline || row.end || row.markerDate
      const pctV = dl ? pctLeft(dl) : null
      const pctBadge = pctV !== null
        ? `<span class="pct-left ${pctTone(pctV)}" title="Runway left: from 1 Oct 2026 to ${fmtLong(dl)}">${pctV.toFixed(1)}% left</span>`
        : ''
      const extra = (row.markers || []).map(m => marker(row, m.date, m.label, m.tone || row.tone, m.label)).join('')
      const content = row.marker && !row.segments
        ? marker(row, row.start, row.markerLabel || fmt(row.start), row.tone) + extra
        : row.progress
          ? progressBlock(row) + (row.markerDate ? marker(row, row.markerDate, row.markerLabel || 'B2', row.tone, row.markerLabel || row.title) : '') + extra
          : `${(row.segments || [row]).map(s => block(row, s)).join('')}${(row.pauses || []).map(pause).join('')}${row.markerDate ? marker(row, row.markerDate, row.markerLabel || fmt(row.markerDate), row.tone, row.markerLabel || row.title) : ''}` + extra
      grid.insertAdjacentHTML('beforeend', `<div class="row${cls}"><div class="row-label"><div class="group">${row.group}</div><div class="name">${row.rowLabel || row.title}</div></div><div class="track">${content}</div>${pctBadge}</div>`)
    }

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
      ['UCAS', () => scrollToDate('2027-10-15')],
      ['rentrée', () => scrollToDate('2028-09-01')],
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
