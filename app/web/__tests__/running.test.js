import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { run } from "../running.js";
import { Store } from "../../domain/store.js";

describe("Running", () => {
  const challenges = [
    { name: "Hello Yose", open: true, play: async () => "passed" },
    { name: "Ping", open: true, play: async () => "failed" },
    { name: "Astroport", open: false, play: async () => "failed" },
  ];
  const components = [{ id: "url", value: "http://localhost:3000" }];
  const document = {
    getElementById: (id) => components.find((c) => c.id === id),
  };
  let store;
  beforeEach(() => {
    store = new Store();
    store.save("challenges", challenges);
  });
  it("updates results of open challenges", async () => {
    await run(document, challenges, store);

    assert.equal(store.get("Hello Yose"), "passed");
    assert.equal(store.get("Ping"), "failed");
    assert.equal(store.get("Astroport"), undefined);
  });

  it("updates score", async () => {
    await run(document, challenges, store);

    assert.equal(store.get("score"), 10);
  });
});
