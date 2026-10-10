import { useEffect, useRef } from 'react'
import timelineMarkup from './timelineCitizenshipMarkup.html?raw'
import './InlineTimelineCitizenship.css'

const ROUTE_BANDS = [[2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 15]]

export default function InlineTimelineCitizenship() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const laneBoard = host.querySelector('.lane-board')
    const laneGrid = host.querySelector('.lane-grid')
    const stripScroll = host.querySelector('#relationshipStripScroll')
    const status = host.querySelector('#relationshipCompareStatus')
    const routeButtons = [...host.querySelectorAll('.relationship-route-buttons button')]
    const routeLabels = [...host.querySelectorAll('.lane-label.cit-row')]
    if (!laneBoard || !laneGrid || !stripScroll || !status || routeLabels.length !== 6) return undefined

    const controller = new AbortController()
    const { signal } = controller
    const routeNames = routeLabels.map(label => label.querySelector('.path-name').textContent.trim())

    ;[...laneGrid.children].forEach(element => {
      const row = Number.parseInt(getComputedStyle(element).gridRowStart, 10)
      const index = ROUTE_BANDS.findIndex(([start, end]) => row >= start && row <= end)
      if (index >= 0) element.dataset.routeIndex = String(index)
    })

    function selectRoute(route, scrollToRoute = true) {
      const all = route === 'all'
      const index = all ? -1 : Number(route)
      laneGrid.classList.toggle('route-filter-active', !all)

      ;[...laneGrid.children].forEach(element => {
        const ownsRoute = element.dataset.routeIndex !== undefined
        const selected = ownsRoute && Number(element.dataset.routeIndex) === index
        element.classList.toggle('route-selected', !all && selected)
        element.classList.toggle('route-muted', !all && ownsRoute && !selected)
      })

      routeButtons.forEach(button => {
        const active = button.dataset.route === String(route)
        button.classList.toggle('active', active)
        button.setAttribute('aria-pressed', String(active))
      })
      routeLabels.forEach((label, labelIndex) => label.setAttribute('aria-pressed', String(!all && labelIndex === index)))

      status.textContent = all
        ? 'Axis locked to every education, PhD and citizenship row below · choose a route to compare.'
        : `Comparing ${routeNames[index]} on the same 2024–2048 calendar columns · 1 column = 1 year.`

      if (!all && scrollToRoute) routeLabels[index].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }

    routeButtons.forEach(button => button.addEventListener('click', () => selectRoute(button.dataset.route), { signal }))
    routeLabels.forEach((label, index) => {
      label.setAttribute('role', 'button')
      label.setAttribute('tabindex', '0')
      label.setAttribute('aria-pressed', 'false')
      label.setAttribute('aria-label', `Compare ${routeNames[index]} with the Personal planning heuristic`)
      label.addEventListener('click', () => selectRoute(index, false), { signal })
      label.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          selectRoute(index, false)
        }
      }, { signal })
    })

    let syncing = false
    function syncHorizontal(source, target) {
      if (syncing) return
      syncing = true
      const sourceMax = source.scrollWidth - source.clientWidth
      const targetMax = target.scrollWidth - target.clientWidth
      target.scrollLeft = sourceMax > 0 ? (source.scrollLeft / sourceMax) * targetMax : 0
      requestAnimationFrame(() => { syncing = false })
    }
    stripScroll.addEventListener('scroll', () => syncHorizontal(stripScroll, laneBoard), { passive: true, signal })
    laneBoard.addEventListener('scroll', () => syncHorizontal(laneBoard, stripScroll), { passive: true, signal })

    // ── Sticky year axis: pins the 2024–2048 year row under the sticky comparison box while scrolling ──
    const compareBox = host.querySelector('.relationship-compare')
    const laneYears = [...laneGrid.querySelectorAll('.lane-year')]
    const pageBody = laneBoard.parentElement
    let axisWrap = null
    let axisObserver = null
    if (compareBox && laneYears.length && pageBody) {
      axisWrap = document.createElement('div')
      axisWrap.className = 'lane-axis-sticky'
      axisWrap.setAttribute('aria-hidden', 'true')
      const bar = document.createElement('div')
      bar.className = 'lane-axis-bar'
      const label = document.createElement('div')
      label.className = 'lane-axis-label'
      label.textContent = 'YEAR'
      const viewport = document.createElement('div')
      viewport.className = 'lane-axis-viewport'
      const years = document.createElement('div')
      years.className = 'lane-axis-years'
      const now = new Date().getFullYear()
      laneYears.forEach(cell => {
        const y = document.createElement('div')
        y.className = 'lane-axis-year'
        y.textContent = cell.textContent.trim()
        if (Number(y.textContent) === now) y.classList.add('is-now')
        years.appendChild(y)
      })
      viewport.appendChild(years)
      bar.append(label, viewport)
      axisWrap.appendChild(bar)
      pageBody.insertBefore(axisWrap, laneBoard)

      const layout = () => {
        const cols = getComputedStyle(laneGrid).gridTemplateColumns.split(' ').map(parseFloat).filter(n => !Number.isNaN(n))
        const gap = parseFloat(getComputedStyle(laneGrid).columnGap) || 0
        const bs = getComputedStyle(laneBoard)
        const padL = parseFloat(bs.paddingLeft) + parseFloat(bs.borderLeftWidth)
        const padR = parseFloat(bs.paddingRight) + parseFloat(bs.borderRightWidth)
        axisWrap.style.top = `${compareBox.offsetHeight}px`
        bar.style.left = `${padL}px`
        bar.style.width = `${laneBoard.offsetWidth - padL - padR}px`
        label.style.width = `${cols[0] + gap}px`
        years.style.gridTemplateColumns = cols.slice(1).map(c => `${c}px`).join(' ')
        years.style.columnGap = `${gap}px`
        syncAxis()
      }
      const syncAxis = () => {
        const firstYear = laneYears[0].getBoundingClientRect()
        years.style.transform = `translateX(${firstYear.left - viewport.getBoundingClientRect().left}px)`
        const pinTop = compareBox.getBoundingClientRect().bottom
        const gridBottom = laneGrid.getBoundingClientRect().bottom
        const show = firstYear.top < pinTop && gridBottom > pinTop + bar.offsetHeight + 20
        axisWrap.classList.toggle('is-visible', show)
      }
      window.addEventListener('scroll', syncAxis, { passive: true, signal })
      laneBoard.addEventListener('scroll', syncAxis, { passive: true, signal })
      window.addEventListener('resize', layout, { signal })
      axisObserver = new ResizeObserver(layout)
      axisObserver.observe(compareBox)
      axisObserver.observe(laneGrid)
      layout()
    }

    return () => {
      controller.abort()
      if (axisObserver) axisObserver.disconnect()
      if (axisWrap) axisWrap.remove()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className="inline-timeline-host"
      // Trusted static markup migrated from the restored historical UI; no user input.
      dangerouslySetInnerHTML={{ __html: timelineMarkup }}
    />
  )
}
