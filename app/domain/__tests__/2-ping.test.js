import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { Ping } from "../2-ping.js";

describe("Ping challenge", () => {
  let ping;
  beforeEach(() => {
    ping = new Ping();
  });

  it("hits /ping of player", async (t) => {
    t.mock.method(global, "fetch", async (url) => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/plain",
      }),
      text: async () => `${url}`,
    }));
    const result = await ping.play("server-url");

    assert.deepEqual(result.actual.content, "server-url/ping");
    t.mock.restoreAll();
  });

  it("requires a json with expected content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => JSON.stringify({ pong: "hi there!" }),
    }));
    const result = await ping.play();

    assert.deepEqual(result, { status: "passed" });
    t.mock.restoreAll();
  });

  it("discloses expectations when received answer is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => JSON.stringify({ pong: "not expected" }),
    }));
    const result = await ping.play();

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ pong: "hi there!" }),
      },
      actual: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ pong: "not expected" }),
      },
    });
    t.mock.restoreAll();
  });
});
