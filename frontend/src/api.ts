import type { AttemptResult, Scenario, Stats } from "./types";

export async function fetchScenario(): Promise<Scenario> {
  const res = await fetch("/api/scenario/new");
  if (!res.ok) throw new Error("Failed to fetch scenario");
  return res.json() as Promise<Scenario>;
}

export async function submitAttempt(
  scenarioId: number,
  decision: "fold" | "call"
): Promise<AttemptResult> {
  const res = await fetch("/api/attempt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId, decision }),
  });
  if (!res.ok) throw new Error("Failed to submit attempt");
  return res.json() as Promise<AttemptResult>;
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json() as Promise<Stats>;
}
