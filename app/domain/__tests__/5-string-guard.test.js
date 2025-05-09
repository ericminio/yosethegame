import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { Store } from "../store.js";
import { PowerOfTwo } from "../4-power-of-two.js";
import { StringGuard } from "../5-string-guard.js";
import { stringGuardChooser } from "../5-string-guard-lib.js";
import { Ping } from "../2-ping.js";

describe("String guard", () => {
  let stringGuard;
  beforeEach(() => {
    stringGuard = new StringGuard();
  });

  it("becomes open when power-of-two passed", async () => {
    const store = new Store();
    assert.deepEqual(stringGuard.open(store), false);

    store.save(new PowerOfTwo().name, { status: "passed" });
    assert.deepEqual(stringGuard.open(store), true);
  });

  it("becomes displayed when power-of-two passed", async () => {
    const store = new Store();
    assert.deepEqual(stringGuard.hidden(store), true);

    store.save(new PowerOfTwo().name, { status: "passed" });
    assert.deepEqual(stringGuard.hidden(store), false);
  });

  it("becomes teasing when power-of-two is open", async () => {
    const store = new Store();
    assert.deepEqual(stringGuard.teasing(store), false);

    store.save(new Ping().name, { status: "passed" });
    assert.deepEqual(stringGuard.teasing(store), true);
  });

  it("is not teasing when open", async () => {
    const store = new Store();
    assert.deepEqual(stringGuard.teasing(store), false);

    store.save(new Ping().name, { status: "passed" });
    store.save(new PowerOfTwo().name, { status: "passed" });
    assert.deepEqual(stringGuard.teasing(store), false);
  });

  it("requires a json with expected content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "application/json; charset=utf-8",
      }),
      text: async () =>
        JSON.stringify({ number: "oops", error: "not a number" }),
    }));
    t.mock.method(stringGuardChooser, "getString", () => "oops");
    const result = await stringGuard.play("server-url");

    assert.deepEqual(result, { status: "passed" });
    t.mock.restoreAll();
  });

  it("discloses expectations when status is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 404,
      headers: new Headers({
        "content-type": "application/json; charset=utf-8",
      }),
      text: async () =>
        JSON.stringify({ number: "oops", error: "not a number" }),
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
      text: async () =>
        JSON.stringify({ number: "oops", error: "not a number" }),
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
        error: "content-type text/plain instead of application/json",
      },
    });
    t.mock.restoreAll();
  });

  it("discloses expectations when answer is wrong", async (t) => {
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
        error: `content was not {"number":"oops","error":"not a number"}`,
      },
    });
    t.mock.restoreAll();
  });
});
