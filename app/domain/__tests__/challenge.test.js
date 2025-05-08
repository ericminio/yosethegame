import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { Challenge } from "../challenge.js";

describe("Challenge", () => {
  let challenge;
  beforeEach(() => {
    challenge = new Challenge("Welcome", "Welcome to the challenge");
  });

  it("can build url from segments", async () => {
    assert.equal(
      challenge.buildUrl(["http://localhost:3000", "one", "two"]),
      "http://localhost:3000/one/two",
    );
  });

  it("resists extract trailing slashes", async () => {
    assert.equal(
      challenge.buildUrl(["http://localhost:3000//", "one", "two"]),
      "http://localhost:3000/one/two",
    );
  });
});
