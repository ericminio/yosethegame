import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { helloYose } from "../1-hello-yose.js";

describe("Hello Yose challenge", () => {
  it("hits home page of player", async (t) => {
    t.mock.method(global, "fetch", async (url) => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/plain",
      }),
      text: async () => `${url}`,
    }));
    const result = await helloYose.play("server-url");

    assert.deepEqual(result.actual.content, "server-url");
    t.mock.restoreAll();
  });

  it("requires a html page with Hello Yose content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      text: async () => "<html><body>Hello Yose</body></html>",
    }));
    const result = await helloYose.play();

    assert.deepEqual(result, { status: "passed" });
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
        status: 200,
        contentType: "text/html",
        content: "<html><body>This is a web page</body></html>",
      },
    });
    t.mock.restoreAll();
  });
});
