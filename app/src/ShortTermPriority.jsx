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
      { group: 'French', title: 'Semi-intensive → Intensive → A2', start: '2027-03-01', end: '2028-08-31', tone: 'blue',
        segments: [
          { start: '2027-03-01', end: '2028-02-29', label: 'Semi-intensive', tone: 'neutral', detail: 'Semi-intensive · Mar 2027 → Feb 2028. A2 → B1 consolidation at a sustainable load alongside other priorities.' },
          { start: '2028-03-01', end: '2028-08-31', label: 'Intensive', tone: 'red', detail: 'Intensive · Mar → Aug 2028. Full push to C1-level academic French before the Sorbonne rentrée.' },
        ],
        markerDate: '2028-09-01', markerLabel: 'rentrée',
        detail: 'Language runway into the Sorbonne: semi-intensive year, then intensive pre-university block.' },
      { group: 'French', title: 'Sorbonne · dossier vert', start: '2027-10-01', end: '2028-01-15', tone: 'orange',
        segments: [
          { start: '2027-10-01', end: '2027-12-15', label: 'dossier vert window', tone: 'orange', detail: 'Dossier vert (Parcoursup FSPO gateway) · opens early Oct 2027, portal closes mid-Dec 2027. Cover letter + full file ready by early Dec.' },
          { start: '2028-01-15', end: '2028-01-15', label: 'deadline', tone: 'red', detail: 'Dossier vert deadline · 15 Jan 2028. Last day to apply — hard Parcoursup cut-off.' },
        ],
        detail: 'Dossier vert is the admission route for a French bac equivalent applying to Sorbonne licence from abroad/parcoursup. Window Oct→mid-Dec, deadline mid-Jan.' },
      { group: 'French', title: 'Sorbonne · admission decision', start: '2028-04-15', end: '2028-04-15', tone: 'purple', marker: true, markerDate: '2028-04-15', markerLabel: 'decision',
        detail: 'Sorbonne admission decision · Parcoursup main phase releases answers from 15 Apr 2028 (2028 calendar estimated from the 2025–2026 pattern). Confirm against the official Parcoursup calendar when published.' },
      { group: 'A-level', title: 'P1 P2 P3 P4 S1 M1 M2 prep', start: '2026-05-24', end: '2026-10-08', tone: 'blue',
        markerDate: '2026-10-09', markerLabel: 'exams',
        detail: 'P1 9 Oct, M1 13 Oct, P2 15 Oct, S1 19 Oct, P3 21 Oct, M2 22 Oct, P4 28 Oct' },
      { group: 'A-level', title: 'FP1 FP2 FP3 S2 M3 prep', start: '2026-11-07', end: '2027-01-13', tone: 'purple',
        markerDate: '2027-01-14', markerLabel: 'exams',
        detail: 'FP1 14 Jan, S2 18 Jan, FP2 20 Jan, FP3 21 Jan, M3 25 Jan' },
      { group: 'University', title: 'Sorbonne starts', start: '2028-09-01', marker: true, markerDate: '2028-09-01', tone: 'purple',
        detail: 'University start · Sorbonne, September 2028 (rentrée). French at A2 by Feb 2027 leaves 19 months of runway before it.' },
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
      return `<div class="block ${tone}" style="left:${left}%;width:${width}%"><span>${label}</span><small>${dates}</small>${tip(row.title + (segment.label ? ' · ' + segment.label : ''), `${fmtLong(segment.start)} → ${fmtLong(segment.end)}`, segment.detail || row.detail)}</div>`
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
      ['A1.1', () => scrollToDate('2026-09-01')],
      ['A1.2', () => scrollToDate('2026-11-01')],
      ['A2', () => scrollToDate('2027-01-01')],
      ['dossier', () => scrollToDate('2027-10-01')],
      ['decision', () => scrollToDate('2028-04-15')],
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
