import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { stringGuardChooser } from "../5-string-guard-lib.js";

describe("stringGuardChooser", () => {
  it("chooses a string in expected set", () => {
    const number = stringGuardChooser.getString();
    assert.ok(
      [
        "yolo",
        "hello",
        "world",
        "geek",
        "javascript",
        "prime",
        "factors",
        "optimus",
        "batman",
        "surfer",
      ].includes(number),
    );
  });
  it("chooses randomly", () => {
    var remainingAttempt = 5;
    var first = stringGuardChooser.getString();
    var different = false;
    while (remainingAttempt > 0) {
      remainingAttempt--;
      different = different || stringGuardChooser.getString() !== first;
    }
    assert.ok(different);
  });
});
