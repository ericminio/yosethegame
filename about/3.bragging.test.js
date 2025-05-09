import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../playing/yop/testing/eventually.js";
import { Page } from "../playing/yop/testing/page.js";
import { server } from "../playing/server.js";
import { playerServer } from "../playing/player-server-eventually-passing.js";

describe("Bragging", () => {
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
  });
  afterEach(async () => {
    await page.close();
  });

  it("happens whe you share your server", async () => {
    await page.open(`${baseUrl}/index.html?url=${playerServerUrl}`);
    await eventually(page, async () => {
      assert.match(await page.section("Score"), /0/);
    });

    page.click("Run");
    const trigger = page.find({ tag: "button", text: "Run" });
    await eventually(page, async () => {
      assert.match(trigger.className, /ready/);
    });

    await eventually(page, async () => {
      assert.match(await page.section("Score"), /10/);
    });
  });
});
