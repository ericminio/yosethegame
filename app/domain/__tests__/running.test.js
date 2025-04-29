import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { run } from "../running.js";
import { Store } from "../store.js";

describe("Running", () => {
  const challenges = [
    {
      name: "Hello Yose",
      open: () => true,
      play: async () => ({ status: "passed" }),
    },
    {
      name: "Ping",
      open: () => true,
      play: async () => ({
        status: "failed",
        expected: { field: "value" },
        actual: { field: "something else" },
      }),
    },
    {
      name: "Astroport",
      open: () => false,
      play: async () => ({ status: "failed" }),
    },
  ];
  let store;
  beforeEach(() => {
    store = new Store();
    store.save("challenges", challenges);
  });
  it("updates results of open challenges", async () => {
    await run(undefined, store);

    assert.deepEqual(store.get("Hello Yose"), { status: "passed" });
    assert.deepEqual(store.get("Ping"), {
      status: "failed",
      expected: { field: "value" },
      actual: { field: "something else" },
    });
    assert.equal(store.get("Astroport"), undefined);
  });

  it("updates score", async () => {
    await run(undefined, store);

    assert.equal(store.get("score"), 10);
  });
});
