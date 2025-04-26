import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { challengeSectionHtml } from "../rendering.js";

const oneliner = (text) => text.replace(/\s*\n\s*/g, "").trim();

describe("Challenges section html", () => {
  it("is as expected for open challenge", () => {
    assert.equal(
      oneliner(challengeSectionHtml({ name: "Hello Yose", open: true })),
      '<section><h2>Hello Yose</h2><label id="challenge-hello-yose-status">open</label></section>',
    );
  });

  it("is as expected for closed challenge", () => {
    assert.equal(
      oneliner(challengeSectionHtml({ name: "Hello Yose", open: false })),
      '<section><h2>Hello Yose</h2><label id="challenge-hello-yose-status">closed</label></section>',
    );
  });
});
