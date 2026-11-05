const results = [
  { dataset: 'RSNA', local: '81.03%', fedAvg: '79.50%', weighted: '84.80%' },
  { dataset: 'Pediatric', local: '81.49%', fedAvg: '79.20%', weighted: '87.50%' },
  { dataset: 'NIH ChestX-ray14', local: '67.29%', fedAvg: '72.80%', weighted: '71.20%' },
]

const chartValues = [
  { label: 'RSNA', values: [81.03, 79.5, 84.8] },
  { label: 'Pediatric', values: [81.49, 79.2, 87.5] },
  { label: 'NIH', values: [67.29, 72.8, 71.2] },
]

function ResultsChart() {
  const chartHeight = 220
  const baseline = 250
  const scale = chartHeight / 100
  const colors = ['#87918f', '#b9c4c1', '#2f6f6c']

  return (
    <div className="chart-wrap" aria-label="Grouped bar chart of test accuracy by dataset and training method">
      <div className="chart-legend" aria-hidden="true">
        <span><i style={{ backgroundColor: colors[0] }} />Local training</span>
        <span><i style={{ backgroundColor: colors[1] }} />Standard FedAvg</span>
        <span><i style={{ backgroundColor: colors[2] }} />Weighted + scheduled FL</span>
      </div>
      <svg className="results-chart" role="img" aria-labelledby="chart-title chart-description" viewBox="0 0 720 300">
        <title id="chart-title">Test accuracy by dataset and training method</title>
        <desc id="chart-description">Grouped bars compare local training, standard FedAvg, and weighted plus scheduled federated learning across RSNA, Pediatric, and NIH ChestX-ray14.</desc>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = baseline - tick * scale
          return <g key={tick}><line x1="54" x2="694" y1={y} y2={y} className="chart-grid" /><text x="44" y={y + 4} textAnchor="end" className="chart-axis">{tick}%</text></g>
        })}
        {chartValues.map((group, groupIndex) => {
          const groupX = 124 + groupIndex * 210
          return <g key={group.label}>
            {group.values.map((value, valueIndex) => {
              const height = value * scale
              return <rect key={valueIndex} x={groupX + valueIndex * 38} y={baseline - height} width="25" height={height} fill={colors[valueIndex]} rx="1" />
            })}
            <text x={groupX + 38} y="278" textAnchor="middle" className="chart-label">{group.label}</text>
          </g>
        })}
      </svg>
    </div>
  )
}

function SectionHeading({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-heading"><span>{number}</span><h2>{children}</h2></div>
}

export function ResearchPage() {
  return (
    <main className="page-shell">
      <header className="hero">
        <p className="eyebrow">College major project · 2026</p>
        <h1>Federated Learning<br className="desktop-break" /> for Chest X-Ray Classification</h1>
        <p className="dek">One pneumonia classifier trained across three hospitals&apos; chest X-rays, without moving an image.</p>
        <p className="byline">Prasad Chopade, B.Tech Computer Engineering, SPIT Mumbai. Paper accepted at ISED 2026, NIT Warangal.</p>
        <nav className="links" aria-label="Project links">
          <a href="https://github.com/prasadchopade/federated-learning-major-project">Code <span aria-hidden="true">↗</span></a>
          <a href="https://prasadchopade.vercel.app/">Portfolio <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="section" aria-labelledby="results-heading">
        <SectionHeading number="01" ><span id="results-heading">Results</span></SectionHeading>
        <div className="results-layout">
          <ResultsChart />
          <div className="table-wrap">
            <table>
              <caption className="sr-only">Test accuracy by dataset and training method</caption>
              <thead><tr><th scope="col">Dataset</th><th scope="col">Local</th><th scope="col">FedAvg</th><th scope="col">Weighted + scheduled</th></tr></thead>
              <tbody>{results.map((row) => <tr key={row.dataset}><th scope="row">{row.dataset}</th><td className={row.dataset === 'RSNA' || row.dataset === 'Pediatric' ? 'best' : ''}>{row.local}</td><td className={row.dataset === 'NIH ChestX-ray14' ? 'best' : ''}>{row.fedAvg}</td><td className={row.dataset !== 'NIH ChestX-ray14' ? 'best' : ''}>{row.weighted}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <p className="note">Weighted + scheduled training won on RSNA and Pediatric. On NIH, standard FedAvg stayed ahead. Averaged across the three, that is 81.17% against 77.17% for FedAvg and 76.60% for local training, but an average can hide a weak client, so the per-hospital numbers come first.</p>
      </section>

      <section className="section" aria-labelledby="hospitals-heading">
        <SectionHeading number="02"><span id="hospitals-heading">Three hospitals, one model</span></SectionHeading>
        <p className="section-intro">Each dataset simulates a hospital. Images stay local, and only model weights go to the coordinator.</p>
        <div className="hospital-list">
          <div className="hospital-row"><span className="dataset-name">RSNA Pneumonia Detection</span><span>adult</span><span>26,684 images</span></div>
          <div className="hospital-row"><span className="dataset-name">Kermany pediatric chest X-rays</span><span>pediatric</span><span>5,856 images</span></div>
          <div className="hospital-row"><span className="dataset-name">NIH ChestX-ray14</span><span>adult with mixed findings</span><span>112,120 images</span></div>
          <div className="hospital-total"><span>Total</span><strong>144,660</strong></div>
        </div>
        <p className="classes"><span>Classes</span> Normal, Pneumonia, Other.</p>
      </section>

      <section className="section" aria-labelledby="training-heading">
        <SectionHeading number="03"><span id="training-heading">How it trains</span></SectionHeading>
        <div className="spec-grid">
          <div><span>Architecture</span><strong>ResNet-50 from random initialization</strong><small>no ImageNet pretraining</small></div>
          <div><span>Input</span><strong>224 × 224</strong></div>
          <div><span>Optimizer</span><strong>Adam</strong><small>learning rate 0.0001</small></div>
          <div><span>Batch size</span><strong>32</strong></div>
          <div><span>Local epochs</span><strong>3 per round</strong></div>
          <div><span>Communication</span><strong>6 rounds</strong></div>
        </div>
        <p className="weights-label">Fixed aggregation weights, re-normalized over whichever hospitals take part in a round.</p>
        <div className="weights"><span>RSNA</span><b>0.321</b><span>Pediatric</span><b>0.290</b><span>NIH</span><b>0.389</b></div>
        <pre><code>next_global = sum(alpha[h] * local_weights[h] for h in S) / sum(alpha[h] for h in S)</code></pre>
      </section>

      <section className="section scheduling" aria-labelledby="schedule-heading">
        <SectionHeading number="04"><span id="schedule-heading">Scheduling mattered on its own</span></SectionHeading>
        <p>On RSNA, full participation reached <strong>77.74%</strong> and scheduled participation reached <strong>83.03%</strong>.</p>
        <p className="muted">The schedule is deterministic, not a learned policy.</p>
      </section>

      <section className="section limits" aria-labelledby="limits-heading">
        <SectionHeading number="05"><span id="limits-heading">Limits</span></SectionHeading>
        <ul><li>Secure aggregation and differential privacy were not implemented.</li><li>Mapping NIH&apos;s multiple findings into three classes loses detail.</li><li>Accuracy alone is not enough, so per-class precision, recall and F1 are still needed.</li><li>This is a research prototype, not a clinical tool.</li></ul>
      </section>

      <footer><span>Prasad Chopade</span><nav aria-label="Footer links"><a href="https://github.com/prasadchopade/federated-learning-major-project">Code</a><a href="https://prasadchopade.vercel.app/">Portfolio</a></nav></footer>
    </main>
  )
}
