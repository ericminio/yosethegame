import { describe, it, beforeEach, before } from "node:test";
import { strict as assert } from "node:assert";

import { wireEvents } from "../wiring.js";
import { Store } from "../../domain/store.js";
import { HelloYose } from "../../domain/1-hello-yose.js";
import { Ping } from "../../domain/2-ping.js";
import { PowerOfTwo } from "../../domain/4-power-of-two.js";

describe("Wiring", () => {
  let runCallback;
  const components = [
    {
      id: "run",
      addEventListener: (_, listener) => {
        runCallback = listener;
      },
      className: "",
    },
    { id: "url", value: "http://localhost:3000" },
    { id: "score", innerHTML: "0" },
    { id: "challenges", innerHTML: "" },
    { id: "challenge-hello-yose-section", outerHTML: "" },
    { id: "challenge-ping-section", outerHTML: "" },
    { id: "challenge-power-of-two-section", outerHTML: "" },
  ];
  const document = {
    getElementById: (id) => components.find((c) => c.id === id),
  };
  let store;

  beforeEach(() => {
    store = new Store();
    store.save("challenges", [new HelloYose(), new Ping(), new PowerOfTwo()]);
  });

  it("renders the challenges", () => {
    wireEvents(document, store);
    const challenges = document
      .getElementById("challenges")
      .innerHTML.split("\n")
      .map((line) => line.trim())
      .filter((line) => /challenge-.*-section/.test(line));
    assert.equal(challenges.length, 3);
  });

  it("opens the game", async () => {
    global.run = async (url) => ({ url });
    wireEvents(document, store);
    const player = await runCallback();
    assert.equal(player.url, "http://localhost:3000");
  });

  it("discloses when open", () => {
    wireEvents(document, store);
    const section = document.getElementById("challenge-ping-section");
    assert.match(section.outerHTML, /Update your server/);
  });

  it("discloses when closed", () => {
    wireEvents(document, store);
    const section = document.getElementById("challenge-power-of-two-section");
    assert.match(section.outerHTML, /closed/);
  });

  it("updates the score", () => {
    wireEvents(document, store);
    store.save("score", 42);
    const scoreElement = document.getElementById("score");
    assert.equal(scoreElement.innerHTML, "42");
  });

  it("opens eventually as expected", () => {
    wireEvents(document, store);
    assert.match(
      document.getElementById("challenge-power-of-two-section").outerHTML,
      /closed/,
    );
    store.save("Hello Yose", { status: "passed" });
    store.save("Ping", { status: "passed" });
    store.save("score", 20);

    assert.match(
      document.getElementById("challenge-power-of-two-section").outerHTML,
      /Update your server/,
    );
  });

  it("updates run button when running", () => {
    wireEvents(document, store);
    store.save("running", true);
    const runButton = document.getElementById("run");

    assert.equal(runButton.className, "run-trigger spinning");
  });
});
