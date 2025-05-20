import { Challenge } from "./challenge.js";

export class ChallengeAstroport extends Challenge {
  constructor(name, expectations) {
    super(name, expectations);
  }

  waitForShipDockedAtGivenGate(gateNumber, shipName, pageDriver) {
    const pattern = new RegExp(shipName);
    return new Promise(async (resolve) => {
      let dockContent = await pageDriver.textContent(`#ship-${gateNumber}`);
      if (pattern.test(dockContent)) {
        resolve(dockContent);
      } else {
        let count = 0;
        while (!pattern.test(dockContent) && count < 7) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          dockContent = await pageDriver.textContent(`#ship-${gateNumber}`);
          count++;
        }
        resolve(dockContent);
      }
    });
  }
}
