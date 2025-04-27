import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Server } from "../../yop/server.js";
import { ping } from "../2-ping.js";

describe("Ping challenge", () => {
  it("requires a json with alive:true content", async () => {
    const playerServer = new Server((_, response) => {
      const content = JSON.stringify({ alive: true });
      response.writeHead(200, {
        "content-type": "application/json",
        "content-length": content.length,
      });
      response.end(content);
    });
    const playerServerPort = await playerServer.start();
    const playerServerUrl = `http://localhost:${playerServerPort}`;
    const result = await ping.play(playerServerUrl);
    await playerServer.stop();

    assert.equal(result, "passed");
  });

  it("fetches from /ping endpoint", async () => {
    const playerServer = new Server((request, response) => {
      if (request.url == "/ping") {
        const content = JSON.stringify({ alive: true });
        response.writeHead(200, {
          "content-type": "application/json",
          "content-length": content.length,
        });
        response.end(content);
      } else {
        const content = "NOT FOUND";
        response.writeHead(404, {
          "content-type": "text/plain",
          "content-length": content.length,
        });
        response.end(content);
      }
    });
    const playerServerPort = await playerServer.start();
    const playerServerUrl = `http://localhost:${playerServerPort}`;
    const result = await ping.play(playerServerUrl);
    await playerServer.stop();

    assert.equal(result, "passed");
  });
});
