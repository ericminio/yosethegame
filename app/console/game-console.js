export class GameConsole {
  constructor(console) {
    this.console = console;
    this.score = 0;

    this.passColor = "\x1b[0;102;30m";
    this.failColor = "\x1b[0;101;30m";
    this.resetColor = "\x1b[0m";
    this.red = "\x1b[0;91m";
    this.green = "\x1b[0;92m";
    this.passed = "\u2714";
    this.failed = "\u2717";
  }

  log(event) {
    if (event.score) {
      this.score = event.score;
      return;
    }
    if (event["score"] !== undefined) {
      return;
    }
    if (!event["result"]) {
      return;
    }

    if (event.result.status === "passed") {
      this.actuallyLog(
        `${this.passColor}PASS${this.resetColor} ${event.challenge}`,
      );
      return;
    }
    if (event.result.status === "failed") {
      this.actuallyLog(
        `${this.failColor}FAIL${this.resetColor} ${event.challenge}`,
      );
      this.actuallyLog(event);
      return;
    }

    this.actuallyLog(event);
  }

  logScore() {
    const leadingSpaces = this.score > 0 ? "" : " ";
    this.actuallyLog("\n---------");
    this.actuallyLog(`SCORE: ${leadingSpaces}${this.score}`);
    this.actuallyLog("---------");
  }

  actuallyLog(message) {
    this.console.log(message);
  }
}
