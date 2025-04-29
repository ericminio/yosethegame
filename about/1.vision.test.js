import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../yop/testing/eventually.js";
import { Page } from "../yop/testing/page.js";
import { server } from "../app/server.js";
import { playerServer } from "./player-server.js";

describe("Yose the game", () => {
  let page;
  let baseUrl;

  let playerServerUrl;
  before(async () => {
    const port = await server.start();
    baseUrl = `http://localhost:${port}`;
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
      assert.match(await page.section("Ping"), /failed.*expected.*actual/);
    });
  });

  it("is a game where challenges are not immediately open", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Astroport"), /closed/);
    });
  });

  it("is a game where your earn 10 point when you pass a challenge", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /open/);
    });
    await eventually(page, async () => {
      assert.match(await page.section("Score"), /0/);
    });
    page.enter("Url", playerServerUrl);
    page.click("Run");

    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /passed/);
    });
    await eventually(page, async () => {
      assert.match(await page.section("Score"), /10/);
    });
  });
});
