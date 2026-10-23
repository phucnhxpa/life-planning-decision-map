import './TaxRentalTimeline.css'

// Chain: 2025 income-tax return filed 4 Sep 2026 (paper, SIP Houilles) -> avis d'imposition +3 months -> 3 months to find an apartment.
const T0 = new Date('2026-09-01').getTime()
const T1 = new Date('2027-04-01').getTime()
const pct = (d) => ((new Date(d).getTime() - T0) / (T1 - T0)) * 100
const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec 2026', 'Jan', 'Feb', 'Mar 2027']
const MPOS = ['2026-09-01', '2026-10-01', '2026-11-01', '2026-12-01', '2027-01-01', '2027-02-01', '2027-03-01']

export default function TaxRentalTimeline() {
  return (
    <section className="taxrent" aria-labelledby="taxrent-title">
      <header className="tr-head">
        <div>
          <div className="tr-kicker">Confirmed Records · 2025 income tax → housing</div>
          <h2 id="taxrent-title">2025 tax &amp; new apartment</h2>
          <p>Return filed 4 Sep 2026 → tax statement +3 months → 3 months to find the apartment. One row, your rule.</p>
        </div>
        <div className="tr-head-actions"><span>Filing date verified: 4 Sep 2026</span></div>
      </header>

      <article className="tr-card">
        <div className="tr-lane">
          <div className="tr-grid">{MPOS.map((d, i) => <i key={d} style={{ left: `${pct(d)}%` }}><span>{MONTHS[i]}</span></i>)}</div>
          <div className="tr-seg wait" style={{ left: `${pct('2026-09-04')}%`, width: `${pct('2026-12-04') - pct('2026-09-04')}%` }}>
            <span>3 months · wait for the avis d'imposition</span>
          </div>
          <div className="tr-seg find" style={{ left: `${pct('2026-12-04')}%`, width: `${pct('2027-03-04') - pct('2026-12-04')}%` }}>
            <span>3 months · find the new apartment</span>
          </div>
          <div className="tr-dot" style={{ left: `${pct('2026-09-04')}%` }} title="4 Sep 2026 · 2025 return filed on paper at SIP Houilles" />
          <div className="tr-dot" style={{ left: `${pct('2026-12-04')}%` }} title="4 Dec 2026 · avis d'imposition due (your +3-month rule; accountant expects ~early Dec)" />
          <div className="tr-dot red" style={{ left: `${pct('2027-03-04')}%` }} title="4 Mar 2027 · apartment search window closes" />
        </div>
        <div className="tr-captions">
          <div><b>4 Sep 2026</b> return filed (paper, SIP Houilles)</div>
          <div><b>4 Dec 2026</b> avis d'imposition due — the income proof for the rental dossier</div>
          <div><b>4 Mar 2027</b> search window closes — dossier + visits + offer done</div>
        </div>
        <div className="tr-notes">
          <div><strong>Why this order:</strong> the avis d'imposition is the income proof French landlords ask for — the apartment hunt starts only once it's in hand.</div>
          <div><strong>What the accountant says:</strong> official avis expected ~early Dec 2026 (late-filed return; €8,000 balance simulation, waiver requested) — your 3-month rule lands on 4 Dec too.</div>
          <div><strong>Honesty:</strong> everything after 4 Sep 2026 is your rule (+3, +3), not an official promise — adjust freely if the avis lands early.</div>
        </div>
      </article>
    </section>
  )
}
