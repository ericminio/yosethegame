import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { URL } from "node:url";
import { eventually } from "../playing/yop/testing/eventually.js";
import { Page } from "../playing/yop/testing/page.js";
import { playerServer } from "../playing/player-server.js";

describe("Yose the game", () => {
  let page;

  beforeEach(async () => {
    page = new Page();
    await page.open(new URL("../app/web/assets/index.html", import.meta.url));
  });
  afterEach(async () => {
    await page.close();
  });

  it("starts with some challenges open", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /Update your server/);
    });
  });

  it("starts with some challenges closed", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Power of two"), /closed/);
    });
  });

  it("starts with score 0", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Score"), /0/);
    });
  });

  describe("Playing", () => {
    let playerServerUrl;
    before(async () => {
      const playerServerPort = await playerServer.start();
      playerServerUrl = `http://localhost:${playerServerPort}`;
    });
    after(async () => {
      await playerServer.stop();
    });

    it("gives you points when your server passes a challenge", async () => {
      page.enter("Url", playerServerUrl);
      page.click("Run");

      await eventually(page, async () => {
        assert.match(await page.section("Score"), /10/);
      });
    });

    it("gives you feedback when your server fails a challenge", async () => {
      page.enter("Url", playerServerUrl);
      page.click("Run");

      await eventually(page, async () => {
        assert.match(await page.section("Ping"), /expected.*actual/);
      });
    });
  });
});
