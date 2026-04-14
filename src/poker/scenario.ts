import { fullDeck, shuffle } from "./deck.ts";
import type { Card } from "./deck.ts";

export type ScenarioData = {
  holeCards: [Card, Card];
  flop: [Card, Card, Card];
  turn: Card;
  pot: number;
  bet: number;
  turnBet: number;
};

export function generateScenario(): ScenarioData {
  const deck = shuffle(fullDeck());

  const holeCards: [Card, Card] = [deck[0], deck[1]];
  const flop: [Card, Card, Card] = [deck[2], deck[3], deck[4]];
  const turn: Card = deck[5];

  const pot = Math.floor(Math.random() * 41 + 10);
  const minBet = Math.max(2, Math.floor(pot * 0.25));
  const maxBet = Math.floor(pot * 0.8);
  const bet = Math.floor(Math.random() * (maxBet - minBet + 1)) + minBet;

  const turnPot = pot + bet;
  const minTurnBet = Math.max(2, Math.floor(turnPot * 0.25));
  const maxTurnBet = Math.floor(turnPot * 0.8);
  const turnBet = Math.floor(Math.random() * (maxTurnBet - minTurnBet + 1)) + minTurnBet;

  return { holeCards, flop, turn, pot, bet, turnBet };
}

export function requiredEquity(pot: number, bet: number): number {
  return bet / (pot + bet);
}
