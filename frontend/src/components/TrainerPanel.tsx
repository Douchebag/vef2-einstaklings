import { useState } from "react";
import { fetchScenario, submitAttempt } from "../api";
import type { AttemptResult, Scenario } from "../types";
import "./TrainerPanel.css";

const SUIT_SYMBOL: Record<string, string> = { c: "♣", d: "♦", h: "♥", s: "♠" };
const SUIT_COLOR: Record<string, string> = { c: "black", d: "red", h: "red", s: "black" };

function CardTile({ card, faceDown = false }: { card: string; faceDown?: boolean }) {
  if (faceDown) return <div className="card-tile face-down" />;
  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  return (
    <div className={`card-tile ${SUIT_COLOR[suit]}`}>
      <span className="card-rank">{rank}</span>
      <span className="card-suit">{SUIT_SYMBOL[suit]}</span>
    </div>
  );
}

type Phase = "idle" | "flop" | "flop-result" | "turn" | "turn-result";

export function TrainerPanel() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [flopResult, setFlopResult] = useState<AttemptResult | null>(null);
  const [turnResult, setTurnResult] = useState<AttemptResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNewHand() {
    setLoading(true);
    setError(null);
    try {
      const s = await fetchScenario();
      setScenario(s);
      setFlopResult(null);
      setTurnResult(null);
      setPhase("flop");
    } catch {
      setError("Could not load hand. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleDecision(street: "flop" | "turn", decision: "fold" | "call") {
    if (!scenario) return;
    setLoading(true);
    setError(null);
    try {
      const r = await submitAttempt(scenario.id, street, decision);
      setStreak((prev) => (r.correct ? prev + 1 : 0));
      if (street === "flop") {
        setFlopResult(r);
        setPhase("flop-result");
      } else {
        setTurnResult(r);
        setPhase("turn-result");
      }
    } catch {
      setError("Could not submit attempt. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  const turnPot = scenario ? scenario.pot + scenario.bet : 0;

  return (
    <main className="trainer">
      {streak > 0 && (
        <div className="streak">
          <span className="streak-label">Streak</span>
          <span className="streak-count">{streak}</span>
        </div>
      )}

      {error && <p className="trainer-error">{error}</p>}

      {phase === "idle" && (
        <button onClick={handleNewHand} disabled={loading} className="new-hand-btn">
          {loading ? "Loading…" : "New Hand"}
        </button>
      )}

      {scenario && phase !== "idle" && (
        <>
          {/* Board */}
          <section className="board">
            <div className="card-group">
              <span className="card-label">Your hand</span>
              <div className="cards">
                {scenario.holeCards.map((c) => (
                  <CardTile key={c} card={c} />
                ))}
              </div>
            </div>
            <div className="card-group">
              <span className="card-label">Flop</span>
              <div className="cards">
                {scenario.flop.map((c) => (
                  <CardTile key={c} card={c} />
                ))}
              </div>
            </div>
            <div className="card-group">
              <span className="card-label">Turn</span>
              <div className="cards">
                {phase === "flop" || phase === "flop-result" ? (
                  <CardTile card="" faceDown />
                ) : (
                  <CardTile card={scenario.turn} />
                )}
              </div>
            </div>
          </section>

          {/* Pot info — changes per street */}
          {(phase === "flop" || phase === "flop-result") && (
            <section className="pot-info">
              <div className="pot-item">
                <span className="pot-label">Pot</span>
                <span className="pot-value">{scenario.pot} BB</span>
              </div>
              <div className="pot-divider" />
              <div className="pot-item">
                <span className="pot-label">To call</span>
                <span className="pot-value">{scenario.bet} BB</span>
              </div>
            </section>
          )}

          {(phase === "turn" || phase === "turn-result") && (
            <section className="pot-info">
              <div className="pot-item">
                <span className="pot-label">Pot</span>
                <span className="pot-value">{turnPot} BB</span>
              </div>
              <div className="pot-divider" />
              <div className="pot-item">
                <span className="pot-label">To call</span>
                <span className="pot-value">{scenario.turnBet} BB</span>
              </div>
            </section>
          )}

          {/* Flop decision */}
          {phase === "flop" && (
            <div className="decision-btns">
              <button className="btn-fold" onClick={() => handleDecision("flop", "fold")} disabled={loading}>
                Fold
              </button>
              <button className="btn-call" onClick={() => handleDecision("flop", "call")} disabled={loading}>
                Call {scenario.bet} BB
              </button>
            </div>
          )}

          {/* Flop result */}
          {phase === "flop-result" && flopResult && (
            <section className={`feedback ${flopResult.correct ? "correct" : "incorrect"}`}>
              <p className="feedback-street">Flop</p>
              <p className="feedback-verdict">{flopResult.correct ? "Correct ✓" : "Incorrect ✗"}</p>
              <ul className="feedback-lines">
                {flopResult.explanation.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              {flopResult.decision === "call" ? (
                <button className="new-hand-btn" onClick={() => setPhase("turn")} disabled={loading}>
                  See turn →
                </button>
              ) : (
                <button className="new-hand-btn" onClick={handleNewHand} disabled={loading}>
                  {loading ? "Loading…" : "Next Hand"}
                </button>
              )}
            </section>
          )}

          {/* Turn decision */}
          {phase === "turn" && (
            <div className="decision-btns">
              <button className="btn-fold" onClick={() => handleDecision("turn", "fold")} disabled={loading}>
                Fold
              </button>
              <button className="btn-call" onClick={() => handleDecision("turn", "call")} disabled={loading}>
                Call {scenario.turnBet} BB
              </button>
            </div>
          )}

          {/* Turn result */}
          {phase === "turn-result" && turnResult && (
            <section className={`feedback ${turnResult.correct ? "correct" : "incorrect"}`}>
              <p className="feedback-street">Turn</p>
              <p className="feedback-verdict">{turnResult.correct ? "Correct ✓" : "Incorrect ✗"}</p>
              <ul className="feedback-lines">
                {turnResult.explanation.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <button className="new-hand-btn" onClick={handleNewHand} disabled={loading}>
                {loading ? "Loading…" : "Next Hand"}
              </button>
            </section>
          )}
        </>
      )}
    </main>
  );
}
