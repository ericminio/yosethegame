export class Astroport {
  constructor() {
    this.name = "Astroport";
    this.expectations = "Update your server for ... (coming soon)";
  }

  open(store) {
    const helloYoseResult = store.get("Hello Yose");
    const pingResult = store.get("Ping");
    if (helloYoseResult && helloYoseResult.status === "passed") {
      return pingResult && pingResult.status === "passed";
    }
    return false;
  }
  hidden() {
    return false;
  }
  async play() {
    return { status: "failed" };
  }
}
