import { buildUrl } from "./build-url.js";
import { Challenge } from "./challenge.js";

export class ChallengeAstroport extends Challenge {
  constructor(name, expectations) {
    super(name, expectations);
  }

  baseUrl(playerServerUrl) {
    return buildUrl([playerServerUrl, "astroport"]);
  }

  readDockContent(pageDriver, gateNumber) {
    return new Promise(async (resolve) => {
      let dockContent = await pageDriver.textContent(`#ship-${gateNumber}`);
      if (dockContent) {
        resolve(dockContent);
      } else {
        let count = 0;
        while (dockContent === "" && count < 7) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          dockContent = await pageDriver.textContent(`#ship-${gateNumber}`);
          count++;
        }
        resolve(dockContent);
      }
    });
  }
}
