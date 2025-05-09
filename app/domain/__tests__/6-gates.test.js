import { describe, it, beforeEach, before, after } from "node:test";
import { strict as assert } from "node:assert";

import { Astroport } from "../3-astroport.js";
import { Store } from "../store.js";
import { Gates } from "../6-gates.js";
import { HelloYose } from "../1-hello-yose.js";
import { Server } from "../../../playing/yop/http/server.js";

describe("Gates challenge", () => {
  let gates;
  beforeEach(() => {
    gates = new Gates();
  });

  it("becomes open when astroport passed", async () => {
    const store = new Store();
    assert.deepEqual(gates.open(store), false);

    store.save(new Astroport().name, { status: "passed" });
    assert.deepEqual(gates.open(store), true);
  });

  it("becomes displayed when astroport passed", async () => {
    const store = new Store();
    assert.deepEqual(gates.hidden(store), true);

    store.save(new Astroport().name, { status: "passed" });
    assert.deepEqual(gates.hidden(store), false);
  });

  it("becomes teasing when astroport is open", async () => {
    const store = new Store();
    assert.deepEqual(gates.teasing(store), false);

    store.save(new HelloYose().name, { status: "passed" });
    assert.deepEqual(gates.teasing(store), true);
  });

  it("is not teasing when open", async () => {
    const store = new Store();
    assert.deepEqual(gates.teasing(store), false);

    store.save(new Astroport().name, { status: "passed" });
    assert.deepEqual(gates.teasing(store), false);
  });

  describe("playing", () => {
    let playerServer;
    let playerServerUrl;
    let answerWith = () => "<html><body>nothing yet</body></html>";
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
      const contentAsOneLine = content.replace(/\s*\n\s*/g, "").trim();
      response.writeHead(status, {
        "Access-Control-Allow-Origin": "*",
        "content-type": contentType,
        "content-length": contentAsOneLine.length,
      });
      response.end(contentAsOneLine);
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
        content: `<html><body>
                    <div id="gate-1"><label id="ship-1"></label></div>
                    <div id="gate-2"><label id="ship-2"></label></div>
                    <div id="gate-3"><label id="ship-3"></label></div>
                  </body ></html > `,
      });
      const result = await gates.play(playerServerUrl);

      assert.deepEqual(result, { status: "passed" });
    });

    it("discloses expectations when content is wrong", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: `<html><body>
                    <div id="gate-1"><label id="ship-1"></label></div>
                  </body ></html > `,
      });
      const result = await gates.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          status: 200,
          contentType: "text/html",
          content:
            "A web page containing #gate-1 #ship-1, #gate-2 #ship 2, #gate-3 ship-3",
        },
        actual: {
          error: "only 1 gate(s) found",
        },
      });
    });
  });
});
