import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { Store } from "../store.js";
import { ping } from "../2-ping.js";
import { powerOfTwo } from "../4-power-of-two.js";
import { powerOfTwoChooser } from "../4-power-of-two-lib.js";

describe("Power of two challenge", () => {
  it("becomes open when ping passed", async () => {
    const store = new Store();
    assert.deepEqual(powerOfTwo.open(store), false);

    store.save(ping.name, { status: "passed" });
    assert.deepEqual(powerOfTwo.open(store), true);
  });

  it("hits /primeFactors of player", async (t) => {
    t.mock.method(global, "fetch", async (url) => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => `${url}`,
    }));
    t.mock.method(powerOfTwoChooser, "getNumber", () => 4);
    const result = await powerOfTwo.play("server-url");

    assert.equal(result.actual.content, "server-url/primeFactors?number=4");
    t.mock.restoreAll();
  });

  it("requires a json with expected content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => JSON.stringify({ number: 4, decomposition: [2, 2] }),
    }));
    t.mock.method(powerOfTwoChooser, "getNumber", () => 4);
    const result = await powerOfTwo.play("server-url");

    assert.deepEqual(result, { status: "passed" });
    t.mock.restoreAll();
  });

  it("discloses expectations on failure", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => JSON.stringify({ number: 4, decomposition: [2, 2] }),
    }));
    t.mock.method(powerOfTwoChooser, "getNumber", () => 8);
    const result = await powerOfTwo.play("server-url");

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ number: 8, decomposition: [2, 2, 2] }),
      },
      actual: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ number: 4, decomposition: [2, 2] }),
      },
    });
    t.mock.restoreAll();
  });
});
