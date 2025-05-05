import jsdom from "jsdom";
import { Challenge } from "./challenge.js";
import { Gates } from "./6-gates.js";
import { shipChooser } from "./7-dock-lib.js";

export class Dock extends Challenge {
  constructor() {
    super(
      "Dock",
      `<p class="expectations">Update your server to let the user dock a ship at the first gate.</p>
      
      After the user enters a ship name in the #ship field and press the #dock button,
      the ship's name should appear in the element #ship-1.`,
    );
  }

  open(store) {
    return new Gates().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new Gates().open(store) && !new Gates().passed(store);
  }

  async play(playerServerUrl) {
    const expected = {
      content: "A web page containing a #ship input field, and a #dock button",
    };

    try {
      const dom = await jsdom.JSDOM.fromURL(`${playerServerUrl}/astroport`, {
        runScripts: "dangerously",
        resources: "usable",
      });
      const page = dom.window.document;
      if (page.getElementById("ship") === null) {
        throw new Error("input field #ship is missing");
      }
      if (page.getElementById("dock") === null) {
        throw new Error("button #dock is missing");
      }
      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
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
