import { Challenge } from "./challenge.js";

export class Ping extends Challenge {
  constructor() {
    super(
      "Ping",
      "Update your server for <code>/ping</code> to answer with json { &quot;pong&quot;: &quot;hi there!&quot; }",
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
      contentType: "application/json",
      content: JSON.stringify({ pong: "hi there!" }),
    };
    try {
      const response = await fetch(`${playerServerUrl}/ping`);
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
      }
      if (contentType !== expected.contentType) {
        throw new Error(
          `content-type ${contentType} instead of ${expected.contentType}`,
        );
      }
      if (content !== expected.content) {
        throw new Error(`content was not ${expected.content}`);
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
