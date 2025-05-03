import { powerOfTwoChooser, primeFactorsOf } from "./4-power-of-two-lib.js";

export const powerOfTwo = {
  name: "Power of two",
  expectations:
    "Update your server for <code>/primeFactors?number=4</code> to answer with prime factors decomposition",
  open: (store) => {
    const pingResult = store.get("Ping");
    return pingResult && pingResult.status === "passed" ? true : false;
  },
  hidden: () => false,
  play: async (playerServerUrl) => {
    const number = powerOfTwoChooser.getNumber();
    const response = await fetch(
      `${playerServerUrl}/primeFactors?number=${number}`,
    );
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        decomposition: primeFactorsOf(number),
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
  },
};
