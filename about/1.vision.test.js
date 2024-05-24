import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually, Page } from "../yop/dist/index.js";
import { server } from "../app/web/server.js";

describe("Vision", () => {
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
        await page.close();
    });

    it("is great", async () => {
        await eventually(page, async () => {
            assert.match(await page.section("Hello World!"), /.*/);
        });
    });
});
