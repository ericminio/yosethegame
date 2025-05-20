import { describe, it, before, after } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../yop/testing/eventually.js";
import { playerServer } from "../zod.js";
import { ConsoleGameRunner } from "../../app/console/console-game-runner.js";

import { Keep } from "../../app/domain/8-keep.js";
import { GameConsole } from "../../app/console/game-console.js";

describe("Zod", () => {
  const expectedScore = 10;
  let playerServerUrl;

  before(async () => {
    const playerServerPort = await playerServer.start();
    playerServerUrl = `http://localhost:${playerServerPort}`;
  });
  after(async () => {
    await playerServer.stop();
  });

  it("passes challenge as expected", async () => {
    process.env.YOP_WEBTEST = "playwright";
    const log = [];
    const spy = {
      log: (message) => {
        log.push(message);
      },
    };

    const challenge = new Keep();
    challenge.open = () => true;
    const game = new ConsoleGameRunner(new GameConsole(spy), [challenge]);
    game.play(playerServerUrl);

    await eventually(async () => {
      assert.partialDeepStrictEqual(log, [`SCORE: ${expectedScore}`]);
    }, 3000);
  });
});
