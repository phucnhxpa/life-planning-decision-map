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

    return () => controller.abort()
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
