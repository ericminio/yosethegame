import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { wireEvents } from "../wiring.js";
import { Store } from "../../domain/store.js";

describe("Wiring", () => {
  let runCallback;
  const components = [
    {
      id: "run",
      addEventListener: (_, listener) => {
        runCallback = listener;
      },
    },
    { id: "url", value: "http://localhost:3000" },
    { id: "score", innerHTML: "0" },
    { id: "challenges", innerHTML: "" },
    { id: "challenge-hello-yose-status", innerHTML: "" },
    { id: "challenge-ping-status", innerHTML: "" },
    { id: "challenge-astroport-status", innerHTML: "closed" },
    { id: "challenge-hello-yose-expectations", innerHTML: "" },
    { id: "challenge-ping-expectations", innerHTML: "" },
    { id: "challenge-astroport-expectations", innerHTML: "" },
  ];
  const document = {
    getElementById: (id) => components.find((c) => c.id === id),
  };

  it("opens the game", async () => {
    global.run = async (url) => ({ url });
    const store = new Store();
    wireEvents(document, store);
    const player = await runCallback();
    assert.equal(player.url, "http://localhost:3000");
  });

  it("updates the displayed score", () => {
    const store = new Store();
    wireEvents(document, store);
    store.save("score", 42);
    const scoreElement = document.getElementById("score");
    assert.equal(scoreElement.innerHTML, "42");
  });

  it("discloses when closed", () => {
    const store = new Store();
    wireEvents(document, store);
    const status = document.getElementById("challenge-astroport-status");
    assert.equal(status.innerHTML, "closed");
  });

  it("does not duplicate expectations with status when open", () => {
    const store = new Store();
    wireEvents(document, store);
    const status = document.getElementById("challenge-ping-status");
    assert.equal(status.innerHTML, "");
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
      "",
    );
  });
});
