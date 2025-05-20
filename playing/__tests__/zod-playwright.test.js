import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../yop/testing/eventually.js";
import { playerServer } from "../zod.js";
import { ConsoleGameRunner } from "../../app/console/console-game-runner.js";

describe("Zod", () => {
  const expectedScore = 80;
  let playerServerUrl;

  before(async () => {
    const playerServerPort = await playerServer.start();
    playerServerUrl = `http://localhost:${playerServerPort}`;
  });
  after(async () => {
    await playerServer.stop();
  });

  it("scores as expected with playwright", async () => {
    process.env.YOP_WEBTEST = "playwright";
    const log = [];
    const spy = (message) => {
      log.push(message);
    };
    const game = new ConsoleGameRunner(spy);
    game.play(playerServerUrl);

    await eventually(async () => {
      assert.partialDeepStrictEqual(log, [{ Score: expectedScore }]);
    }, 15000);
  });
});
