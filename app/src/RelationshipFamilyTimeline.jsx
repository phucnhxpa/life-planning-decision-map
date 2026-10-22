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
    note: 'No demographic measurement exists. The reference is explicit: no official single age — do not infer it from wedding age.',
  },
  {
    label: 'Serious relationship / cohabitation', start: 28, end: 34, status: 'Planning only',
    kind: 'none',
    note: 'No official age published. INED cohort evidence: cohabitation-first is dominant in France, but formation age is not administratively measured.',
  },
  {
    label: 'PACS, if useful', start: 31, end: 35, status: 'Planning only',
    kind: 'means',
    points: [
      { year: '2016', men: 34.8, women: 32.8, src: 'Ministry of Justice, registration series' },
      { year: '2006', men: 32.1, women: 30.1, src: 'Infostat Justice 97, opposite-sex PACS' },
    ],
    note: 'Mean ages only — no quartiles published for PACS, so no true box. Cohort procedures changed between 2006 and 2016.',
  },
  {
    label: 'First child', start: 33, end: 37, status: 'Couple-dependent',
    kind: 'box',
    box: { q1: 25, q3: 32, mode: 28, mean: 29.1 },
    note: 'Real distribution: INSEE 2023 (Focus 356) — middle half of first births aged 25–32, most common age 28, mean 29.1.',
  },
  {
    label: 'Marriage, if desired', start: 33, end: 38, status: 'Planning only',
    kind: 'mixed',
    france: { year: '2022', men: 36.6, women: 34.7, src: 'INSEE Focus 321 — mean age, first marriages (no quartiles published)' },
    us: { q1: 28, q3: 35, median: 30, src: 'US SIPP 2023 custom — doctorate holders, first marriage 2010+ (not French)' },
    note: 'France publishes means only. The US doctorate box is labelled context — same education profile, different country.',
  },
]

function PlanBand({ start, end }) {
  return (
    <div className="bx-plan" style={{ left: `${pct(start)}%`, width: `${pct(end) - pct(start)}%` }}>
      <span>your plan {start}–{end}</span>
    </div>
  )
}

function MeansLayer({ points }) {
  return (
    <div className="bx-layer">
      {points.map(pt => (
        <div key={pt.year} className="bx-means-row">
          <div className="bx-dot" style={{ left: `${pct(pt.men)}%` }} title={`${pt.year} · men · mean ${pt.men} · ${pt.src}`} />
          <div className="bx-dot" style={{ left: `${pct(pt.women)}%` }} title={`${pt.year} · women · mean ${pt.women} · ${pt.src}`} />
          <div className="bx-means-label" style={{ left: `${pct(pt.men)}%` }}>
            {pt.year}: men {pt.men} · women {pt.women}
          </div>
        </div>
      ))}
    </div>
  )
}

function BoxLayer({ box, tone }) {
  return (
    <div className="bx-layer">
      <div className="bx-box" style={{ left: `${pct(box.q1)}%`, width: `${pct(box.q3) - pct(box.q1)}%` }}>
        {box.median != null && <i className="bx-med" style={{ left: `${(box.median - box.q1) / (box.q3 - box.q1) * 100}%` }} title={`median ≈ ${box.median}`} />}
        {box.mode != null && <i className="bx-med" style={{ left: `${(box.mode - box.q1) / (box.q3 - box.q1) * 100}%` }} title={`most common age (mode) ${box.mode}`} />}
      </div>
      {box.mean != null && <div className="bx-dot mean" style={{ left: `${pct(box.mean)}%` }} title={`mean ${box.mean}`} />}
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
          <PlanBand start={item.start} end={item.end} />
          {item.kind === 'box' && <BoxLayer box={item.box} />}
          {item.kind === 'means' && <MeansLayer points={item.points} />}
          {item.kind === 'mixed' && (
            <>
              <MeansLayer points={[item.france]} />
              <div className="bx-layer">
                <div className="bx-box us" style={{ left: `${pct(item.us.q1)}%`, width: `${pct(item.us.q3) - pct(item.us.q1)}%` }}>
                  <i className="bx-med" style={{ left: `${(item.us.median - item.us.q1) / (item.us.q3 - item.us.q1) * 100}%` }} title={`median ≈ ${item.us.median}`} />
                </div>
              </div>
              <div className="bx-means-label us-cap" style={{ left: `${pct(item.us.q1)}%` }}>US doctorate box: median ≈ {item.us.median}, middle 50% {item.us.q1}–{item.us.q3} (not French)</div>
            </>
          )}
          {item.kind === 'none' && <div className="bx-nodata">No demographic measurement — planning range only</div>}
        </div>
        <small className="bx-note">{item.note}</small>
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
