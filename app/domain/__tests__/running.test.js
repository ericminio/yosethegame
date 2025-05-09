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
    assert.deepEqual(store.get("Astroport"), { status: "failed" });
  });

  it("updates score", async () => {
    await run(undefined, store);

    assert.equal(store.get("score"), 20);
  });

  it("resets score first", async () => {
    const spy = [];
    store.register("score", (value) => {
      spy.push(value);
    });
    assert.deepEqual(spy, [0]);
    await run(undefined, store);

    assert.deepEqual(spy, [0, 0, 20]);
  });

  it("resets results first", async () => {
    const spy = [];
    store.register("Ping", (value) => {
      spy.push(value);
    });
    await run(undefined, store);

    assert.deepEqual(spy, [null, { status: "passed" }]);
  });

  it("resists errors", async () => {
    const errorChallenge = {
      name: "Error Challenge",
      open: () => true,
      play: async () => {
        throw new Error("Challenge failed");
      },
    };
    store.save("challenges", [errorChallenge]);
    await run(undefined, store);

    assert.deepEqual(store.get("Error Challenge"), {
      status: "failed",
      message: "Challenge failed",
    });
  });

  it("notifies for running start and end", async () => {
    const spy = [];
    store.register("running", (value) => {
      spy.push(value);
    });
    assert.deepEqual(spy, [false]);

    await run(undefined, store);
    assert.deepEqual(spy, [false, true, false]);
  });
});
