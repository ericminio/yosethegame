import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { run } from "../running.js";

describe("Running", () => {
  const challenges = [
    { name: "Hello Yose", open: true, play: async () => "passed" },
    { name: "Ping", open: true, play: async () => "failed" },
    { name: "Astroport", open: false, play: async () => "failed" },
  ];
  const components = [
    { id: "url", value: "http://localhost:3000" },
    { id: "challenge-hello-yose-status", innerHTML: "open" },
    { id: "challenge-ping-status", innerHTML: "open" },
    { id: "challenge-astroport-status", innerHTML: "closed" },
    { id: "score", innerHTML: "0" },
  ];
  const document = {
    getElementById: (id) => components.find((c) => c.id === id),
  };
  it("updates results of open challenges", async () => {
    await run(document, challenges);

    assert.equal(
      document.getElementById("challenge-hello-yose-status").innerHTML,
      "passed",
    );
    assert.equal(
      document.getElementById("challenge-ping-status").innerHTML,
      "failed",
    );
    assert.equal(
      document.getElementById("challenge-astroport-status").innerHTML,
      "closed",
    );
  });

  it("updates score", async () => {
    await run(document, challenges);

    assert.equal(document.getElementById("score").innerHTML, "10");
  });
});
