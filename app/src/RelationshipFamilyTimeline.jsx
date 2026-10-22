import './RelationshipFamilyTimeline.css'

const DRIVE_PDF = 'https://drive.google.com/file/d/1H2OQ0EE7bM2uZjvIMODJUkPw_4C-ymK4/view'

const AGE_MIN = 24
const AGE_MAX = 40
const pct = (age) => ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100

// Data verbatim from the Confirmed Records reference (France Relationship PACS Marriage and Family Reference, 23 Aug 2026)
const MILESTONES = [
  {
    label: 'Meet a potential long-term partner', start: 26, end: 32, status: 'Planning only',
    kind: 'none',
    caption: 'No demographic measurement exists — planning range only (do not infer from wedding age).',
  },
  {
    label: 'Serious relationship / cohabitation', start: 28, end: 34, status: 'Planning only',
    kind: 'none',
    caption: 'No official age published (INED: cohabitation-first is dominant, formation not measured).',
  },
  {
    label: 'PACS, if useful', start: 31, end: 35, status: 'Planning only',
    kind: 'means',
    points: [
      { year: '2016', men: 34.8, women: 32.8, src: 'Ministry of Justice' },
      { year: '2006', men: 32.1, women: 30.1, src: 'Infostat Justice 97' },
    ],
    caption: 'Mean ages only — no quartiles published, so no true box (MoJ 2016 · Infostat 2006).',
  },
  {
    label: 'First child', start: 33, end: 37, status: 'Couple-dependent',
    kind: 'box',
    box: { q1: 25, q3: 32, mode: 28, mean: 29.1, src: 'INSEE 2023 (Focus 356)' },
    caption: 'Middle half of first births 25–32 · mode 28 · mean 29.1 (INSEE 2023).',
  },
  {
    label: 'Marriage, if desired', start: 33, end: 38, status: 'Planning only',
    kind: 'mixed',
    france: { year: '2022', men: 36.6, women: 34.7, src: 'INSEE Focus 321' },
    us: { q1: 28, q3: 35, median: 30, src: 'US SIPP — not French' },
    caption: 'France means: men 36.6 · women 34.7 (INSEE 2022) · US doctorate box median ≈ 30, 28–35 (not French).',
  },
]

function PlanBand({ start, end }) {
  return (
    <div className="bx-plan" style={{ left: `${pct(start)}%`, width: `${pct(end) - pct(start)}%` }}>
      <span>{start}–{end}</span>
    </div>
  )
}

function BoxPlot({ box, tone = 'fr' }) {
  const cls = tone === 'us' ? 'bx-box us' : 'bx-box'
  return (
    <div className="bx-plot" title={box.src}>
      <i className="bx-whisk" style={{ left: `${pct(box.q1)}%`, right: `${100 - pct(box.q3)}%` }} />
      <div className={cls} style={{ left: `${pct(box.q1)}%`, width: `${pct(box.q3) - pct(box.q1)}%` }}>
        <i className="bx-med" style={{ left: `${((box.mode != null ? box.mode : box.median) - box.q1) / (box.q3 - box.q1) * 100}%` }} />
      </div>
      {box.mean != null && <i className="bx-dot" style={{ left: `${pct(box.mean)}%` }} />}
    </div>
  )
}

function MeansPlot({ points }) {
  return (
    <div className="bx-plot">
      {points.map(pt => (
        <i key={pt.year} className={'bx-dot' + (pt.year === '2006' ? ' old' : '')}
           style={{ left: `${pct(pt.men)}%` }} title={`${pt.year} · men · mean ${pt.men} · ${pt.src}`} />
      ))}
      {points.map(pt => (
        <i key={'w' + pt.year} className={'bx-dot hollow' + (pt.year === '2006' ? ' old' : '')}
           style={{ left: `${pct(pt.women)}%` }} title={`${pt.year} · women · mean ${pt.women} · ${pt.src}`} />
      ))}
    </div>
  )
}

function BoxLane({ item }) {
  return (
    <div className="family-range-row bx-row">
      <div className="family-range-copy">
        <strong>{item.label}</strong>
        <span>{item.status}</span>
      </div>
      <div className="bx-track-wrap">
        <div className="bx-track">
          {item.kind === 'box' && <BoxPlot box={item.box} />}
          {item.kind === 'mixed' && (
            <>
              <BoxPlot box={item.us} tone="us" />
              <div className="bx-means-inline">
                <i className="bx-dot" style={{ left: `${pct(item.france.men)}%` }} title={`France ${item.france.year} · men · mean ${item.france.men} · ${item.france.src}`} />
                <i className="bx-dot hollow" style={{ left: `${pct(item.france.women)}%` }} title={`France ${item.france.year} · women · mean ${item.france.women} · ${item.france.src}`} />
              </div>
            </>
          )}
          {item.kind === 'means' && <MeansPlot points={item.points} />}
          {item.kind === 'none' && <div className="bx-nodata">no published distribution — plan only</div>}
        </div>
        <PlanBand start={item.start} end={item.end} />
        <small className="bx-note">{item.caption}</small>
      </div>
    </div>
  )
}

export default function RelationshipFamilyTimeline() {
  return (
    <section className="family-view family-only" aria-labelledby="family-view-title">
      <header className="family-head">
        <div>
          <div className="family-kicker">Confirmed Records · planning scenario</div>
          <h2 id="family-view-title">Personal planning heuristic</h2>
          <p>Relationship and family ranges aligned to ages 24–40 alongside a long French/UK academic route — now with the published distributions where they exist.</p>
        </div>
        <div className="family-head-actions">
          <span>Research freeze: 23 Aug 2026</span>
          <a href={DRIVE_PDF} target="_blank" rel="noreferrer">Open confirmed PDF ↗</a>
        </div>
      </header>

      <article className="family-card planning-card">
        <div className="family-section-head">
          <div><span>Boxes &amp; dots vs your planning ranges</span><h3>Ages 24–40</h3></div>
          <small>Boxes/dots = published statistics, each labelled with source and status. Colored bands = your planning heuristic — still not deadlines.</small>
        </div>
        <div className="family-age-axis" aria-hidden="true">{[24, 28, 32, 36, 40].map(age => <span key={age}>Age {age}</span>)}</div>
        <div className="family-range-list">{MILESTONES.map(item => <BoxLane item={item} key={item.label} />)}</div>
        <div className="family-operating-principle"><strong>Operating principle:</strong> do not postpone all relationship-building until every degree is completed. Finding and developing the right relationship still takes real time; France allows substantial flexibility over wedding timing.</div>
      </article>

      <div className="family-warning"><strong>Planning only.</strong> The colored bands remain explicitly heuristic and couple-dependent. The boxes/dots are published population statistics (or labelled US context) — they are not personal deadlines, medical guarantees, or predictions.</div>
      <footer className="family-source">Source: <a href={DRIVE_PDF} target="_blank" rel="noreferrer">France Relationship PACS Marriage and Family Reference 2026-08-23.pdf</a> in Confirmed Records / Others.</footer>
    </section>
  )
}
