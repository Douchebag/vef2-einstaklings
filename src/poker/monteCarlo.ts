import { createRequire } from "module";
import { fullDeck, shuffle } from "./deck.ts";
import type { Card } from "./deck.ts";

const require = createRequire(import.meta.url);
const { Hand } = require("pokersolver") as {
  Hand: {
    solve: (cards: string[]) => { rank: number; descr: string };
    winners: (hands: { rank: number; descr: string }[]) => { rank: number; descr: string }[];
  };
};

const SIMULATIONS = 1000;

export function calcEquity(holeCards: Card[], boardCards: Card[], numVillains = 1): number {
  if (boardCards.length > 5) {
    throw new Error(`boardCards must be 0–5 cards, got ${boardCards.length}`);
  }

  const known = new Set([...holeCards, ...boardCards]);
  const remaining = fullDeck().filter((c) => !known.has(c));
  const cardsToRun = 5 - boardCards.length;

  let wins = 0;
  let ties = 0;

  for (let i = 0; i < SIMULATIONS; i++) {
    const deck = shuffle(remaining);
    const villainHands: string[][] = [];
    for (let v = 0; v < numVillains; v++) {
      villainHands.push([deck[v * 2], deck[v * 2 + 1]]);
    }
    const runout = deck.slice(numVillains * 2, numVillains * 2 + cardsToRun);
    const board5 = [...boardCards, ...runout];

    const heroHand = Hand.solve([...holeCards, ...board5]);
    const solvedVillains = villainHands.map((vh) => Hand.solve([...vh, ...board5]));
    const allHands = [heroHand, ...solvedVillains];
    const winners = Hand.winners(allHands);

    if (winners.includes(heroHand)) {
      if (winners.length === 1) wins++;
      else ties++;
    }
  }

  return (wins + ties * 0.5) / SIMULATIONS;
}
