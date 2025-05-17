import { Gates } from "./6-gates.js";
import { shipChooser } from "./7-dock-lib.js";
import { ChallengeAstroport } from "./challenge-astroport.js";
import { JsdomPage } from "./../../playing/yop/testing/page-jsdom.js";

export class Dock extends ChallengeAstroport {
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

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      content: "A web page containing a #ship input field, and a #dock button",
    };
    try {
      await pageDriver.open(this.baseUrl(playerServerUrl));
      if ((await pageDriver.querySelector("input#ship")) === null) {
        throw new Error("input field #ship is missing");
      }
      if ((await pageDriver.querySelector("button#dock")) === null) {
        throw new Error("button #dock is missing");
      }
      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;

      await pageDriver.enterValue("#ship", shipName);
      await pageDriver.clickElement("#dock");
      const dockContent = await this.readDockContent(pageDriver, 1);

      if (pageDriver.error) {
        throw new Error(pageDriver.error);
      }
      if (!new RegExp(shipName).test(dockContent)) {
        return {
          status: "failed",
          expected,
          actual: {
            content: `#ship-1 content is '${dockContent}'`,
          },
        };
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: {
          error: error.message,
        },
      };
    } finally {
      await pageDriver.close();
    }
  }
}
