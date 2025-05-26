import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../yop/testing/eventually.js";
import { playerServer } from "../zod.js";
import { ConsoleGameRunner } from "../../app/console/console-game-runner.js";
import { GameConsole } from "../../app/console/game-console.js";

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
    const spy = {
      log: (message) => {
        log.push(message);
      },
    };
    const game = new ConsoleGameRunner(new GameConsole(spy));
    game.play(playerServerUrl);

    await eventually(async () => {
      const scoreLog = log.find((l) => l.toString().includes("SCORE"));
      assert.match(scoreLog, new RegExp(`SCORE: ${expectedScore}`));
    }, 15000);
  });
});
