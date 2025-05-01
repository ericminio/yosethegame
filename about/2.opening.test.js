import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { URL } from "node:url";
import { eventually } from "./yop/testing/eventually.js";
import { Page } from "./yop/testing/page.js";
import { playerServer } from "./playing/player-server-passing.js";

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

  it("is a game where challenges are not immediately open", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Astroport"), /closed/);
    });
  });

  it("is a game where some challenges become open once your server passed other challenges", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Astroport"), /closed/);
    });
    page.enter("Url", playerServerUrl);
    page.click("Run");

    await eventually(page, async () => {
      assert.match(await page.section("Astroport"), /Update your server/);
    });
  });
});
