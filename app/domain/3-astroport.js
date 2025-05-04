import { HelloYose } from "./1-hello-yose.js";
import { Challenge } from "./challenge.js";

export class Astroport extends Challenge {
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
    const response = await fetch(`${playerServerUrl}/astroport`);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 200,
      contentType: "text/html",
      content: "A web page containing #astroport-name",
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content.indexOf('id="astroport-name"') !== -1
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
  }
}
