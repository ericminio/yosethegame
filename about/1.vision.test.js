import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "./support/eventually.js";
import { Page } from "./support/page.js";
import { server } from "../app/server.js";
import { Server } from "../app/yop/server.js";

const player = (request, response) => {
  if (request.url === "/") {
    const html = "<html><body>Hello Yose</body></html>";
    response.writeHead(200, {
      "content-type": "text/html",
      "content-length": html.length,
    });
    response.end(html);
  } else if (request.url === "/ping") {
    const pong = JSON.stringify({ alive: true });
    response.writeHead(200, {
      "content-type": "application/json",
      "content-length": pong.length,
    });
    response.end(pong);
  } else {
    const text = "NOT FOUND";
    response.writeHead(404, {
      "content-type": "text/plain",
      "content-length": text.length,
    });
    response.end(text);
  }
};

describe("Yose the game", () => {
  let page;
  let baseUrl;

  let playerServer;
  let playerServerUrl;
  before(async () => {
    const port = await server.start();
    baseUrl = `http://localhost:${port}`;
    playerServer = new Server(player);
    const playerServerPort = await playerServer.start();
    playerServerUrl = `http://localhost:${playerServerPort}`;
  });
  after(async () => {
    await playerServer.stop();
    await server.stop();
  });
  beforeEach(async () => {
    page = new Page();
    await page.open(baseUrl);
  });
  afterEach(async () => {
    await page.close();
  });

  it("is a game where your server gets challenged", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /open/);
    });
    page.enter("Url", playerServerUrl);
    page.click("Run");

    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /passed/);
    });
  });

  it("is a game where you receive feedback for all open challenges", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Ping"), /open/);
    });
    page.enter("Url", playerServerUrl);
    page.click("Run");

    await eventually(page, async () => {
      assert.match(await page.section("Ping"), /failed/);
    });
  });

  it("is a game where challenges are not immediately open", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Astroport"), /closed/);
    });
  });
});
