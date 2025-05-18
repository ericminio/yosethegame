export class Challenge {
  constructor(name, expectations) {
    this.name = name;
    this.expectations = expectations;
    this.playerDocument = {};
    this.error = undefined;
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }
}
