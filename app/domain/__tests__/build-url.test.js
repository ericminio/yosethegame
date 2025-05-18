import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { buildUrl } from "../build-url.js";

describe("Challenge", () => {
  it("can build url from segments", async () => {
    assert.equal(
      buildUrl(["http://localhost:3000", "one", "two"]),
      "http://localhost:3000/one/two",
    );
  });

  it("resists extract trailing slashes", async () => {
    assert.equal(
      buildUrl(["http://localhost:3000//", "one", "two"]),
      "http://localhost:3000/one/two",
    );
  });
});
