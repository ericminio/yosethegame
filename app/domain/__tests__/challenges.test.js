import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { challenges } from "../challenges.js";

describe("Challenges array", () => {
  it("is exposed as expected", async () => {
    assert.equal(challenges.length, 5);
  });
});
