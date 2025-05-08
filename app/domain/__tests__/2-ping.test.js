import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { Ping } from "../2-ping.js";

describe("Ping challenge", () => {
  let ping;
  beforeEach(() => {
    ping = new Ping();
  });

  it("requires a json with expected content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json; charset=utf-8",
      }),
      text: async () => JSON.stringify({ pong: "hi there!" }),
    }));
    const result = await ping.play("server-url");

    assert.deepEqual(result, { status: "passed" });
    t.mock.restoreAll();
  });

  it("discloses expectations when received status is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 404,
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => JSON.stringify({ pong: "not expected" }),
    }));
    const result = await ping.play("server-url");

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ pong: "hi there!" }),
      },
      actual: { error: "status 404 instead of 200" },
    });
    t.mock.restoreAll();
  });

  it("discloses expectations when received content-type is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      text: async () => JSON.stringify({ pong: "not expected" }),
    }));
    const result = await ping.play("server-url");

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ pong: "hi there!" }),
      },
      actual: { error: "content-type text/html instead of application/json" },
    });
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
    const result = await ping.play("server-url");

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "application/json",
        content: JSON.stringify({ pong: "hi there!" }),
      },
      actual: { error: 'content was not {"pong":"hi there!"}' },
    });
    t.mock.restoreAll();
  });
});
