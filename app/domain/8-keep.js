import { Dock } from "./7-dock.js";
import { shipChooser } from "./7-dock-lib.js";
import { ChallengeAstroport } from "./challenge-astroport.js";

export class Keep extends ChallengeAstroport {
  constructor() {
    super(
      "Keep",
      `When the user docks a ship, the ship should still appear docked after reload.
        <div class="tip">
            <label class="light">&#x1f4a1;</label>
            <label>Maybe your CORS config needs an update</label>
        </div>
      `,
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
      let dom = await this.openPage(playerServerUrl);
      let page = dom.window.document;

      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
      const dockContentBeforeReload = await this.readDockContent(page, 1);
      if (!new RegExp(shipName).test(dockContentBeforeReload)) {
        throw new Error(
          `#ship-1 content is '${dockContentBeforeReload}' before reload`,
        );
      }

      dom = await this.openPage(this.buildUrl([playerServerUrl]));
      page = dom.window.document;
      const dockContent = await this.readDockContent(page, 1);
      if (!new RegExp(shipName).test(dockContent)) {
        throw new Error(`#ship-1 content is '${dockContent}' after reload`);
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
    }
  }
}
