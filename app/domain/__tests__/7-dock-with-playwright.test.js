import { describe, it, beforeEach, afterEach, before, after } from "node:test";
import { strict as assert } from "node:assert";

import { Server } from "../../../playing/yop/http/server.js";
import { Dock } from "../7-dock.js";
import { shipChooser } from "../7-dock-lib.js";

import { PlaywrightPage } from "../../../playing/yop/testing/page-playwright.js";

describe("Dock challenge with playwright", () => {
  let dock;
  beforeEach(() => {
    dock = new Dock();
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

    it("works with form action", async (t) => {
      answerWith = () => ({
        status: 200,
        contentType: "text/html",
        content: `
            <html>
                <head>
                    <script>
                        const dock = async (event) => {
                            setTimeout(() => {
                                const shipName = document.getElementById("ship").value;
                                document.getElementById("ship-1").innerHTML = "" + shipName + " was docked";
                            }, 100);
                        };
                    </script>
                </head>
                <body>
                    <div id="gate-1">
                        <label id="ship-1"></label>
                    </div>
                    <div>
                        <form id="docking" action="javascript:dock()">
                            <input id="ship"/>
                            <button type="submit" id="dock">Dock</button>
                        </form>                    
                    </div>
                </body >
            </html > `,
      });
      const result = await dock.play(playerServerUrl, new PlaywrightPage());

      assert.deepEqual(result, { status: "passed" });
    });
  });
});
