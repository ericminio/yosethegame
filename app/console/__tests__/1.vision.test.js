import { describe, it, before, after } from "node:test";
import { strict as assert } from "node:assert";
import { eventually } from "../../../playing/yop/testing/eventually.js";
import { playerServer } from "../../../playing/player-server.js";
import { ConsoleGameRunner } from "../console-game-runner.js";
import { GameConsole } from "../game-console.js";

describe("Yose the game from the console", () => {
  let playerServerUrl;

  before(async () => {
    const playerServerPort = await playerServer.start();
    playerServerUrl = `http://localhost:${playerServerPort}`;
  });
  after(async () => {
    await playerServer.stop();
  });

  it("gives you points when your server passes a challenge", async () => {
    const log = [];
    const spy = {
      log: (message) => {
        log.push(message);
      },
    };
    const game = new ConsoleGameRunner(new GameConsole(spy));
    game.play(playerServerUrl);

    await eventually(async () => {
      assert.partialDeepStrictEqual(log, ["SCORE: 10"]);
    });
  });
});
