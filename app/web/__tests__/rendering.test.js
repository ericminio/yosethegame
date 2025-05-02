import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { challengeSectionHtml } from "../rendering.js";

const oneliner = (text) => text.replace(/\s*\n\s*/g, "").trim();

describe("Challenges section html", () => {
  it("is as expected for open challenge", () => {
    assert.equal(
      oneliner(
        challengeSectionHtml({
          name: "Hello Yose",
          expectations: "try me",
          open: () => true,
        }),
      ),
      oneliner(`
        <section class="challenge">
            <h2 class="challenge-name">Hello Yose</h2>
            <p id="challenge-hello-yose-expectations">try me</p>
            <label id="challenge-hello-yose-status"></label>
        </section>`),
    );
  });

  it("is as expected for closed challenge", () => {
    assert.equal(
      oneliner(
        challengeSectionHtml({
          name: "Power of two",
          expectations: "will you dare?",
          open: () => false,
        }),
      ),
      oneliner(`
        <section class="challenge">
            <h2 class="challenge-name">Power of two</h2>
            <p id="challenge-power-of-two-expectations"></p>
            <label id="challenge-power-of-two-status">closed</label>
        </section>`),
    );
  });
});
