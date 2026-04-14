import { Hono } from "hono";
import { z } from "zod";
import prisma from "../prisma.ts";
import { calcEquity } from "../poker/monteCarlo.ts";
import { requiredEquity } from "../poker/scenario.ts";

export const app = new Hono();

const attemptSchema = z.object({
  scenarioId: z.number().int().positive(),
  street: z.enum(["flop", "turn"]),
  decision: z.enum(["fold", "call"]),
});

// POST /api/attempt
app.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const result = attemptSchema.safeParse(body);
  if (!result.success) return c.json({ error: result.error.flatten().fieldErrors }, 400);

  const { scenarioId, street, decision } = result.data;

  const scenario = await prisma.scenario.findUnique({ where: { id: scenarioId } });
  if (!scenario) return c.json({ error: "Scenario not found" }, 404);

  const pot = street === "turn" ? scenario.pot + scenario.bet : scenario.pot;
  const bet = street === "turn" ? scenario.turnBet : scenario.bet;
  const board = street === "turn"
    ? [...scenario.flop, scenario.turn]
    : scenario.flop;

  const estimatedEq = calcEquity(scenario.holeCards, board);
  const reqEq = requiredEquity(pot, bet);

  const MARGIN = 0.01;
  let correct: boolean;
  if (Math.abs(estimatedEq - reqEq) <= MARGIN) {
    correct = true;
  } else {
    correct = estimatedEq > reqEq ? decision === "call" : decision === "fold";
  }

  const explanation = buildExplanation(pot, bet, estimatedEq, reqEq, decision, correct, street);

  const attempt = await prisma.attempt.create({
    data: { scenarioId, street, decision, estimatedEq, requiredEq: reqEq, correct },
  });

  return c.json({
    id: attempt.id,
    street,
    decision,
    estimatedEq: +estimatedEq.toFixed(4),
    requiredEq: +reqEq.toFixed(4),
    correct,
    explanation,
  });
});

function buildExplanation(
  pot: number,
  bet: number,
  estimatedEq: number,
  reqEq: number,
  decision: string,
  correct: boolean,
  street: string
): string[] {
  const pct = (n: number) => (n * 100).toFixed(1) + "%";
  const streetLabel = street === "turn" ? "Turn" : "Flop";
  const lines: string[] = [];

  lines.push(`[${streetLabel}] Pot odds: ${pct(reqEq)} — you call ${bet} BB to win a pot of ${pot + bet} BB`);
  lines.push(`Estimated equity: ${pct(estimatedEq)} (Monte Carlo, 1000 simulations)`);

  if (estimatedEq > reqEq + 0.01) {
    lines.push(`Equity (${pct(estimatedEq)}) > pot odds (${pct(reqEq)}) → calling is profitable`);
  } else if (estimatedEq < reqEq - 0.01) {
    lines.push(`Equity (${pct(estimatedEq)}) < pot odds (${pct(reqEq)}) → folding is correct`);
  } else {
    lines.push(`Equity ≈ pot odds (within 1%) → borderline spot, either play is fine`);
  }

  lines.push(correct ? `You ${decision}ed — correct.` : `You ${decision}ed — incorrect.`);

  return lines;
}
