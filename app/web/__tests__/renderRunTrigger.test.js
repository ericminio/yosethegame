import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { renderRunTrigger } from "../rendering.js";

const oneliner = (text) => text.replace(/\s*\n\s*/g, "").trim();

describe("renderRunTrigger", () => {
  const runTriggerElement = {
    id: "run",
    addEventListener: (_, listener) => {
      runCallback = listener;
    },
    className: "",
  };

  it("renders running state as expected", () => {
    renderRunTrigger(runTriggerElement, true);

    assert.equal(runTriggerElement.className, "run-trigger spinning");
  });

  it("renders not running state as expected", () => {
    renderRunTrigger(runTriggerElement, false);

    assert.equal(runTriggerElement.className, "run-trigger");
  });
});
