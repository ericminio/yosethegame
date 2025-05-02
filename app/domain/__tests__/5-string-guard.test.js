import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { Store } from "../store.js";
import { powerOfTwo } from "../4-power-of-two.js";
import { stringGuard } from "../5-string-guard.js";
import { stringGuardChooser } from "../5-string-guard-lib.js";

describe("String guard", () => {
  it("becomes open when power-of-two passed", async () => {
    const store = new Store();
    assert.deepEqual(stringGuard.open(store), false);

    store.save(powerOfTwo.name, { status: "passed" });
    assert.deepEqual(stringGuard.open(store), true);
  });

  it("hits /primeFactors of player", async (t) => {
    t.mock.method(global, "fetch", async (url) => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => `${url}`,
    }));
    t.mock.method(stringGuardChooser, "getString", () => "oops");
    const result = await stringGuard.play("server-url");

    assert.equal(result.actual.content, "server-url/primeFactors?number=oops");
    t.mock.restoreAll();
  });

  it("requires a json with expected content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () =>
        JSON.stringify({ number: "oops", error: "not a number" }),
    }));
    t.mock.method(stringGuardChooser, "getString", () => "oops");
    const result = await stringGuard.play("server-url");

    assert.deepEqual(result, { status: "passed" });
    t.mock.restoreAll();
  });

  it("discloses expectations on failure", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () =>
        JSON.stringify({ number: "double oops", error: "not a number" }),
    }));
    t.mock.method(stringGuardChooser, "getString", () => "oops");
    const result = await stringGuard.play("server-url");

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ number: "oops", error: "not a number" }),
      },
      actual: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({
          number: "double oops",
          error: "not a number",
        }),
      },
    });
    t.mock.restoreAll();
  });
});
