import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { stringify } from "../stringifier.js";

describe("Stringifier", () => {
  it("covers one number", () => {
    assert.equal(stringify(42), "42");
  });

  it("covers one string", () => {
    assert.equal(stringify("42"), '"42"');
  });

  it("covers one number field", () => {
    assert.equal(stringify({ value: 42 }), "{value:42}");
  });

  it("covers two number fields", () => {
    assert.equal(stringify({ one: 1, two: 2 }), "{one:1,two:2}");
  });

  it("covers array field", () => {
    assert.equal(stringify({ several: [1, 2] }), "{several:[1,2]}");
  });

  it("covers array ", () => {
    assert.equal(stringify([1, 2]), "[1,2]");
  });

  it("covers one string field", () => {
    assert.equal(stringify({ value: "42" }), '{value:"42"}');
  });

  it("covers one boolean field", () => {
    assert.equal(stringify({ value: true }), "{value:true}");
  });
});
