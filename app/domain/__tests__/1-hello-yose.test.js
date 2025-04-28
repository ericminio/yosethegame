import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Server } from "../../../yop/http/server.js";
import { helloYose } from "../1-hello-yose.js";

describe("Hello Yose challenge", () => {
  it("requires a html page with Hello Yose content", async () => {
    const playerServer = new Server((_, response) => {
      const content = "<html><body>Hello Yose</body></html>";
      response.writeHead(200, {
        "content-type": "text/html",
        "content-length": content.length,
      });
      response.end(content);
    });
    const playerServerPort = await playerServer.start();
    const playerServerUrl = `http://localhost:${playerServerPort}`;
    const result = await helloYose.play(playerServerUrl);
    await playerServer.stop();

    assert.equal(result, "passed");
  });
});
