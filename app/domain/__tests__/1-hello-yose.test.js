import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { HelloYose } from "../1-hello-yose.js";

describe("Hello Yose challenge", () => {
  let helloYose;
  beforeEach(() => {
    helloYose = new HelloYose();
  });

  it("requires a html page with Hello Yose content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/html; charset=UTF-8",
      }),
      text: async () => "<html><body>Hello Yose</body></html>",
    }));
    const result = await helloYose.play();

    assert.deepEqual(result, { status: "passed" });
    t.mock.restoreAll();
  });

  it("discloses expectations when received status is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 404,
      headers: new Headers({
        "content-type": "text/html",
      }),
      text: async () => "<html><body>This is a web page</body></html>",
    }));
    const result = await helloYose.play();

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "text/html",
        content: 'A web page containing text "Hello Yose"',
      },
      actual: {
        error: "status 404 instead of 200",
      },
    });
    t.mock.restoreAll();
  });

  it("discloses expectations when received content-type is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/plain",
      }),
      text: async () => "Hello Yose",
    }));
    const result = await helloYose.play();

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "text/html",
        content: 'A web page containing text "Hello Yose"',
      },
      actual: {
        error: "content-type text/plain instead of text/html",
      },
    });
    t.mock.restoreAll();
  });

  it("discloses expectations when received answer is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      text: async () => "<html><body>This is a web page</body></html>",
    }));
    const result = await helloYose.play();

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "text/html",
        content: 'A web page containing text "Hello Yose"',
      },
      actual: {
        error: "'Hello Yose' not found in content",
      },
    });
    t.mock.restoreAll();
  });
});
