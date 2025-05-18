import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../playing/yop/testing/eventually.js";
import { Page } from "../playing/yop/testing/page.js";
import { server } from "../playing/server.js";
import { playerServer } from "../playing/player-server.js";

describe("Yose the game", () => {
  let playerServerUrl;
  let gameUrl;
  let page;

  before(async () => {
    const port = await server.start();
    gameUrl = `http://localhost:${port}`;
    const playerServerPort = await playerServer.start();
    playerServerUrl = `http://localhost:${playerServerPort}`;
  });
  after(async () => {
    await playerServer.stop();
    await server.stop();
  });
  beforeEach(async () => {
    page = new Page();
  });
  afterEach(async () => {
    await page.close();
  });

  it("starts with some challenges open", async () => {
    await page.open([`${gameUrl}`]);
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /Update your server/);
    });
  });

  it("starts with some challenges closed", async () => {
    await page.open([`${gameUrl}`]);
    await eventually(page, async () => {
      assert.match(await page.section("Power of two"), /closed/);
    });
  });

  it("starts with score 0", async () => {
    await page.open([`${gameUrl}`]);
    await eventually(page, async () => {
      assert.match(await page.section("Score"), /0/);
    });
  });

  it("gives you points when your server passes a challenge", async () => {
    await page.open([`${gameUrl}`]);
    await eventually(page, async () => {
      assert.match(await page.section("Score"), /0/);
    });
    await page.enter("Url", playerServerUrl);
    await page.click("Run");
    const trigger = await page.find({ tag: "button", text: "Run" });
    await eventually(page, async () => {
      assert.match(trigger.className, /ready/);
    });

    await eventually(page, async () => {
      assert.match(await page.section("Score"), /10/);
    });
  });

  it("gives you feedback when your server fails a challenge", async () => {
    await page.open([`${gameUrl}`]);
    await eventually(page, async () => {
      assert.match(await page.section("Score"), /0/);
    });
    await page.enter("Url", playerServerUrl);
    await page.click("Run");
    const trigger = await page.find({ tag: "button", text: "Run" });
    await eventually(page, async () => {
      assert.match(trigger.className, /ready/);
    });

    await eventually(page, async () => {
      assert.match(await page.section("Ping"), /expected.*actual/);
    });
  });
});
