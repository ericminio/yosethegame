import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { renderRunTrigger } from "../rendering.js";

describe("renderRunTrigger", () => {
  const runTriggerElement = {
    id: "run",
    addEventListener: (_, listener) => {
      runCallback = listener;
    },
    className: "",
    innerHTML: "",
  };

  it("renders running state as expected", () => {
    renderRunTrigger(runTriggerElement, true);

    assert.equal(runTriggerElement.className, "run-trigger spinning");
    assert.equal(runTriggerElement.innerHTML, "&#x25b6;");
  });

  it("renders not running state as expected", () => {
    renderRunTrigger(runTriggerElement, false);

    assert.equal(runTriggerElement.className, "run-trigger");
    assert.equal(runTriggerElement.innerHTML, "&#x25b6;");
  });
});
