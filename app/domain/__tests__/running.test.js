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
      play: async () => ({ status: "passed" }),
    },
    {
      name: "Astroport",
      open: (store) => store.get("Hello Yose") && store.get("Ping"),
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
    assert.deepEqual(store.get("Ping"), { status: "passed" });
  });

  it("updates score", async () => {
    await run(undefined, store);

    assert.equal(store.get("score"), 20);
  });

  it("keeps going with challenges that becomes open", async () => {
    await run(undefined, store);

    assert.deepEqual(store.get("Astroport"), { status: "failed" });
  });
});
