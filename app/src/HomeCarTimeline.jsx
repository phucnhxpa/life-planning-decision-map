import './HomeCarTimeline.css'

const CAR_PDF = 'https://drive.google.com/file/d/1oy_KY_V9yHaBsnFCIR118bvWQCMLGZEy/view'
const HOUSE_PDF = 'https://drive.google.com/file/d/1Nkl4yG_eJcgFcIRLtvoq7zNynyCtih5v/view'

const AGE_MIN = 24
const AGE_MAX = 40

// Life-roadmap personal planning rows (heuristic, Phuc-specific).
const CAR_ROWS = [
  { label: 'Paris · no car (optimal default)', start: 24, end: 31, tone: 'nocar', status: 'Confirmed research: dense-urban default' },
  { label: 'Licence experience 3y → standard insurance', start: 25, end: 28, tone: 'insurance', status: 'Surcharge +100/50/25% ends' },
  { label: 'Car window if leaving Paris (périurbain / post-PhD)', start: 31, end: 38, tone: 'window', status: 'Matches PhD end + family stage' },
]

// French population anchors — official/labelled sources, NOT Phuc's personal plan.
const FR_STATS = [
  { label: 'Licence holders · age 18–24 (2014)', value: '65%', source: 'INSEE/DREES ENRJ' },
  { label: 'First vehicle bought at ages 16–20', value: '≈1 in 2 (FR, DE, IT)', source: 'Cetelem 2025' },
  { label: 'First car is used (under-30 buyers)', value: '68%', source: 'Cetelem 2025' },
  { label: 'Average first-car budget (under-30s)', value: '€12,290', source: 'Cetelem 2025' },
  { label: 'Households with ≥1 car · ref person 15–29', value: '64.2%', source: 'INSEE 2023' },
  { label: 'Households with ≥1 car · ref person 30–44', value: '83.7%', source: 'INSEE 2023' },
  { label: 'Households with ≥1 car · dense urban', value: '67.7%', source: 'INSEE 2023' },
  { label: 'Licensed under-30s without a car: "too expensive"', value: '59%', source: 'Cetelem 2025' },
  { label: 'Permis financed by parents (18–24, 2014)', value: '84%', source: 'INSEE Première 1603' },
  { label: 'Under-30s holding a licence (was 92% in 2011)', value: '73%', source: 'Cetelem 2025' },
]

const CAR_COSTS = [
  { label: 'Used small car (market entry)', value: '≈ €20,700 avg transaction' },
  { label: 'Crédit affecté 4.5% / 48m on €18k (20% down)', value: '€328.37/mo · €19,362 total' },
  { label: 'Insurance Île-de-France (experienced)', value: '≈ €890/yr' },
  { label: 'All-in Paris ownership (small car planning range)', value: '€3.7k–8k/yr' },
]

function Row({ item, max }) {
  const left = ((item.start - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100
  const width = ((item.end - item.start) / (AGE_MAX - AGE_MIN)) * 100
  return (
    <div className="hc-row">
      <div className="hc-row-copy">
        <strong>{item.label}</strong>
        <span>{item.status}</span>
      </div>
      <div className="hc-track">
        <i className={item.tone} style={{ left: `${left}%`, width: `${width}%` }} />
        <b style={{ left: `${left}%` }}>{item.start}</b>
        <b className="end" style={{ left: `${left + width}%` }}>{item.end}</b>
      </div>
    </div>
  )
}

export default function HomeCarTimeline() {
  return (
    <section className="hc-view" aria-labelledby="hc-view-title">
      <header className="hc-head">
        <div>
          <div className="hc-kicker">Confirmed Records · INSEE · Cetelem · SDES · RAC Foundation</div>
          <h2 id="hc-view-title">Home &amp; Car — age research</h2>
          <p>When people in France actually buy their first home and first car, mapped onto the same 24–40 planning axis as the rest of the roadmap. Planning rows are heuristics; statistics are population anchors, not deadlines.</p>
        </div>
        <div className="hc-head-actions">
          <span>Research freeze: 20 Sep 2026</span>
          <a href={HOUSE_PDF} target="_blank" rel="noreferrer">First Home PDF ↗</a>
          <a href={CAR_PDF} target="_blank" rel="noreferrer">Buying a Car PDF ↗</a>
        </div>
      </header>

      <article className="hc-card">
        <div className="hc-section-head">
          <div><span>Car planning rows · heuristic</span><h3>Car in France · ages 24–40</h3></div>
          <small>Phuc-specific planning windows — not demographic claims. Paris research conclusion: a recent small petrol/hybrid or EV bought used — or no car at all.</small>
        </div>
        <div className="hc-age-axis" aria-hidden="true">{[24, 28, 32, 36, 40].map(a => <span key={a}>Age {a}</span>)}</div>
        <div className="hc-rows">{CAR_ROWS.map(r => <Row item={r} key={r.label} />)}</div>
        <div className="hc-principle"><strong>Operating principle:</strong> in Paris the optimal default is no car — density (67.7% equipped) vs périurbain (94.2%) means location dominates age. A car becomes rational when leaving dense Paris (post-PhD / périurbain family stage), not at a fixed birthday.</div>
      </article>

      <article className="hc-card">
        <div className="hc-section-head">
          <div><span>Population anchors · official + labelled research</span><h3>Age &amp; ownership statistics</h3></div>
          <small>No official "mean first-car age" exists for France — same evidence gap as the house reference. These are the closest verified anchors.</small>
        </div>
        <div className="hc-stats">
          {FR_STATS.map(s => (
            <div className="hc-stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
              <em>{s.source}</em>
            </div>
          ))}
        </div>
      </article>

      <article className="hc-card">
        <div className="hc-section-head">
          <div><span>Cost anchors · confirmed Buying a Car PDF</span><h3>What owning actually costs</h3></div>
          <small>From Buying a Car in Paris — Prices, Financing and Law (Confirmed Records / Finance, 31 Aug 2026).</small>
        </div>
        <div className="hc-costs">
          {CAR_COSTS.map(c => (
            <div className="hc-cost" key={c.label}>
              <strong>{c.label}</strong>
              <span>{c.value}</span>
            </div>
          ))}
        </div>
        <div className="hc-note">Legal age anchors in the confirmed PDF: credit requires licence + <b>age 18+</b> (lenders often require ≤70–75 at contract end); young-driver insurance surcharge runs on <b>licence years</b> (+100% / +50% / +25%), not birthdays. New-car buyers in France average ≈54–55 years old — first cars are a used-market event (68% of under-30 first cars).</div>
      </article>

      <div className="hc-warning"><strong>Planning only + labelled statistics.</strong> Planning rows are personal heuristics. Statistics are population anchors from INSEE 2023, INSEE/DREES 2014, Cetelem 2025 (fieldwork Jun–Jul 2024, 14 countries) and SDES — none are personal deadlines, and survey figures are not official statistics.</div>
      <footer className="hc-source">
        Sources: <a href={HOUSE_PDF} target="_blank" rel="noreferrer">When People Buy Their First Home in France 2026-08-24.pdf</a> · <a href={CAR_PDF} target="_blank" rel="noreferrer">Buying a Car in Paris Prices Financing and Law 2026-08-31.pdf</a> (Confirmed Records / Finance) · <a href="https://www.insee.fr/fr/statistiques/8670751" target="_blank" rel="noreferrer">INSEE équipement des ménages 2023</a> · <a href="https://www.insee.fr/fr/statistiques/2019048" target="_blank" rel="noreferrer">INSEE Première 1603</a> · <a href="https://observatoirecetelem.com/lobservatoire-cetelem-de-lautomobile/lautomobile-une-eternelle-jeunesse/" target="_blank" rel="noreferrer">Observatoire Cetelem 2025</a> · <a href="https://www.statistiques.developpement-durable.gouv.fr/393-millions-de-voitures-en-circulation-en-france-au-1er-janvier-2024" target="_blank" rel="noreferrer">SDES parc 2024</a> · <a href="https://www.racfoundation.org/motoring-faqs/mobility" target="_blank" rel="noreferrer">RAC Foundation/DfT</a>
      </footer>
    </section>
  )
}
