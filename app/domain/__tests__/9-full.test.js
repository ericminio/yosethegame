import { describe, it, beforeEach, afterEach, before, after } from "node:test";
import { strict as assert } from "node:assert";

import { Store } from "../store.js";
import { Dock } from "../7-dock.js";
import { Keep } from "../8-keep.js";
import { Full } from "../9-full.js";

describe("Full challenge", () => {
  let full;
  beforeEach(() => {
    full = new Full();
  });

  it("becomes open when Keep passed", async () => {
    const store = new Store();
    assert.deepEqual(full.open(store), false);

    store.save(new Keep().name, { status: "passed" });
    assert.deepEqual(full.open(store), true);
  });

  it("becomes displayed when Keep passed", async () => {
    const store = new Store();
    assert.deepEqual(full.hidden(store), true);

    store.save(new Keep().name, { status: "passed" });
    assert.deepEqual(full.hidden(store), false);
  });

  it("becomes teasing when Keep is open", async () => {
    const store = new Store();
    assert.deepEqual(full.teasing(store), false);

    store.save(new Dock().name, { status: "passed" });
    assert.deepEqual(full.teasing(store), true);
  });

  it("is not teasing when open", async () => {
    const store = new Store();
    assert.deepEqual(full.teasing(store), false);

    store.save(new Keep().name, { status: "passed" });
    assert.deepEqual(full.teasing(store), false);
  });
});
