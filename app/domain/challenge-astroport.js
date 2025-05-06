import { Challenge } from "./challenge.js";

export class ChallengeAstroport extends Challenge {
  constructor(name, expectations) {
    super(name, expectations);
  }

  jsdomOptions(baseUrl) {
    return {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse: (window) => {
        window.fetch = async (url, options) => {
          return await fetch(`${baseUrl}${url}`, options);
        };
      },
    };
  }

  readDockContent(page, gateNumber) {
    return new Promise(async (resolve) => {
      let dockContent = page.getElementById(`ship-${gateNumber}`).textContent;
      if (dockContent) {
        resolve(dockContent);
      } else {
        let count = 0;
        while (dockContent === "" && count < 3) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          dockContent = page.getElementById(`ship-${gateNumber}`).textContent;
          count++;
        }
        resolve(dockContent);
      }
    });
  }
}
