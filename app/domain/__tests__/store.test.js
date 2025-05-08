import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { Store } from "../store.js";

describe("Store", () => {
  let store;
  beforeEach(() => {
    store = new Store();
  });

  it("starts with score zero", async () => {
    assert.equal(store.get("score"), 0);
  });

  it("starts not running", async () => {
    assert.equal(store.get("running"), false);
  });
});
