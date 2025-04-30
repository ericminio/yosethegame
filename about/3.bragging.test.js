import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../yop/testing/eventually.js";
import { Page } from "../yop/testing/page.js";
import { server } from "./playing/server.js";
import { playerServer } from "./playing/player-server-eventually-passing.js";

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

  it("is made easy", async () => {
    await page.open(`${baseUrl}/index.html?url=${playerServerUrl}`);
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /open/);
    });

    page.click("Run");
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /passed/);
    });
  });
});
