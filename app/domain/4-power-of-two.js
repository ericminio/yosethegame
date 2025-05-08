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
      if (contentType.indexOf(expected.contentType) == -1) {
        throw new Error(
          `content-type ${contentType} instead of ${expected.contentType}`,
        );
      }
      if (content !== expected.content) {
        return {
          status: "failed",
          expected,
          actual: {
            status,
            contentType,
            content: content.substring(0, 50),
          },
        };
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
