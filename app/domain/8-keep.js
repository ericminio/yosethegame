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
    this.jsdomOptions = {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse: (window) => {
        window.fetch = (url, options) =>
          fetch(`${this.playerServerUrl}/astroport${url}`, options);
      },
    };
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
    this.playerServerUrl = playerServerUrl;
    const expected = {
      content: "A web page keeping the docked ship after reload",
    };

    const readDockContent = async (page) => {
      return new Promise(async (resolve) => {
        let dockContent = page.getElementById("ship-1").textContent;
        if (dockContent) {
          resolve(dockContent);
        } else {
          let count = 0;
          while (dockContent === "" && count < 3) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            dockContent = page.getElementById("ship-1").textContent;
            count++;
          }
          resolve(dockContent);
        }
      });
    };

    try {
      let dom = await jsdom.JSDOM.fromURL(
        `${playerServerUrl}/astroport`,
        this.jsdomOptions,
      );
      let page = dom.window.document;

      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
      await readDockContent(page);

      dom = await jsdom.JSDOM.fromURL(
        `${playerServerUrl}/astroport`,
        this.jsdomOptions,
      );
      page = dom.window.document;
      const dockContent = await readDockContent(page);

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
