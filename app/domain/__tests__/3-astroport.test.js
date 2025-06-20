import { describe, it, beforeEach, before, after } from "node:test";
import { strict as assert } from "node:assert";

import { HelloYose } from "../1-hello-yose.js";
import { Astroport } from "../3-astroport.js";
import { Store } from "../store.js";
import { Server } from "../../../playing/yop/http/server.js";

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

  it("is never hidden", async () => {
    const store = new Store();
    assert.deepEqual(astroport.hidden(store), false);
  });

  it("is never teasing", async () => {
    const store = new Store();
    assert.deepEqual(astroport.teasing(store), false);
  });

  describe("playing", () => {
    let playerServer;
    let playerServerUrl;
    let answerWith = () => "";
    const player = (request, response) => {
      if (request.url !== "/astroport") {
        response.writeHead(404, {
          "content-type": "text/plain",
          "content-length": 0,
        });
        response.end();
        return;
      }
      const { status, contentType, content } = answerWith(request);
      response.writeHead(status, {
        "Access-Control-Allow-Origin": "*",
        "content-type": contentType,
        "content-length": content.length,
      });
      response.end(content);
    };
    before(async () => {
      playerServer = new Server(player);
      const playerServerPort = await playerServer.start();
      playerServerUrl = `http://localhost:${playerServerPort}`;
    });
    after(async () => {
      await playerServer.stop();
    });

    it("requires a html page with expected content", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content:
          '<html><body><label id="astroport-name">the best astroport ever</label></body></html>',
      });
      const result = await astroport.play(playerServerUrl);

      assert.deepEqual(result, { status: "passed" });
    });

    it("discloses expectations when field is missing", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: "<html><body></body></html>",
      });
      const result = await astroport.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          status: 200,
          contentType: "text/html",
          content:
            "A web page behind /astroport containing non-empty element #astroport-name",
        },
        actual: {
          error: "missing element #astroport-name",
        },
      });
    });

    it("discloses expectations when field is empty", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content:
          '<html><body><label id="astroport-name"></label></body></html>',
      });
      const result = await astroport.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          status: 200,
          contentType: "text/html",
          content:
            "A web page behind /astroport containing non-empty element #astroport-name",
        },
        actual: {
          error: "Element #astroport-name is empty",
        },
      });
    });

    it("discloses expectations when contentType is wrong", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/plain",
        content:
          '<html><body><label id="astroport-name">best name ever</label></body></html>',
      });
      const result = await astroport.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          status: 200,
          contentType: "text/html",
          content:
            "A web page behind /astroport containing non-empty element #astroport-name",
        },
        actual: {
          error:
            'The given content type of "text/plain" was not a HTML or XML content type',
        },
      });
    });

    it("discloses expectations when statusCode is wrong", async (t) => {
      answerWith = () => ({
        status: 404,
        contentType: "text/plain",
        content: "NOT FOUND",
      });
      const result = await astroport.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          status: 200,
          contentType: "text/html",
          content:
            "A web page behind /astroport containing non-empty element #astroport-name",
        },
        actual: {
          error: "Resource was not loaded. Status: 404",
        },
      });
    });
  });
});
