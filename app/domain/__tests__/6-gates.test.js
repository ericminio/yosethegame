import { describe, it, beforeEach, before, after } from "node:test";
import { strict as assert } from "node:assert";

import { Astroport } from "../3-astroport.js";
import { Store } from "../store.js";
import { Gates } from "../6-gates.js";
import { HelloYose } from "../1-hello-yose.js";

describe("Gates challenge", () => {
  let gates;
  beforeEach(() => {
    gates = new Gates();
  });

  it("becomes open when astroport passed", async () => {
    const store = new Store();
    assert.deepEqual(gates.open(store), false);

    store.save(new Astroport().name, { status: "passed" });
    assert.deepEqual(gates.open(store), true);
  });

  it("becomes displayed when astroport passed", async () => {
    const store = new Store();
    assert.deepEqual(gates.hidden(store), true);

    store.save(new Astroport().name, { status: "passed" });
    assert.deepEqual(gates.hidden(store), false);
  });

  it("becomes teasing when astroport is open", async () => {
    const store = new Store();
    assert.deepEqual(gates.teasing(store), false);

    store.save(new HelloYose().name, { status: "passed" });
    assert.deepEqual(gates.teasing(store), true);
  });
});
