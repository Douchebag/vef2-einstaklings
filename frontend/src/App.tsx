import { useState } from "react";
import { TrainerPanel } from "./components/TrainerPanel";
import "./App.css";

type Tab = "trainer" | "stats";

export function App() {
  const [tab, setTab] = useState<Tab>("trainer");

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">POKER TRAINER</span>
        </div>
        <nav className="nav">
          <TabBtn active={tab === "trainer"} onClick={() => setTab("trainer")}>
            Train
          </TabBtn>
          <TabBtn active={tab === "stats"} onClick={() => setTab("stats")}>
            Stats
          </TabBtn>
        </nav>
      </header>

      {tab === "trainer" && <TrainerPanel />}

      {tab === "stats" && (
        <main className="stats-placeholder">
          <p>Stats</p>
        </main>
      )}
    </div>
  );
}

function TabBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`tab-btn${active ? " active" : ""}`}>
      {children}
    </button>
  );
}
