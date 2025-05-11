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
            <label>Maybe your <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">CORS</a> config
            needs an update
            to answer <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#preflighted_requests">preflight requests</a></label>
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
      let page = await this.openPage(playerServerUrl);

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

      page = await this.openPage(this.buildUrl([playerServerUrl]));
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
