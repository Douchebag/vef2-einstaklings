import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fullDeck, shuffle } from "./deck.ts";

describe("fullDeck", () => {
  it("returns exactly 52 cards", () => {
    assert.equal(fullDeck().length, 52);
  });

  it("has no duplicate cards", () => {
    const deck = fullDeck();
    assert.equal(new Set(deck).size, 52);
  });

  it("contains Ac and 2c and Kh", () => {
    const deck = fullDeck();
    assert.ok(deck.includes("Ac"));
    assert.ok(deck.includes("2c"));
    assert.ok(deck.includes("Kh"));
  });
});

describe("shuffle", () => {
  it("returns the same number of cards", () => {
    const deck = fullDeck();
    assert.equal(shuffle(deck).length, 52);
  });

  it("contains the same cards after shuffling", () => {
    const deck = fullDeck();
    const shuffled = shuffle(deck);
    assert.equal(new Set(shuffled).size, 52);
    deck.forEach((c) => assert.ok(shuffled.includes(c)));
  });

  it("does not mutate the original array", () => {
    const deck = fullDeck();
    const first = deck[0];
    shuffle(deck);
    assert.equal(deck[0], first);
  });
});
