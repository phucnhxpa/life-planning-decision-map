import './RelationshipFamilyTimeline.css'

const DRIVE_PDF = 'https://drive.google.com/file/d/1H2OQ0EE7bM2uZjvIMODJUkPw_4C-ymK4/view'

const COMMON_ROUTES = [
  ['Cohabitation', 'PACS', 'Marriage'],
  ['Cohabitation', 'Marriage'],
  ['Cohabitation', 'PACS indefinitely'],
  ['Cohabitation', 'Child', 'PACS or marriage'],
  ['PACS', 'Child', 'Marriage later'],
  ['Long-term cohabitation', 'No legal status required'],
]

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
    <section className="family-view" aria-labelledby="family-view-title">
      <header className="family-head">
        <div>
          <div className="family-kicker">Confirmed Records · France-first evidence</div>
          <h2 id="family-view-title">Relationship, PACS, marriage &amp; family</h2>
          <p>How committed relationships commonly progress in France—and how those milestones can fit alongside a long academic route.</p>
        </div>
        <div className="family-head-actions">
          <span>Research freeze: 23 Aug 2026</span>
          <a href={DRIVE_PDF} target="_blank" rel="noreferrer">Open confirmed PDF ↗</a>
        </div>
      </header>

      <div className="family-facts" aria-label="Official French demographic anchors">
        <article><span>First marriage · men</span><strong>36.6</strong><small>Mean age, first marriages, 2022</small></article>
        <article><span>First marriage · women</span><strong>34.7</strong><small>Mean age, first marriages, 2022</small></article>
        <article><span>First child · women</span><strong>29.1</strong><small>Mean maternal age, 2023 · mode 28</small></article>
        <article className="caution"><span>PACS timing</span><strong>No official mean</strong><small>No national relationship→PACS or PACS→marriage mean located</small></article>
      </div>

      <article className="family-card progression-card">
        <div className="family-section-head">
          <div><span>Flexible French progression</span><h3>No single required sequence</h3></div>
          <small>Arrows show a common pattern—not a compulsory order.</small>
        </div>
        <div className="family-progression">
          <div><b>Relationship</b><span>Formation is not an administrative event</span></div>
          <i>→</i>
          <div><b>Cohabitation</b><span>Commonly precedes legal union</span></div>
          <i>→</i>
          <div><b>PACS</b><span>Optional legal partnership</span></div>
          <i>→</i>
          <div><b>Child</b><span>May precede marriage</span></div>
          <i>→</i>
          <div><b>Marriage</b><span>Optional later confirmation</span></div>
        </div>
        <div className="family-truth"><strong>What is firmly established:</strong> cohabitation-first is common; PACS may be an alternative or intermediate stage; children commonly arrive outside marriage; marriage can be a later legal or symbolic event.</div>
      </article>

      <article className="family-card">
        <div className="family-section-head">
          <div><span>Route options</span><h3>Socially ordinary paths in France</h3></div>
          <small>These alternatives are preserved from the confirmed reference.</small>
        </div>
        <div className="family-route-grid">
          {COMMON_ROUTES.map((route, index) => (
            <div className="family-route" key={route.join('-')}>
              <em>{String(index + 1).padStart(2, '0')}</em>
              <div>{route.map((step, i) => <span key={step}>{i > 0 && <i>→</i>}<b>{step}</b></span>)}</div>
            </div>
          ))}
        </div>
      </article>

      <article className="family-card planning-card">
        <div className="family-section-head">
          <div><span>Personal planning heuristic</span><h3>Ages 24–40 alongside a long French/UK academic route</h3></div>
          <small>Scenario ranges—not French demographic measurements or deadlines.</small>
        </div>
        <div className="family-age-axis" aria-hidden="true">{[24, 28, 32, 36, 40].map(age => <span key={age}>Age {age}</span>)}</div>
        <div className="family-range-list">{PERSONAL_RANGES.map(item => <RangeLane item={item} key={item.label} />)}</div>
        <div className="family-operating-principle"><strong>Operating principle:</strong> do not postpone all relationship-building until every degree is completed. Finding and developing the right relationship still takes real time; France allows substantial flexibility over wedding timing.</div>
      </article>

      <div className="family-two-col">
        <article className="family-card age-card">
          <div className="family-section-head"><div><span>Children</span><h3>Official maternal-age anchors</h3></div></div>
          <div className="birth-age-row"><div><strong>29.1</strong><span>First child</span></div><i /><div><strong>31.6</strong><span>Second child</span></div><i /><div><strong>33.1</strong><span>Third child</span></div></div>
          <ul>
            <li>First-child mode: age 28.</li>
            <li>Middle half of first births: ages 25–32.</li>
            <li>Six in ten babies born in France in 2017 had unmarried parents.</li>
          </ul>
        </article>
        <article className="family-card evidence-card">
          <div className="family-section-head"><div><span>PACS evidence</span><h3>What the available numbers actually mean</h3></div></div>
          <div className="evidence-metric"><strong>4 years median</strong><span>Relationship duration when 2005 respondents intended to PACS—not actual time to registration.</span></div>
          <div className="evidence-metric"><strong>52.4 months</strong><span>Mean duration of all PACS dissolved in 2016—not PACS→marriage time.</span></div>
          <div className="evidence-metric"><strong>48.04%</strong><span>Marriage-related share of recorded 2016 PACS exits—not eventual share of all PACS entrants.</span></div>
        </article>
      </div>

      <div className="family-warning"><strong>Do not build a false timetable from unrelated averages.</strong> First-child and first-marriage ages describe different populations. All planning ranges above are explicitly heuristic and couple-dependent.</div>
      <footer className="family-source">Source: <a href={DRIVE_PDF} target="_blank" rel="noreferrer">France Relationship PACS Marriage and Family Reference 2026-08-23.pdf</a> in My Drive / Personal / Confirmed Records / Others.</footer>
    </section>
  )
}
