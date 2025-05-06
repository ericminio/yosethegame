import jsdom from "jsdom";
import { HelloYose } from "./1-hello-yose.js";
import { Challenge } from "./challenge.js";

export class Astroport extends Challenge {
  constructor() {
    super(
      "Astroport",
      "Update your server for <code>/astroport</code> to return a web page containing <code>#astroport-name</code>.",
    );
    this.jsdomOptions = {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse: (window) => {
        window.fetch = (url, options) =>
          fetch(`${this.playerServerUrl}/astroport${url}`, options);
      },
    };
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
    this.playerServerUrl = playerServerUrl;
    const expected = {
      status: 200,
      contentType: "text/html",
      content: "A web page containing non-empty element #astroport-name",
    };

    try {
      const dom = await jsdom.JSDOM.fromURL(
        `${playerServerUrl}/astroport`,
        this.jsdomOptions,
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
