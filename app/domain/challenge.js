export class Challenge {
  constructor(name, expectations) {
    this.name = name;
    this.expectations = expectations;
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }
}
