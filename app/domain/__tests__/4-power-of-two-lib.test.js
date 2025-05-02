import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { powerOfTwoChooser } from "../4-power-of-two-lib.js";

describe("powerOfTwoChooser", () => {
  it("chooses a number in expected range", () => {
    const number = powerOfTwoChooser.getNumber();
    assert.ok([8, 16, 32, 64, 128, 1024, 2048].includes(number));
  });

  it("chooses randomly", () => {
    var remainingAttempt = 5;
    var first = powerOfTwoChooser.getNumber();
    var different = false;
    while (remainingAttempt > 0) {
      remainingAttempt--;
      different = different || powerOfTwoChooser.getNumber() !== first;
    }
    assert.ok(different);
  });
});
