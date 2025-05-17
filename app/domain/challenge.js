export class Challenge {
  constructor(name, expectations) {
    this.name = name;
    this.expectations = expectations;
    this.playerDocument = {};
    this.error = undefined;
  }

  buildUrl(segments) {
    return segments.map((s) => s.replace(/\/*$/, "")).join("/");
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }
}
