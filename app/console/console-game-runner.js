import { pageDriverChooser } from "../../playing/yop/testing/page.js";
import { Store } from "../domain/store.js";
import { run } from "../domain/running.js";
import { GameConsole } from "./game-console.js";

export class ConsoleGameRunner {
  constructor(logger) {
    this.logger = logger || new GameConsole(console);
    this.store = new Store();
    this.pageDriver = pageDriverChooser(process.env);

    this.store.register("score", (score) => {
      this.logger.log({ score });
    });
    this.store.get("challenges").forEach((challenge) => {
      this.store.register(challenge.name, () => {
        const result = this.store.get(challenge.name);
        this.logger.log({
          challenge: challenge.name,
          assignment: challenge.assignment,
          result: result,
        });
      });
    });
  }

  async play(playerServerUrl) {
    this.logger.log(`Playing against ${playerServerUrl}`);
    await run(playerServerUrl, this.store, this.pageDriver);
    this.logger.logScore();
    process.exit(0);
  }
}
