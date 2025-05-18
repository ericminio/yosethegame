import { HelloYose } from "./1-hello-yose.js";
import { ChallengeAstroport } from "./challenge-astroport.js";
import { JsdomPage } from "./../../playing/yop/testing/page-jsdom.js";

export class Astroport extends ChallengeAstroport {
  constructor() {
    super(
      "Astroport",
      "Update your server for <code>/astroport</code> to return a web page containing <code>#astroport-name</code>.",
    );
  }

  open(store) {
    return new HelloYose().passed(store);
  }

  hidden() {
    return false;
  }

  teasing() {
    return false;
  }

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page behind /astroport containing non-empty element #astroport-name",
    };

    try {
      await pageDriver.open([playerServerUrl, "astroport"]);
      if ((await pageDriver.querySelector("#astroport-name")) === null) {
        throw new Error("missing element #astroport-name");
      }
      if ((await pageDriver.textContent("#astroport-name")) === "") {
        throw new Error("Element #astroport-name is empty");
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
