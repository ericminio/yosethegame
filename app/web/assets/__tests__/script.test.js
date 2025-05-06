import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scripts } from "../scripts.js";

describe("scripts", () => {
  it("exposes challenges classes definition", () => {
    assert.match(scripts, /class Challenge /);
    assert.match(scripts, /class HelloYose /);
    assert.match(scripts, /class Ping /);
    assert.match(scripts, /class PowerOfTwo /);
    assert.match(scripts, /class StringGuard /);
    assert.match(scripts, /class Astroport /);
    assert.match(scripts, /class Gates /);
    assert.match(scripts, /class Dock /);
    assert.match(scripts, /class Keep /);
    assert.match(scripts, /class ChallengeAstroport /);
  });

  it("exposes renderChallenge", () => {
    assert.match(scripts, /const renderChallenge =/);
  });

  it("exposes store definition", () => {
    assert.match(scripts, /class Store /);
  });

  it("exposes libs", () => {
    assert.match(scripts, /const primeFactorsOf =/);
    assert.match(scripts, /const powerOfTwoChooser =/);
    assert.match(scripts, /const stringGuardChooser =/);
    assert.match(scripts, /const shipChooser =/);
  });
});
