import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { shipChooser } from "../7-dock-lib.js";

describe("shipChooser", () => {
  it("chooses a string in expected set", () => {
    const ship = shipChooser.getShipName();
    assert.ok(
      [
        "Gros Mollo",
        "The Black Pearl",
        "Millenium Falcon",
        "The Bounty",
        "The Great Condor",
        "Goldorak",
      ].includes(ship),
    );
  });
  it("chooses randomly", () => {
    var remainingAttempt = 5;
    var first = shipChooser.getShipName();
    var different = false;
    while (remainingAttempt > 0) {
      remainingAttempt--;
      different = different || shipChooser.getShipName() !== first;
    }
    assert.ok(different);
  });
});
