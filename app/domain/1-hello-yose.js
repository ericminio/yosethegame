import { Challenge } from "./challenge.js";

export class HelloYose extends Challenge {
  constructor() {
    super(
      "Hello Yose",
      "Update your server for <code>/</code> to answer with a page containing &quot;Hello Yose&quot;",
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
      const response = await fetch(this.buildUrl([playerServerUrl]));
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
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
