export class Challenge {
  constructor(name, expectations, assignment) {
    this.name = name;
    this.expectations = expectations;
    this.assignment = assignment;
    this.playerDocument = {};
    this.error = undefined;
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }
}
