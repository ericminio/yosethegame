import jsdom from "jsdom";
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
      content: "A web page containing non-empty element #astroport-name",
    };

    try {
      const baseUrl = `${playerServerUrl}/astroport`;
      const dom = await jsdom.JSDOM.fromURL(
        baseUrl,
        this.jsdomOptions(baseUrl),
      );
      const page = dom.window.document;

      return page.querySelector("#astroport-name") !== null &&
        page.querySelector("#astroport-name").textContent !== ""
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
