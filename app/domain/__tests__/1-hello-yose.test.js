import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { helloYose } from "../1-hello-yose.js";
import { Server } from "../../yop/server.js";

describe("Hello Yose challenge", () => {
  it("requires a html page with Hello Yose content", async () => {
    const playerServer = new Server((request, response) => {
      const html = "<html><body>Hello Yose</body></html>";
      response.writeHead(200, {
        "content-type": "text/html",
        "content-length": html.length,
      });
      response.end(html);
    });
    const playerServerPort = await playerServer.start();
    const playerServerUrl = `http://localhost:${playerServerPort}`;
    const result = await helloYose.play(playerServerUrl);
    await playerServer.stop();

    assert.equal(result, "passed");
  });
});
