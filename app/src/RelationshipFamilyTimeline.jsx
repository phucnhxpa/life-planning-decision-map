import './RelationshipFamilyTimeline.css'

const DRIVE_PDF = 'https://drive.google.com/file/d/1H2OQ0EE7bM2uZjvIMODJUkPw_4C-ymK4/view'

const PERSONAL_RANGES = [
  { label: 'Meet a potential long-term partner', start: 26, end: 32, status: 'Planning only', tone: 'meet' },
  { label: 'Serious relationship / cohabitation', start: 28, end: 34, status: 'Planning only', tone: 'cohabit' },
  { label: 'PACS, if useful', start: 31, end: 35, status: 'Planning only', tone: 'pacs' },
  { label: 'First child', start: 33, end: 37, status: 'Couple-dependent', tone: 'child' },
  { label: 'Marriage, if desired', start: 33, end: 38, status: 'Planning only', tone: 'marriage' },
]

const AGE_MIN = 24
const AGE_MAX = 40

function RangeLane({ item }) {
  const left = ((item.start - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100
  const width = ((item.end - item.start) / (AGE_MAX - AGE_MIN)) * 100
  return (
    <div className="family-range-row">
      <div className="family-range-copy">
        <strong>{item.label}</strong>
        <span>{item.status}</span>
      </div>
      <div className="family-range-track">
        <i className={item.tone} style={{ left: `${left}%`, width: `${width}%` }} />
        <b style={{ left: `${left}%` }}>{item.start}</b>
        <b className="end" style={{ left: `${left + width}%` }}>{item.end}</b>
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
          <p>Relationship and family ranges aligned to ages 24–40 alongside a long French/UK academic route.</p>
        </div>
        <div className="family-head-actions">
          <span>Research freeze: 23 Aug 2026</span>
          <a href={DRIVE_PDF} target="_blank" rel="noreferrer">Open confirmed PDF ↗</a>
        </div>
      </header>

      <article className="family-card planning-card">
        <div className="family-section-head">
          <div><span>Personal planning heuristic</span><h3>Ages 24–40</h3></div>
          <small>Scenario ranges—not French demographic measurements or deadlines.</small>
        </div>
        <div className="family-age-axis" aria-hidden="true">{[24, 28, 32, 36, 40].map(age => <span key={age}>Age {age}</span>)}</div>
        <div className="family-range-list">{PERSONAL_RANGES.map(item => <RangeLane item={item} key={item.label} />)}</div>
        <div className="family-operating-principle"><strong>Operating principle:</strong> do not postpone all relationship-building until every degree is completed. Finding and developing the right relationship still takes real time; France allows substantial flexibility over wedding timing.</div>
      </article>

      <div className="family-warning"><strong>Planning only.</strong> These ranges are explicitly heuristic and couple-dependent. They are not French demographic measurements, medical guarantees, or personal deadlines.</div>
      <footer className="family-source">Source: <a href={DRIVE_PDF} target="_blank" rel="noreferrer">France Relationship PACS Marriage and Family Reference 2026-08-23.pdf</a> in Confirmed Records / Others.</footer>
    </section>
  )
}
