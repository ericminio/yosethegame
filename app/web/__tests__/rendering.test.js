import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { challengeSectionHtml, renderChallenge } from "../rendering.js";
import { Store } from "../../domain/store.js";

const oneliner = (text) => text.replace(/\s*\n\s*/g, "").trim();

describe("Challenges section html", () => {
  it("is as expected for open challenge", () => {
    assert.equal(
      oneliner(
        challengeSectionHtml(
          {
            name: "Hello Yose",
            expectations: "try me",
            open: () => true,
            hidden: () => false,
            teasing: () => false,
          },
          new Store(),
        ),
      ),
      oneliner(`
        <section class="challenge" id="challenge-hello-yose-section">
            <div class="challenge-header">
                <h2 class="challenge-name">Hello Yose</h2>
            </div>
            <p class="expectations" id="challenge-hello-yose-expectations">try me</p>
            <label id="challenge-hello-yose-result"></label>
        </section>`),
    );
  });

  it("is as expected for closed challenge", () => {
    assert.equal(
      oneliner(
        challengeSectionHtml(
          {
            name: "Power of two",
            expectations: "will you dare?",
            open: () => false,
            hidden: () => false,
            teasing: () => false,
          },
          new Store(),
        ),
      ),
      oneliner(`
        <section class="challenge" id="challenge-power-of-two-section">
            <div class="challenge-header">
                <h2 class="challenge-name">Power of two</h2>
            </div>
            <p class="expectations" id="challenge-power-of-two-expectations"></p>
            <label id="challenge-power-of-two-result">closed</label>
        </section>`),
    );
  });

  it("is as expected for failed challenge", () => {
    const store = new Store();
    store.save("Power of two", {
      status: "failed",
      expected: { one: 1, two: "two" },
      actual: { something: "else" },
    });
    assert.equal(
      oneliner(
        challengeSectionHtml(
          {
            name: "Power of two",
            expectations: "will you dare?",
            open: () => true,
            hidden: () => false,
            teasing: () => false,
          },
          store,
        ),
      ),
      oneliner(`
        <section class="challenge" id="challenge-power-of-two-section">
            <div class="challenge-header">
                <h2 class="challenge-name">Power of two</h2>
                <label class="challenge-status-failed">&#10007;</label>
            </div>
            <p class="expectations" id="challenge-power-of-two-expectations">will you dare?</p>
            <label id="challenge-power-of-two-result">
                <pre>
                    {"status": "failed","expected": {"one": 1,"two": "two"},"actual": {"something": "else"}}
                </pre>
            </label>
        </section>`),
    );
  });

  it("is as expected for passed challenge", () => {
    const store = new Store();
    store.save("Power of two", {
      status: "passed",
    });
    assert.equal(
      oneliner(
        challengeSectionHtml(
          {
            name: "Power of two",
            expectations: "will you dare?",
            open: () => true,
            hidden: () => false,
            teasing: () => false,
          },
          store,
        ),
      ),
      oneliner(`
        <section class="challenge" id="challenge-power-of-two-section">
            <div class="challenge-header">
                <h2 class="challenge-name">Power of two</h2>
                <label class="challenge-status-passed">&#10004;</label>
            </div>
            <label id="challenge-power-of-two-result"></label>
        </section>`),
    );
  });

  it("is as expected for hidden challenge", () => {
    const challengeSection = { outerHTML: "" };
    const challenge = {
      name: "Power of two",
      expectations: "will you dare?",
      open: () => false,
      hidden: () => true,
      teasing: () => false,
    };
    renderChallenge(challenge, new Store(), challengeSection);
    assert.equal(
      oneliner(challengeSection.outerHTML),
      oneliner(`
        <section class="challenge hidden" id="challenge-power-of-two-section">            
            <div class="challenge-header">
                <h2 class="challenge-name">Power of two</h2>
            </div>
            <p class="expectations" id="challenge-power-of-two-expectations"></p>
            <label id="challenge-power-of-two-result">closed</label>
        </section>`),
    );
  });

  it("is as expected for teasing challenge", () => {
    const challengeSection = { outerHTML: "" };
    const challenge = {
      name: "Power of two",
      expectations: "will you dare?",
      open: () => false,
      hidden: () => true,
      teasing: () => true,
    };
    renderChallenge(challenge, new Store(), challengeSection);
    assert.equal(
      oneliner(challengeSection.outerHTML),
      oneliner(`
        <section class="challenge" id="challenge-power-of-two-section">
            <div class="hidden">
                <div class="challenge-header">
                    <h2 class="challenge-name">Power of two</h2>
                </div>
                <p class="expectations" id="challenge-power-of-two-expectations"></p>
                <label id="challenge-power-of-two-result">closed</label>
            </div>
            <div class="teaser">...</div>
        </section>`),
    );
  });
});
