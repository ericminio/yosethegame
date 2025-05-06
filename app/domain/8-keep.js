import jsdom from "jsdom";
import { Dock } from "./7-dock.js";
import { shipChooser } from "./7-dock-lib.js";
import { ChallengeAstroport } from "./challenge-astroport.js";

export class Keep extends ChallengeAstroport {
  constructor() {
    super(
      "Keep",
      `When the user docks a ship, the ship should still appear docked after reload.`,
    );
  }

  open(store) {
    return new Dock().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new Dock().open(store) && !new Dock().passed(store);
  }

  async play(playerServerUrl) {
    const expected = {
      content: "A web page keeping the docked ship after reload",
    };

    try {
      const baseUrl = `${playerServerUrl}/astroport`;
      let dom = await jsdom.JSDOM.fromURL(baseUrl, this.jsdomOptions(baseUrl));
      let page = dom.window.document;

      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
      await this.readDockContent(page, 1);

      dom = await jsdom.JSDOM.fromURL(baseUrl, this.jsdomOptions(baseUrl));
      page = dom.window.document;
      const dockContent = await this.readDockContent(page, 1);

      return new RegExp(shipName).test(dockContent)
        ? { status: "passed" }
        : {
            status: "failed",
            expected,
            actual: {
              content: `#ship-1 content is '${dockContent}'`,
            },
          };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: {
          error: error.message,
        },
      };
    }
  }
}
