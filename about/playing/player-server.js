import { Server } from "../../yop/http/server.js";
import { failingWith404 } from "./404.js";
import { helloYosePassing } from "./hello-yose-passing.js";
import { pingFailing } from "./ping-failing.js";

const player = (request, response) => {
  if (request.url === "/") {
    helloYosePassing(response);
  } else if (request.url === "/ping") {
    pingFailing(response);
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
