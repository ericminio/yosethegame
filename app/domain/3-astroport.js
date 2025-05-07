import { HelloYose } from "./1-hello-yose.js";
import { ChallengeAstroport } from "./challenge-astroport.js";

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

  async play(playerServerUrl) {
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page behind /astroport containing non-empty element #astroport-name",
    };

    try {
      const dom = await this.openPage(playerServerUrl);
      const page = dom.window.document;
      if (page.getElementById("astroport-name") === null) {
        throw new Error("missing element #astroport-name");
      }
      if (page.getElementById("astroport-name").textContent === "") {
        throw new Error("Element #astroport-name is empty");
      }

      return { status: "passed" };
    } catch (error) {
      console.log(error);
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
