import jsdom from "jsdom";
import { Astroport } from "./3-astroport.js";
import { Challenge } from "./challenge.js";

export class Gates extends Challenge {
  constructor() {
    super(
      "Gates",
      `<p class="expectations">Well done! Now we need gates in this astroport to let ships dock and take loads.
      Each #gate-n element will be expected to include a #ship-n element</p>
      Update your server for <code>/astroport</code> to return a web page with 3 gates.`,
    );
  }

  open(store) {
    return new Astroport().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new Astroport().open(store) && !new Astroport().passed(store);
  }

  async play(playerServerUrl) {
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page containing #gate-1 #ship-1, #gate-2 #ship 2, #gate-3 ship-3",
    };

    try {
      const dom = await jsdom.JSDOM.fromURL(`${playerServerUrl}/astroport`, {
        runScripts: "dangerously",
        resources: "usable",
      });
      const page = dom.window.document;
      let one = page.querySelector("#gate-1 #ship-1");
      let two = page.querySelector("#gate-2 #ship-2");
      let three = page.querySelector("#gate-3 #ship-3");

      return one && two && three
        ? { status: "passed" }
        : {
            status: "failed",
            expected,
            actual: {
              status: 200,
              contentType: "text/html",
              content: page.body.innerHTML,
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
