import jsdom from "jsdom";
import { Challenge } from "./challenge.js";
import { Dock } from "./7-dock.js";
import { shipChooser } from "./7-dock-lib.js";

export class Keep extends Challenge {
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
      let dom = await jsdom.JSDOM.fromURL(`${playerServerUrl}/astroport`, {
        runScripts: "dangerously",
        resources: "usable",
      });
      let page = dom.window.document;
      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
      dom = await jsdom.JSDOM.fromURL(`${playerServerUrl}/astroport`, {
        runScripts: "dangerously",
        resources: "usable",
      });
      page = dom.window.document;
      const readDockContent = () => page.getElementById("ship-1").textContent;
      let dockContent = readDockContent();
      let count = 0;
      while (dockContent === "" && count < 3) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        dockContent = readDockContent();
        count++;
      }

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
