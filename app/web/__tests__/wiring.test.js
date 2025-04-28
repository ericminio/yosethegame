import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { wireEvents } from "../wiring.js";
import { Store } from "../../domain/store.js";

describe("Wiring", () => {
  const components = [
    { id: "run", addEventListener: () => {} },
    { id: "url", value: "http://localhost:3000" },
    { id: "score", innerHTML: "0" },
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
});
