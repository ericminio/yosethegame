import { Ping } from "./2-ping.js";
import { powerOfTwoChooser, primeFactorsOf } from "./4-power-of-two-lib.js";
import { Challenge } from "./challenge.js";

export class PowerOfTwo extends Challenge {
  constructor() {
    super(
      "Power of two",
      "Update your server for <code>/primeFactors?number=4</code> to answer with prime factors decomposition",
    );
  }

  open(store) {
    return new Ping().passed(store);
  }

  hidden() {
    return false;
  }

  teasing() {
    return false;
  }

  async play(playerServerUrl) {
    const number = powerOfTwoChooser.getNumber();
    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        decomposition: primeFactorsOf(number),
      }),
    };
    try {
      const response = await fetch(
        `${playerServerUrl}/primeFactors?number=${number}`,
      );
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

      return status === expected.status &&
        contentType === expected.contentType &&
        content === expected.content
        ? { status: "passed" }
        : {
            status: "failed",
            expected,
            actual: { status, contentType, content: content.substring(0, 50) },
          };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: { error: error.message },
      };
    }
  }
}
