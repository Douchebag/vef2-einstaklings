import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calcEquity } from "./monteCarlo.ts";
import { generateScenario, requiredEquity } from "./scenario.ts";

describe("calcEquity", () => {
  it("returns a value between 0 and 1", () => {
    const eq = calcEquity(["Ac", "Kh"], ["2d", "7s", "Jc"]);
    assert.ok(eq >= 0 && eq <= 1, `Expected 0–1, got ${eq}`);
  });

  it("gives pocket aces strong equity", () => {
    const eq = calcEquity(["Ah", "As"], ["2c", "7d", "9h"]);
    assert.ok(eq > 0.6, `Expected >0.6 for AA, got ${eq}`);
  });

  it("gives 7-2 offsuit weak equity on an ace-high board", () => {
    const eq = calcEquity(["7h", "2d"], ["Ac", "Ks", "Qd"]);
    assert.ok(eq < 0.25, `Expected <0.25 for 72o on AKQ, got ${eq}`);
  });

  it("returns consistent results across calls (rough convergence)", () => {
    const hole = ["Tc", "Td"] as [string, string];
    const flop = ["2h", "5s", "8c"] as [string, string, string];
    const eq1 = calcEquity(hole, flop);
    const eq2 = calcEquity(hole, flop);
    assert.ok(Math.abs(eq1 - eq2) < 0.05, `Too much variance: ${eq1} vs ${eq2}`);
  });
});

describe("requiredEquity", () => {
  it("calculates correctly for standard pot odds", () => {
    assert.equal(requiredEquity(30, 10), 0.25);
  });

  it("increases as the bet-to-pot ratio increases", () => {
    assert.ok(requiredEquity(20, 20) > requiredEquity(20, 5));
  });
});

describe("generateScenario", () => {
  it("returns 2 hole cards and 3 flop cards with no duplicates", () => {
    const { holeCards, flop } = generateScenario();
    assert.equal(holeCards.length, 2);
    assert.equal(flop.length, 3);
    const all = [...holeCards, ...flop];
    assert.equal(new Set(all).size, 5);
  });

  it("has a positive pot and bet", () => {
    const { pot, bet } = generateScenario();
    assert.ok(pot > 0);
    assert.ok(bet > 0);
    assert.ok(bet < pot);
  });
});
