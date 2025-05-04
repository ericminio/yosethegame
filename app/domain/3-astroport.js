export class Astroport {
  constructor() {
    this.name = "Astroport";
    this.expectations = "Update your server for ... (coming soon)";
  }

  open(store) {
    const helloYoseResult = store.get("Hello Yose");
    const pingResult = store.get("Ping");
    return helloYoseResult && helloYoseResult.status === "passed"
      ? true
      : false;
  }
  hidden() {
    return false;
  }
  async play() {
    return { status: "failed" };
  }
}
