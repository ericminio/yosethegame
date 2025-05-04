import { Server } from "../yop/http/server.js";
import { failingWith404 } from "./404.js";
import { helloYosePassing } from "./hello-yose-passing.js";
import { pingPassing } from "./ping-passing.js";
import { primeFactors } from "./prime-factors.js";

const player = (request, response) => {
  console.log(request.url);
  if (request.url === "/") {
    helloYosePassing(response);
  } else if (request.url === "/ping") {
    pingPassing(response);
  } else if (/\/primeFactors\?number=/.test(request.url)) {
    primeFactors(request, response);
  } else {
    failingWith404(response);
  }
};

export const playerServer = new Server(player);

if (!process.argv[1].endsWith("test.js")) {
  playerServer.start((port) => {
    console.log(`player server listening on port ${port}`);
  });
}
