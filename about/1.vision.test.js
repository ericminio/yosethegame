import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { URL } from "node:url";
import { eventually } from "./yop/testing/eventually.js";
import { Page } from "./yop/testing/page.js";
import { playerServer } from "./playing/player-server.js";

describe("Yose the game", () => {
  let page;
  let playerServerUrl;
  before(async () => {
    const playerServerPort = await playerServer.start();
    playerServerUrl = `http://localhost:${playerServerPort}`;
  });
  after(async () => {
    await playerServer.stop();
  });
  beforeEach(async () => {
    page = new Page();
    await page.open(new URL("../app/web/assets/index.html", import.meta.url));
  });
  afterEach(async () => {
    await page.close();
  });

  it("is a game where your server gets challenged", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /Update your server/);
    });
    page.enter("Url", playerServerUrl);
    page.click("Run");

    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /passed/);
    });
  });

  it("is a game where you receive feedback for all open challenges", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Ping"), /Update your server/);
    });
    page.enter("Url", playerServerUrl);
    page.click("Run");

    await eventually(page, async () => {
      assert.match(await page.section("Ping"), /failed.*expected.*actual/);
    });
  });

  it("is a game where your earn 10 point when you pass a challenge", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /Update your server/);
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
