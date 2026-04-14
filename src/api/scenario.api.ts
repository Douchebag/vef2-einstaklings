import { Hono } from "hono";
import prisma from "../prisma.ts";
import { generateScenario } from "../poker/scenario.ts";

export const app = new Hono();

// GET /api/scenario/new
app.get("/new", async (c) => {
  const { holeCards, flop, turn, pot, bet, turnBet } = generateScenario();

  const scenario = await prisma.scenario.create({
    data: { holeCards, flop, turn, pot, bet, turnBet },
  });

  return c.json({
    id: scenario.id,
    holeCards: scenario.holeCards,
    flop: scenario.flop,
    turn: scenario.turn,
    pot: scenario.pot,
    bet: scenario.bet,
    turnBet: scenario.turnBet,
  });
});
