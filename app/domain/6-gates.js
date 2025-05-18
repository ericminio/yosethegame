import { Astroport } from "./3-astroport.js";
import { ChallengeAstroport } from "./challenge-astroport.js";
import { JsdomPage } from "./../../playing/yop/testing/page-jsdom.js";

export class Gates extends ChallengeAstroport {
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

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page containing #gate-1 #ship-1, #gate-2 #ship 2, #gate-3 ship-3",
    };

    try {
      await pageDriver.open([playerServerUrl, "astroport"]);
      let one = await pageDriver.querySelector("#gate-1 #ship-1");
      let two = await pageDriver.querySelector("#gate-2 #ship-2");
      let three = await pageDriver.querySelector("#gate-3 #ship-3");
      const count = [one, two, three].filter((e) => e).length;
      if (count !== 3) {
        throw new Error(`only ${count} gate(s) found`);
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
