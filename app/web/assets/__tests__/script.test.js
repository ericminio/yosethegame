import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scripts } from "../scripts.js";

describe("scripts", () => {
  it("exposes challenges", () => {
    assert.match(scripts, /const challenges =/);
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
});
