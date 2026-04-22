import { useEffect, useState } from "react";
import { fetchStats } from "../api";
import type { Stats } from "../types";
import "./StatsPanel.css";

export function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return <div className="stats-loading">LOADING...</div>;
  }

  const { total, correct, accuracy, breakdown, recent } = stats;
  const callAcc = breakdown.shouldCall.total > 0
    ? breakdown.shouldCall.correct / breakdown.shouldCall.total
    : null;
  const foldAcc = breakdown.shouldFold.total > 0
    ? breakdown.shouldFold.correct / breakdown.shouldFold.total
    : null;

  const accColor = accuracy >= 0.7 ? "#bbffcc" : accuracy >= 0.5 ? "#f5d060" : "#ffbbbb";
  const barColor = accuracy >= 0.7 ? "#27803e" : accuracy >= 0.5 ? "#8a6820" : "#8a2a2a";

  return (
    <div className="stats-panel">
      <h2>Performance</h2>

      <div className="stats-top">
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: "#7ddcff" }}>{total}</div>
          <div className="stat-card-label">Attempts</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: "#6fdc6f" }}>{correct}</div>
          <div className="stat-card-label">Correct</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: accColor }}>
            {total > 0 ? `${(accuracy * 100).toFixed(1)}%` : "—"}
          </div>
          <div className="stat-card-label">Accuracy</div>
        </div>
      </div>

      {total > 0 && (
        <>
          <div>
            <h3>Overall Accuracy</h3>
            <div className="accuracy-box">
              <div className="accuracy-row">
                <span>{correct} correct out of {total} decisions</span>
                <span className="accuracy-pct" style={{ color: accColor }}>
                  {(accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="accuracy-bar-bg">
                <div
                  className="accuracy-bar-fill"
                  style={{ width: `${accuracy * 100}%`, background: barColor }}
                />
              </div>
            </div>
          </div>

          <div>
            <h3>Breakdown</h3>
            <div className="breakdown-grid">
              <div className="breakdown-card">
                <div className="breakdown-card-title">Should Call</div>
                <div className="breakdown-card-stat" style={{ color: callAcc !== null && callAcc >= 0.5 ? "#6fdc6f" : "#ff6b6b" }}>
                  {callAcc !== null ? `${(callAcc * 100).toFixed(1)}%` : "—"}
                </div>
                <div className="breakdown-card-detail">
                  {breakdown.shouldCall.correct}/{breakdown.shouldCall.total} correct
                </div>
              </div>
              <div className="breakdown-card">
                <div className="breakdown-card-title">Should Fold</div>
                <div className="breakdown-card-stat" style={{ color: foldAcc !== null && foldAcc >= 0.5 ? "#6fdc6f" : "#ff6b6b" }}>
                  {foldAcc !== null ? `${(foldAcc * 100).toFixed(1)}%` : "—"}
                </div>
                <div className="breakdown-card-detail">
                  {breakdown.shouldFold.correct}/{breakdown.shouldFold.total} correct
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {recent.length > 0 && (
        <div>
          <h3>Recent Attempts</h3>
          <table className="recent-table">
            <thead>
              <tr>
                <th>Hand</th>
                <th>Decision</th>
                <th>Equity</th>
                <th>Pot Odds</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id}>
                  <td>{a.scenario.holeCards.join(" ")}</td>
                  <td>{a.decision}</td>
                  <td>{(a.estimatedEq * 100).toFixed(1)}%</td>
                  <td>{(a.requiredEq * 100).toFixed(1)}%</td>
                  <td className={a.correct ? "recent-correct" : "recent-incorrect"}>
                    {a.correct ? "Correct" : "Wrong"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total === 0 && (
        <div className="stats-empty">No attempts yet — go train!</div>
      )}
    </div>
  );
}
