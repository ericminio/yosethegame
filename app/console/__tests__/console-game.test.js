import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

import { GameConsole } from "../game-console.js";

describe("Game Console", () => {
  let gameConsole;
  let log;
  beforeEach(() => {
    log = [];
    const spy = {
      log: (message) => {
        log.push(message);
      },
    };
    gameConsole = new GameConsole(spy);
  });

  it("swallows score events", async () => {
    gameConsole.log({ score: 0 });
    gameConsole.log({ score: 10 });
    gameConsole.log({ score: 20 });
    gameConsole.log({ score: 30 });
    gameConsole.log({ challenge: "Ping", result: { status: "success" } });

    gameConsole.logScore();

    assert.deepEqual(log, [
      { challenge: "Ping", result: { status: "success" } },
      "SCORE: 30",
    ]);
  });

  it("swallows challenge initialization events", async () => {
    gameConsole.log({ challenge: "Ping", result: null });

    assert.deepEqual(log, []);
  });

  it("forwards other events", async () => {
    gameConsole.log({ challenge: "Ping", result: { status: "success" } });
    gameConsole.log({ challenge: "Gates", result: { status: "success" } });

    assert.deepEqual(log, [
      { challenge: "Ping", result: { status: "success" } },
      { challenge: "Gates", result: { status: "success" } },
    ]);
  });
});
