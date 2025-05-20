import { PowerOfTwo } from "./4-power-of-two.js";
import { stringGuardChooser } from "./5-string-guard-lib.js";
import { buildUrl } from "./build-url.js";
import { Challenge } from "./challenge.js";

export class StringGuard extends Challenge {
  constructor() {
    super(
      "String guard",
      "Update your server for <code>/primeFactors</code> to answer with bad request when the input is not a number",
      "Update your server for /primeFactors to answer with bad request when the input is not a number",
    );
  }

  open(store) {
    return new PowerOfTwo().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new PowerOfTwo().open(store) && !new PowerOfTwo().passed(store);
  }

  async play(playerServerUrl) {
    const number = stringGuardChooser.getString();
    const expected = {
      status: 400,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        error: "not a number",
      }),
    };
    try {
      const response = await fetch(
        buildUrl([playerServerUrl, `primeFactors?number=${number}`]),
      );
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
      }
      if (contentType.indexOf(expected.contentType) === -1) {
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
