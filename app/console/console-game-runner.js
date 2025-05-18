import { Page } from "../../playing/yop/testing/page.js";
import { Store } from "../domain/store.js";
import { HelloYose } from "../domain/1-hello-yose.js";
import { Ping } from "../domain/2-ping.js";
import { PowerOfTwo } from "../domain/4-power-of-two.js";
import { StringGuard } from "../domain/5-string-guard.js";
import { Astroport } from "../domain/3-astroport.js";
import { Gates } from "../domain/6-gates.js";
import { Dock } from "../domain/7-dock.js";
import { Keep } from "../domain/8-keep.js";
import { Full } from "../domain/9-full.js";
import { run } from "../domain/running.js";

export class ConsoleGameRunner {
  constructor(spy) {
    this.spy = spy || ((message) => console.log(JSON.stringify(message)));
    this.store = new Store();
    this.pageDriver = new Page();
    this.store.save("challenges", [
      new HelloYose(),
      new Ping(),
      new PowerOfTwo(),
      new StringGuard(),
      new Astroport(),
      new Gates(),
      new Dock(),
      new Keep(),
      new Full(),
    ]);

    this.store.register("score", (score) => {
      this.spy({ Score: score });
    });
    this.store.get("challenges").forEach((challenge) => {
      this.store.register(challenge.name, () => {
        const result = this.store.get(challenge.name);
        this.spy({
          challenge: challenge.name,
          result: result,
        });
      });
    });
  }

  async play(playerServerUrl) {
    run(playerServerUrl, this.store, this.pageDriver);
  }
}
