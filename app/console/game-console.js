export class GameConsole {
  constructor(console) {
    this.console = console;
    this.score = undefined;

    this.passColor = "\x1b[0;102;30m";
    this.failColor = "\x1b[0;101;30m";
    this.resetColor = "\x1b[0m";
    this.red = "\x1b[0;91m";
    this.green = "\x1b[0;92m";
    this.success = "\u2714";
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
        `${this.green}${this.success}${this.resetColor} ${event.challenge}`,
      );
      return;
    }

    this.actuallyLog(event);
  }

  logScore() {
    this.actuallyLog(`SCORE: ${this.score}`);
  }

  actuallyLog(message) {
    this.console.log(message);
    // this.console.log(`${this.green}\u2714${this.resetColor}`);
  }
}
