import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { HelloYose } from "../1-hello-yose.js";
import { Astroport } from "../3-astroport.js";
import { Store } from "../store.js";

describe("Astroport challenge", () => {
  let astroport;
  beforeEach(() => {
    astroport = new Astroport();
  });

  it("becomes open when hello-yose passed", async () => {
    const store = new Store();
    assert.deepEqual(astroport.open(store), false);

    store.save(new HelloYose().name, { status: "passed" });
    assert.deepEqual(astroport.open(store), true);
  });
});
