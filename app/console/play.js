import { ConsoleGameRunner } from "./console-game-runner.js";

const playerServerUrl = process.argv[process.argv.length - 1];

if (playerServerUrl.indexOf("http://") === -1) {
  console.error("Please provide a player server URL as the first argument.");
  process.exit(1);
}
console.log(`Playing against: ${playerServerUrl}`);

const game = new ConsoleGameRunner();
game.play(playerServerUrl);
