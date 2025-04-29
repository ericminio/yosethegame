import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { wireEvents } from "../wiring.js";
import { Store } from "../../domain/store.js";

describe("Wiring", () => {
  const components = [
    { id: "run", addEventListener: () => {} },
    { id: "url", value: "http://localhost:3000" },
    { id: "score", innerHTML: "0" },
    { id: "challenges", innerHTML: "" },
    { id: "challenge-hello-yose-status", innerHTML: "open" },
    { id: "challenge-ping-status", innerHTML: "open" },
    { id: "challenge-astroport-status", innerHTML: "closed" },
  ];
  const document = {
    getElementById: (id) => components.find((c) => c.id === id),
  };

  it("sets score listener", () => {
    const store = new Store();
    wireEvents(document, store);
    store.save("score", 42);
    const scoreElement = document.getElementById("score");
    assert.equal(scoreElement.innerHTML, "42");
  });

  it("renders the challenges", () => {
    const store = new Store();
    wireEvents(document, store);
    const challenges = document
      .getElementById("challenges")
      .innerHTML.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes('<label id="challenge-'));
    assert.equal(challenges.length, 3);
  });

  it("opens astroport as expected", () => {
    const store = new Store();
    wireEvents(document, store);
    store.save("Hello Yose", { status: "passed" });
    store.save("Ping", { status: "passed" });
    store.save("score", 20);

    assert.equal(
      document.getElementById("challenge-astroport-status").innerHTML,
      "open",
    );
  });
});
