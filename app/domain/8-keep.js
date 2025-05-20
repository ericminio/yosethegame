import { Dock } from "./7-dock.js";
import { shipChooser } from "./7-dock-lib.js";
import { ChallengeAstroport } from "./challenge-astroport.js";
import { JsdomPage } from "./../../playing/yop/testing/page-jsdom.js";
export class Keep extends ChallengeAstroport {
  constructor() {
    super(
      "Keep",
      `When the user docks a ship, the ship should still appear docked after page reload.
        <div class="tip">
            <label class="light">&#x1f4a1;</label>
            <label>Maybe your <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">CORS</a> config
            needs an update
            to answer <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#preflighted_requests">preflight requests</a></label>
        </div>
      `,
      "Update your server to keep the ship docked after page reload",
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

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      content: "A web page keeping the docked ship after reload",
    };

    try {
      await pageDriver.open([playerServerUrl, "astroport"]);

      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      await pageDriver.enterValue("#ship", shipName);
      await pageDriver.clickElement("#dock");
      const dockContentBeforeReload = await this.waitForShipDockedAtGivenGate(
        1,
        shipName,
        pageDriver,
      );
      if (!new RegExp(shipName).test(dockContentBeforeReload)) {
        throw new Error(
          `#ship-1 content is '${dockContentBeforeReload}' before reload`,
        );
      }

      await pageDriver.open([playerServerUrl, "astroport"]);
      const dockContent = await this.waitForShipDockedAtGivenGate(
        1,
        shipName,
        pageDriver,
      );
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
    } finally {
      await pageDriver.close();
    }
  }
}
