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
    const TODAY = '2026-05-24'
    const START = '2026-05-24'
    const END = '2028-12-31'

    const rows = [
      { group: 'Capacity', title: 'Raw study capacity', start: '2026-05-24', end: '2027-01-25', tone: 'green', detail: 'Baseline schedule: weekdays 9-11 = 10h/week; Sat 9-13 = 4h; Sun 9-13 = 4h. Total 18h/week = about 78h/month. From 24 May to Oct 8 = 354h; to Oct 30 = 410h; Nov 1 to Jan 25 = 222h; 24 May to Jan 25 = 636h.' },
      { group: 'Capacity', title: 'Oct exam workload check', start: '2026-05-24', end: '2026-10-08', tone: 'blue', detail: 'Default Oct split: P1 P2 P3 P4 M1 S1 M2 plus Physics Units 1-3 = 10 units. Content estimate 112-118h. With 3/4/5/6 papers per unit: total 202-208h / 232-238h / 262-268h / 292-298h. Against 354h before first Oct exam: enough, with 56-146h leftover depending paper target.' },
      { group: 'Capacity', title: 'Jan exam workload check', start: '2026-11-01', end: '2027-01-25', tone: 'purple', detail: 'Default Jan split: FP1 FP2 FP3 S2 M3 plus Physics Units 4-6 = 8 units. Content estimate 84-90h. With 3/4/5/6 papers per unit: total 156-162h / 180-186h / 204-210h / 228-234h. Against 222h from Nov 1 to Jan 25: 3-5 papers/unit fits; 6 needs preloading before October ends.' },
      { group: 'Capacity', title: 'English + French option', start: '2026-05-24', end: '2027-01-25', tone: 'neutral', detail: 'If English = 2h/week and French = 2.5h/week, languages take 4.5h/week = about 19.5h/month. A-level protected time drops from 18h/week to 13.5h/week. By Oct 30 this spends about 102h on languages; by Jan 25 about 158h. OK only as maintenance/light progress.' },
      { group: 'Capacity', title: 'French-only option', start: '2026-05-24', end: '2027-01-25', tone: 'green', detail: 'French only at 2.5h/week leaves 15.5h/week for A-levels. French gets about 10.8h/month, 56.8h by Oct 30, and 87.9h by Jan 25. Safer while A-levels are priority. If using the full 4.5h/week only for French, French gets about 158h by Jan 25.' },
      { group: 'Accent', title: 'Accent class', start: '2026-05-24', end: '2026-12-31', tone: 'green', detail: 'Accent class · now → end Dec' },
      { group: 'Physics', title: 'Physics prep', start: '2026-05-24', end: '2027-01-10', tone: 'orange', detail: 'Physics prep', markerDate: '2027-01-11', markerLabel: 'exams' },
      { group: 'Registration', title: 'A-level registration TBC', start: '2026-08-29', end: '2026-08-29', tone: 'blue', marker: true, markerLabel: 'TBC', detail: 'Pearson 2026/27 official entry deadline not published here yet; centre may set earlier deadline' },
      { group: 'Registration', title: 'ESAT booking closes', start: '2026-09-28', end: '2026-09-28', tone: 'red', marker: true, markerLabel: 'closes', detail: 'Official UAT-UK October booking deadline: 28 Sep 2026, 6pm BST' },
      { group: 'Admissions', title: 'Oxford/Cambridge UCAS deadline', start: '2026-10-15', end: '2026-10-15', tone: 'red', marker: true, markerLabel: 'UCAS', detail: '2027 entry: Oxford and Cambridge UCAS application deadline is 15 Oct 2026, 18:00 UK time.' },
      { group: 'Admissions', title: 'My Cambridge Application', start: '2026-10-22', end: '2026-10-22', tone: 'purple', marker: true, markerLabel: 'MCA', detail: 'Cambridge-specific form deadline for most undergraduate applicants: 22 Oct 2026, 18:00 UK time.' },
      { group: 'Admissions', title: 'Cambridge interview window', start: '2026-12-01', end: '2026-12-21', tone: 'purple', detail: 'Most Cambridge College interviews take place in the first 3 weeks of Dec 2026. Invites mostly arrive in Nov, some early Dec. Outcome for main interview period: 27 Jan 2027.', markerDate: '2027-01-27', markerLabel: 'decision' },
      { group: 'Admissions', title: 'General UCAS / Imperial deadline', start: '2027-01-13', end: '2027-01-13', tone: 'red', marker: true, markerLabel: 'UCAS', detail: 'General UCAS equal-consideration deadline for most 2027 entry undergraduate courses: 13 Jan 2027, 18:00 UK time. This is also the Imperial Physics/Theoretical Physics equal-consideration deadline; later applications are not guaranteed equal consideration.' },
      { group: 'Admissions', title: 'Imperial interview window', start: '2026-11-01', end: '2027-02-28', tone: 'blue', detail: 'Imperial says undergraduate interviews usually take place between Nov and Feb if shortlisted. Physics/Theoretical Physics also uses ESAT as part of selection; decisions are aimed by end Mar 2027.', markerDate: '2027-03-31', markerLabel: 'decision aim' },
      { group: 'A-level', title: 'P1 P2 P3 P4 S1 M1 M2 prep', start: '2026-05-24', end: '2026-10-08', tone: 'blue', detail: 'P1 9 Oct, M1 13 Oct, P2 15 Oct, S1 19 Oct, P3 21 Oct, M2 22 Oct, P4 28 Oct', markerDate: '2026-10-09', markerLabel: 'exams' },
      { group: 'A-level', title: 'FP1 FP2 FP3 S2 M3 prep', start: '2026-11-07', end: '2027-01-13', tone: 'purple', detail: 'FP1 14 Jan, S2 18 Jan, FP2 20 Jan, FP3 21 Jan, M3 25 Jan', markerDate: '2027-01-14', markerLabel: 'exams' },
      { group: 'ESAT', title: 'ESAT Math prep', start: '2026-05-24', end: '2026-10-11', tone: 'red', detail: 'ESAT Mathematics prep · official test window 12-16 Oct 2026', markerDate: '2026-10-12', markerLabel: 'test' },
      { group: 'ESAT', title: 'ESAT Physics prep', start: '2026-06-15', end: '2026-10-11', tone: 'orange', detail: 'ESAT Physics prep · mid-June → test window', markerDate: '2026-10-12', markerLabel: 'test' },
      { group: 'IELTS', title: 'IELTS prep', start: '2026-12-01', end: '2027-05-31', tone: 'green', detail: 'IELTS prep · start Dec → end May' },
      { group: 'Life', title: 'French', start: '2026-05-24', end: '2027-05-31', tone: 'neutral', detail: 'French maintenance · low daily load, protect Oct/Jan exam weeks' },
      { group: 'Life', title: 'Automatic driving', start: '2026-07-01', end: '2026-11-30', tone: 'orange', detail: 'Automatic chill path · Jul-Sep lessons, hard pause through Oct exams, resume Nov; ~17-18h total at 1h/week', segments: [ { start: '2026-07-01', end: '2026-09-30', label: 'lessons', dates: 'Jul → Sep' }, { start: '2026-11-01', end: '2026-11-30', label: 'finish', dates: 'Nov' } ], pauses: [ { start: '2026-10-01', end: '2026-10-31', label: 'pause · exams' } ] },
      { group: 'Life', title: 'Swim', start: '2027-02-01', end: '2027-05-31', tone: 'blue', detail: 'Swim chill path · Feb-May gives ~16-18 weekly sessions' },
      { group: 'Housing', title: 'New apartment search', start: '2027-01-07', end: '2027-03-07', tone: 'purple', detail: 'Verified in Drive: current Paris Attitude #8482 lease at 43 Ave Jean Jaurès runs 07 Mar 2026 → 07 Mar 2027. Sep date found is the OLD Houilles lease anniversary, not the current Paris apartment.', segments: [ { start: '2027-01-07', end: '2027-01-13', label: 'scout', dates: 'from 7 Jan' }, { start: '2027-01-26', end: '2027-03-07', label: 'search + move', dates: '26 Jan → 7 Mar' } ], pauses: [ { start: '2027-01-14', end: '2027-01-25', label: 'pause · Jan exams' } ], markerDate: '2027-03-07', markerLabel: 'lease ends' },
      { group: 'Admin', title: 'French permit renewal', start: '2027-03-09', end: '2027-05-09', tone: 'red', detail: 'Assuming permit expires 9 Jul 2027: renewal window opens ~4 months before; submit by ~9 May at latest', markerDate: '2027-07-09', markerLabel: 'expires' },
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
      const dates = segment.dates || `${fmt(segment.start)} → ${fmt(segment.end)}`
      return `<div class="block ${row.tone}" style="left:${left}%;width:${width}%"><span>${label}</span><small>${dates}</small>${tip(row.title + (segment.label ? ' · ' + segment.label : ''), `${fmtLong(segment.start)} → ${fmtLong(segment.end)}`, row.detail)}</div>`
    }

    function pause(p) {
      const left = pctAt(p.start)
      const width = Math.max(1.2, pctAt(p.end) - left)
      return `<div class="pause" style="left:${left}%;width:${width}%"><span>${p.label}</span>${tip(p.label, `${fmtLong(p.start)} → ${fmtLong(p.end)}`, 'Protected blank break — no scheduling here.')}</div>`
    }

    for (const m of months()) {
      axis.insertAdjacentHTML('beforeend', `<div class="tick ${m.year ? 'year' : ''}" style="left:${pctAt(m.date)}%"><span>${m.label}</span></div>`)
      lines.insertAdjacentHTML('beforeend', `<span style="left:${pctAt(m.date)}%"></span>`)
    }
    axis.insertAdjacentHTML('beforeend', `<div class="today-line" style="left:${pctAt(TODAY)}%"><span>today · ${fmt(TODAY)}</span></div>`)
    lines.insertAdjacentHTML('beforeend', `<span class="today" style="left:${pctAt(TODAY)}%"></span>`)

    for (const row of rows.filter(r => r.group !== 'Capacity')) {
      const content = row.marker
        ? marker(row, row.start, row.markerLabel || fmt(row.start), row.tone)
        : `${(row.segments || [row]).map(s => block(row, s)).join('')}${(row.pauses || []).map(pause).join('')}${row.markerDate ? marker(row, row.markerDate, row.markerLabel || fmt(row.markerDate), row.tone, row.markerLabel || row.title) : ''}`
      grid.insertAdjacentHTML('beforeend', `<div class="row"><div class="row-label"><div class="group">${row.group}</div><div class="name">${row.title}</div></div><div class="track">${content}</div></div>`)
    }

    const scrollToDate = (date) => {
      const canvas = root.querySelector('.timeline-canvas')
      const target = (pctAt(date) / 100) * canvas.scrollWidth
      wrap.scrollTo({ left: Math.max(0, target - wrap.clientWidth * 0.24), behavior: 'smooth' })
    }

    const controls = [
      ['←', () => wrap.scrollBy({ left: -Math.round(wrap.clientWidth * .8), behavior: 'smooth' })],
      ['Today', () => scrollToDate(TODAY)],
      ['Oct exams', () => scrollToDate('2026-10-01')],
      ['Admissions', () => scrollToDate('2026-10-15')],
      ['Jan exams', () => scrollToDate('2027-01-01')],
      ['Housing', () => scrollToDate('2027-03-01')],
      ['Permit', () => scrollToDate('2027-07-09')],
      ['2028', () => scrollToDate('2028-01-01')],
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
