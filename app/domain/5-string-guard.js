import { PowerOfTwo } from "./4-power-of-two.js";
import { stringGuardChooser } from "./5-string-guard-lib.js";
import { Challenge } from "./challenge.js";

export class StringGuard extends Challenge {
  constructor() {
    super(
      "String guard",
      "Update your server for <code>/primeFactors</code> to answer with bad request when the input is not a number",
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
    const response = await fetch(
      this.buildUrl([playerServerUrl, `primeFactors?number=${number}`]),
    );
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 400,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        error: "not a number",
      }),
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content === expected.content
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
  }
}
