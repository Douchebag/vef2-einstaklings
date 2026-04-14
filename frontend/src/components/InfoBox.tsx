import "./InfoBox.css";

export function InfoBox() {
  return (
    <aside className="info-box">
      <h2 className="info-title">How to Calculate Pot Odds</h2>

      <section className="info-section">
        <h3 className="info-heading">1. Required equity</h3>
        <p className="info-text">
          To break even on a call, your hand must win often enough to cover what you risk.
        </p>
        <div className="info-formula">
          <span className="formula-text">Required equity = Call ÷ (Pot + Call)</span>
        </div>
        <p className="info-example">
          Example: pot = 30 BB, call = 10 BB<br />
          10 ÷ (30 + 10) = <strong>25%</strong>
        </p>
      </section>

      <section className="info-section">
        <h3 className="info-heading">2. Estimate your equity</h3>
        <p className="info-text">
          Count your <em>outs</em> — cards that complete your drawing hand.
        </p>
        <div className="info-rule">
          <div className="rule-row">
            <span className="rule-label">Flop → River</span>
            <span className="rule-op">outs × 4</span>
          </div>
          <div className="rule-row">
            <span className="rule-label">Turn → River</span>
            <span className="rule-op">(outs × 2) + 2%</span>
          </div>
        </div>
        <p className="info-example">
          9 outs (flush draw) on the flop ≈ <strong>36%</strong> equity
        </p>
      </section>

      <section className="info-section">
        <h3 className="info-heading">Common out counts</h3>
        <table className="info-table">
          <tbody>
            <tr><td>Flush draw</td><td>9 outs</td></tr>
            <tr><td>Open-ended straight</td><td>8 outs</td></tr>
            <tr><td>Two overcards</td><td>6 outs</td></tr>
            <tr><td>Gutshot straight</td><td>4 outs</td></tr>
          </tbody>
        </table>
      </section>

      <section className="info-section">
        <h3 className="info-heading">3. The decision</h3>
        <div className="info-rule">
          <div className="rule-row call">
            <span className="rule-label">Equity &gt; Required</span>
            <span className="rule-op">Call ✓</span>
          </div>
          <div className="rule-row fold">
            <span className="rule-label">Equity &lt; Required</span>
            <span className="rule-op">Fold ✓</span>
          </div>
        </div>
      </section>
    </aside>
  );
}
