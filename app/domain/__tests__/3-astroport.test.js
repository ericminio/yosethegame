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

  it("hits /astroport of player", async (t) => {
    t.mock.method(global, "fetch", async (url) => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      text: async () => `${url}`,
    }));
    const result = await astroport.play("server-url");

    assert.equal(result.actual.content, "server-url/astroport");
  });

  it("requires a html page with expected content", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      text: async () =>
        '<html><body><label id="astroport-name">the best astroport ever</label></body></html>',
    }));
    const result = await astroport.play();

    assert.deepEqual(result, { status: "passed" });
    t.mock.restoreAll();
  });

  it("discloses expectations when received answer is wrong", async (t) => {
    t.mock.method(global, "fetch", async () => ({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      text: async () => "<html><body>nope</body></html>",
    }));
    const result = await astroport.play();

    assert.deepEqual(result, {
      status: "failed",
      expected: {
        status: 200,
        contentType: "text/html",
        content: "A web page containing #astroport-name",
      },
      actual: {
        status: 200,
        contentType: "text/html",
        content: "<html><body>nope</body></html>",
      },
    });
    t.mock.restoreAll();
  });
});
