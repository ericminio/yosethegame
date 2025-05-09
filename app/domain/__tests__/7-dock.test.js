import { describe, it, beforeEach, afterEach, before, after } from "node:test";
import { strict as assert } from "node:assert";

import { Astroport } from "../3-astroport.js";
import { Store } from "../store.js";
import { Gates } from "../6-gates.js";
import { Server } from "../../../playing/yop/http/server.js";
import { Dock } from "../7-dock.js";
import { shipChooser } from "../7-dock-lib.js";

describe("Dock challenge", () => {
  let dock;
  beforeEach(() => {
    dock = new Dock();
  });

  it("becomes open when Gates passed", async () => {
    const store = new Store();
    assert.deepEqual(dock.open(store), false);

    store.save(new Gates().name, { status: "passed" });
    assert.deepEqual(dock.open(store), true);
  });

  it("becomes displayed when Gates passed", async () => {
    const store = new Store();
    assert.deepEqual(dock.hidden(store), true);

    store.save(new Gates().name, { status: "passed" });
    assert.deepEqual(dock.hidden(store), false);
  });

  it("becomes teasing when Gates is open", async () => {
    const store = new Store();
    assert.deepEqual(dock.teasing(store), false);

    store.save(new Astroport().name, { status: "passed" });
    assert.deepEqual(dock.teasing(store), true);
  });

  it("is not teasing when open", async () => {
    const store = new Store();
    assert.deepEqual(dock.teasing(store), false);

    store.save(new Gates().name, { status: "passed" });
    assert.deepEqual(dock.teasing(store), false);
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
    beforeEach((t) => {
      t.mock.method(shipChooser, "getShipName", () => "The Black Pearl");
    });
    afterEach((t) => {
      t.mock.restoreAll();
    });

    it("requires a html page with expected behavior eventually", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: `
            <html>
                <body>
                    <div id="gate-1">
                        <label id="ship-1"></label>
                    </div>
                    <div>
                        <input id="ship" />
                        <button id="dock">Dock</button>
                    </div>

                    <script>
                        document.getElementById("dock").addEventListener('click', () => {
                            setTimeout(() => {
                                const shipName = document.getElementById("ship").value;
                                document.getElementById("ship-1").innerHTML = "" + shipName + " was docked";
                            }, 100);
                        });
                    </script>
                </body >
            </html > `,
      });
      const result = await dock.play(playerServerUrl);

      assert.deepEqual(result, { status: "passed" });
    });

    it("discloses expectations when #ship is missing", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: `
            <html>
                <body>
                    <div id="gate-1">
                        <label id="ship-1"></label>
                    </div>
                    <div>
                        <button id="dock">Dock</button>
                    </div>
                </body >
            </html > `,
      });
      const result = await dock.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          content:
            "A web page containing a #ship input field, and a #dock button",
        },
        actual: {
          error: "input field #ship is missing",
        },
      });
    });

    it("discloses expectations when #dock is missing", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: `
            <html>
                <body>
                    <div id="gate-1">
                        <label id="ship-1"></label>
                    </div>
                    <div>
                        <input id="ship" />
                    </div>
                </body >
            </html > `,
      });
      const result = await dock.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          content:
            "A web page containing a #ship input field, and a #dock button",
        },
        actual: {
          error: "button #dock is missing",
        },
      });
    });

    it("discloses expectations when ship is not docked", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: `
            <html>
                <body>
                    <div id="gate-1">
                        <label id="ship-1"></label>
                    </div>
                    <div>
                        <input id="ship" />
                        <button id="dock">Dock</button>
                    </div>
                </body >
            </html > `,
      });
      const result = await dock.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          content: "#ship-1 content is 'The Black Pearl'",
        },
        actual: {
          content: "#ship-1 content is ''",
        },
      });
    });
  });
});
