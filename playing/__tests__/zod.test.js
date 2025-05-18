import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../yop/testing/eventually.js";
import { playerServer } from "../zod.js";
import { ConsoleGameRunner } from "../../app/console/console-game-runner.js";

describe("Zod", () => {
  let playerServerUrl;

  before(async () => {
    const playerServerPort = await playerServer.start();
    playerServerUrl = `http://localhost:${playerServerPort}`;
  });
  after(async () => {
    await playerServer.stop();
  });
  beforeEach(async () => {});
  afterEach(async () => {});

  it("scores as expected", async () => {
    const log = [];
    const spy = (message) => {
      log.push(message);
    };
    const game = new ConsoleGameRunner(spy);
    game.play(playerServerUrl);

    await eventually(async () => {
      assert.partialDeepStrictEqual(log, [{ Score: 80 }]);
    });
  });
});
