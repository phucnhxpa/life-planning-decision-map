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

    // ── Path visibility sidebar (like the priority tab) ──
    const sidebar = host.querySelector('#citSidebar')
    const pathList = host.querySelector('#citPathList')
    const showAllBtn = host.querySelector('#citShowAll')
    if (sidebar && pathList && showAllBtn) {
      const GROUPS = [
        { label: 'UK paths', idx: [0, 1], tone: '#2f6fd8' },
        { label: 'France paths', idx: [2, 3, 4], tone: '#16856b' },
        { label: 'US', idx: [5], tone: '#af52de' },
      ]
      const keyOf = name => name.replace(/\s+/g, '-').toLowerCase()
      const hidden = new Set()
      routeNames.forEach(n => { try { if (localStorage.getItem('cit-hidden-' + keyOf(n)) === '1') hidden.add(n) } catch (e) {} })

      const ORIGINAL = ROUTE_BANDS.map(([start, end]) => ({ start, end }))

      function reflow() {
        // visible paths get compact sequential bands starting at row 2
        let cursor = 2
        const newStarts = []
        ORIGINAL.forEach((band, i) => {
          const name = routeNames[i]
          if (!hidden.has(name)) { newStarts[i] = cursor; cursor += band.end - band.start + 1 }
          else newStarts[i] = null
        })
        ;[...laneGrid.children].forEach(el => {
          const ri = el.dataset.routeIndex
          if (ri === undefined) return
          const i = Number(ri)
          const rowStyle = (el.getAttribute('style') || '').match(/grid-row:\s*(\d+)(?:\s*\/\s*span\s*(\d+))?/)
          if (!rowStyle) return
          const span = rowStyle[2] ? Number(rowStyle[2]) : 1
          const oldStart = ORIGINAL[i].start
          const oldEnd = ORIGINAL[i].end
          const oldRow = Number(rowStyle[1])
          if (oldRow < oldStart || oldRow > oldEnd) return
          if (newStarts[i] == null) { el.style.display = 'none'; return }
          const newRow = newStarts[i] + (oldRow - oldStart)
          el.style.display = ''
          el.style.gridRow = span > 1 ? newRow + ' / span ' + span : String(newRow)
        })
      }

      function buildList() {
        pathList.innerHTML = ''
        GROUPS.forEach(g => {
          const vis = g.idx.filter(i => !hidden.has(routeNames[i])).length
          const groupDiv = document.createElement('div')
          groupDiv.className = 'cs-group'
          const h = document.createElement('div')
          h.className = 'cs-group-h'
          const t = document.createElement('span')
          t.textContent = g.label + ' '
          const c = document.createElement('b')
          c.className = 'cs-count'
          c.textContent = vis + '/' + g.idx.length
          h.appendChild(t); h.appendChild(c)
          groupDiv.appendChild(h)
          g.idx.forEach(i => {
            const name = routeNames[i]
            const item = document.createElement('label')
            item.className = 'cs-item'
            const dot = document.createElement('i')
            dot.className = 'cs-dot'
            dot.style.background = g.tone
            const cb = document.createElement('input')
            cb.type = 'checkbox'
            cb.checked = !hidden.has(name)
            const sp = document.createElement('span')
            sp.textContent = name
            item.appendChild(dot); item.appendChild(cb); item.appendChild(sp)
            cb.addEventListener('change', () => {
              if (cb.checked) hidden.delete(name); else hidden.add(name)
              try { if (cb.checked) localStorage.removeItem('cit-hidden-' + keyOf(name)); else localStorage.setItem('cit-hidden-' + keyOf(name), '1') } catch (e) {}
              reflow(); buildList()
            })
            groupDiv.appendChild(item)
          })
          pathList.appendChild(groupDiv)
        })
      }

      showAllBtn.addEventListener('click', () => {
        hidden.clear()
        routeNames.forEach(n => { try { localStorage.removeItem('cit-hidden-' + keyOf(n)) } catch (e) {} })
        reflow(); buildList()
      })

      // if the user selects a hidden route from the buttons, reveal it
      const origSelect = selectRoute
      selectRoute = function (route, scroll) {
        if (route !== 'all') {
          const i = Number(route)
          const name = routeNames[i]
          if (hidden.has(name)) {
            hidden.delete(name)
            try { localStorage.removeItem('cit-hidden-' + keyOf(name)) } catch (e) {}
            reflow(); buildList()
          }
        }
        return origSelect(route, scroll)
      }
      reflow(); buildList()
    }

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
