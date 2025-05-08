import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { Store } from "../store.js";
import { Ping } from "../2-ping.js";
import { PowerOfTwo } from "../4-power-of-two.js";
import { powerOfTwoChooser } from "../4-power-of-two-lib.js";

describe("Power of two challenge", () => {
  let powerOfTwo;
  beforeEach(() => {
    powerOfTwo = new PowerOfTwo();
  });

  it("becomes open when ping passed", async () => {
    const store = new Store();
    assert.deepEqual(powerOfTwo.open(store), false);

    store.save(new Ping().name, { status: "passed" });
    assert.deepEqual(powerOfTwo.open(store), true);
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

  it("discloses expectations status is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 404,
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
        error: "status 404 instead of 200",
      },
    });
    t.mock.restoreAll();
  });

  it("discloses expectations when content type is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/plain",
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
        error: "content-type text/plain instead of application/json",
      },
    });
    t.mock.restoreAll();
  });

  it("discloses expectations when decomposition is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => JSON.stringify({ number: 4, decomposition: [6, 6, 6] }),
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
        content: JSON.stringify({ number: 4, decomposition: [6, 6, 6] }),
      },
    });
    t.mock.restoreAll();
  });

  it("resists too big answers", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () =>
        "can you resists this long string that maybe will make your UI crash???",
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
        content: "can you resists this long string that maybe will m",
      },
    });
    t.mock.restoreAll();
  });
});
