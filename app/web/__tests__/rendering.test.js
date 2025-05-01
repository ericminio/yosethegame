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
      '<section><hr/><h2>Hello Yose</h2><p id="challenge-hello-yose-expectations">try me</p><label id="challenge-hello-yose-status"></label></section>',
    );
  });

  it("is as expected for closed challenge", () => {
    assert.equal(
      oneliner(
        challengeSectionHtml({
          name: "Hello Yose",
          expectations: "will you dare?",
          open: () => false,
        }),
      ),
      '<section><hr/><h2>Hello Yose</h2><p id="challenge-hello-yose-expectations"></p><label id="challenge-hello-yose-status">closed</label></section>',
    );
  });
});
