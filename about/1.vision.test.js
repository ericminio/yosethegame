import fs from "node:fs";
import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "./support/eventually.js";
import { Page } from "./support/page.js";
import { server } from "../app/web/server.js";

describe("Yose the game", () => {
  let page;
  let baseUrl;
  before(async () => {
    const port = await server.start();
    baseUrl = `http://localhost:${port}`;
  });
  after(async () => {
    await server.stop();
  });
  beforeEach(async () => {
    page = new Page();
    await page.open(baseUrl);
  });
  afterEach(async () => {
    fs.writeFileSync(
      `.coverage/coverage-client-${Date.now()}.json`,
      JSON.stringify(page.document.defaultView.__coverage__ ?? {}),
    );
    fs.writeFileSync(
      `.coverage/coverage-server-${Date.now()}.json`,
      JSON.stringify(global.__coverage__ ?? {}),
    );
    await page.close();
  });

  it("is a game where your server gets challenged", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /open/);
    });
    page.enter("Url", "http://localhost:3333");
    page.click("Run");

    await eventually(page, async () => {
      assert.match(await page.section("Hello Yose"), /passed/);
    });
  });

  it("is a game where you receive feedback for all open challenges", async () => {
    await eventually(page, async () => {
      assert.match(await page.section("Ping"), /open/);
    });
    page.enter("Url", "http://localhost:3333");
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
