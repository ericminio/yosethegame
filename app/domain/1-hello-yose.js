import { buildUrl } from "./build-url.js";
import { Challenge } from "./challenge.js";

export class HelloYose extends Challenge {
  constructor() {
    super(
      "Hello Yose",
      `
        Update your server for <code>/</code> to answer with a page containing &quot;Hello Yose&quot;
        <div class="tip">
            <label class="light">&#x1f4a1;</label>
            <label>Because your server will be called from here,
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">CORS</a> has to be enabled
            for everything: html pages, json endpoints.
            For now, only <code>Access-Control-Allow-Origin</code> is needed.
            Here is <a href="https://github.com/ericminio/yosethegame/blob/dev/playing/node/hello-yose-passing.js">an example</a></label>
        </div>
      `,
      "Update your server for / to answer with a page containing Hello Yose",
    );
  }

  open() {
    return true;
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
      content: 'A web page containing text "Hello Yose"',
    };
    try {
      const response = await fetch(buildUrl([playerServerUrl]));
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
      }
      if (!contentType) {
        throw new Error(`content-type ${expected.contentType} is missing`);
      }
      if (contentType.indexOf(expected.contentType) == -1) {
        throw new Error(
          `content-type ${contentType} instead of ${expected.contentType}`,
        );
      }
      if (content.indexOf("Hello Yose") === -1) {
        throw new Error("'Hello Yose' not found in content");
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: { error: error.message },
      };
    }
  }
}
