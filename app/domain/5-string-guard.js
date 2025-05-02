import { stringGuardChooser } from "./5-string-guard-lib.js";

export const stringGuard = {
  name: "String guard",
  expectations:
    "Update your server for <code>/primeFactors</code> to answer with &quot;not a number&quot; when the input is not a number",
  open: (store) => {
    const powerOfTwoResult = store.get("Power of two");
    return powerOfTwoResult && powerOfTwoResult.status === "passed"
      ? true
      : false;
  },
  play: async (playerServerUrl) => {
    const number = stringGuardChooser.getString();
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
  },
};
