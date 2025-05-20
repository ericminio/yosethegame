export class GameConsole {
  constructor(console) {
    this.console = console;
    this.score = undefined;
  }

  log(event) {
    if (event.score) {
      this.score = event.score;
      return;
    }
    if (event["score"] !== undefined) {
      return;
    }
    if (event["result"] === null) {
      return;
    }

    this.actuallyLog(event);
  }

  logScore() {
    this.actuallyLog(`SCORE: ${this.score}`);
  }

  actuallyLog(message) {
    this.console.log(message);
  }
}
