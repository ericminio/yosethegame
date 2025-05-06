import { describe, it, beforeEach, afterEach, before, after } from "node:test";
import { strict as assert } from "node:assert";

import { Store } from "../store.js";
import { Gates } from "../6-gates.js";
import { Dock } from "../7-dock.js";
import { Keep } from "../8-keep.js";
import { Server } from "../../../about/yop/http/server.js";
import { shipChooser } from "../7-dock-lib.js";

describe("Keep challenge", () => {
  let keep;
  beforeEach(() => {
    keep = new Keep();
  });

  it("becomes open when Dock passed", async () => {
    const store = new Store();
    assert.deepEqual(keep.open(store), false);

    store.save(new Dock().name, { status: "passed" });
    assert.deepEqual(keep.open(store), true);
  });

  it("becomes displayed when Gates passed", async () => {
    const store = new Store();
    assert.deepEqual(keep.hidden(store), true);

    store.save(new Dock().name, { status: "passed" });
    assert.deepEqual(keep.hidden(store), false);
  });

  it("becomes teasing when Dock is open", async () => {
    const store = new Store();
    assert.deepEqual(keep.teasing(store), false);

    store.save(new Gates().name, { status: "passed" });
    assert.deepEqual(keep.teasing(store), true);
  });

  it("is not teasing when open", async () => {
    const store = new Store();
    assert.deepEqual(keep.teasing(store), false);

    store.save(new Dock().name, { status: "passed" });
    assert.deepEqual(keep.teasing(store), false);
  });

  describe("playing", () => {
    let playerServer;
    let playerServerUrl;
    let answerWith = () => "<html><body>nothing yet</body></html>";
    let count;
    const player = (_, response) => {
      count += 1;
      const { status, contentType, content } = answerWith(count);
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
      count = 0;
    });
    afterEach((t) => {
      t.mock.restoreAll();
    });

    it("requires a html page keeping the docked ship after reload", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: `
                <html>
                    <body>
                        <div id="gate-1">
                            <label id="ship-1">The Black Pearl</label>
                        </div>
                        <div>
                            <input id="ship" />
                            <button id="dock">Dock</button>
                        </div>
                    </body >
                </html > `,
      });
      const result = await keep.play(playerServerUrl);

      assert.deepEqual(result, { status: "passed" });
    });

    it("discloses expectations when ship is not docked after reload", async (t) => {
      answerWith = (count) => {
        return {
          status: 200,
          contentType: "text/html",
          content: `
            <html>
                <body>
                    <div id="gate-1">
                        <label id="ship-1">${count == 1 ? "The Black Pearl" : ""}</label>
                    </div>
                    <div>
                        <input id="ship" />
                        <button id="dock">Dock</button>
                    </div>
                </body >
            </html > `,
        };
      };
      const result = await keep.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          content: "#ship-1 content is 'The Black Pearl'",
        },
        actual: {
          error: "#ship-1 content is '' after reload (CORS?)",
        },
      });
    });

    it("discloses expectations when ship is not docked before reload", async (t) => {
      answerWith = () => {
        return {
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
        };
      };
      const result = await keep.play(playerServerUrl);

      assert.deepEqual(result, {
        status: "failed",
        expected: {
          content: "#ship-1 content is 'The Black Pearl'",
        },
        actual: {
          error: "#ship-1 content is '' before reload (CORS?)",
        },
      });
    });
  });
});
