import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { helloYose } from "../1-hello-yose.js";
import { ping } from "../2-ping.js";
import { astroport } from "../3-astroport.js";
import { Store } from "../store.js";

describe("Astroport challenge", () => {
  it("becomes open when hello-yose and ping passed", async () => {
    const store = new Store();
    assert.deepEqual(astroport.open(store), false);

    store.save(helloYose.name, { status: "passed" });
    store.save(ping.name, { status: "passed" });
    assert.deepEqual(astroport.open(store), true);
  });
});
