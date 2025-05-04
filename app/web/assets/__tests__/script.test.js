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
  });

  it("exposes renderChallenge", () => {
    assert.match(scripts, /const renderChallenge =/);
  });

  it("exposes store definition", () => {
    assert.match(scripts, /class Store /);
  });

  it("exposes primeFactorsOf", () => {
    assert.match(scripts, /const primeFactorsOf =/);
  });

  it("exposes powerOfTwoChooser", () => {
    assert.match(scripts, /const powerOfTwoChooser =/);
  });

  it("exposes stringGuardChooser", () => {
    assert.match(scripts, /const stringGuardChooser =/);
  });
});
