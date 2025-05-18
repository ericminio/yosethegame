import { Server } from "./yop/http/server.js";
import { failingWith404 } from "./404.js";
import { astroport } from "./astroport.js";
import { dock } from "./dock.js";
import { getDocks } from "./docks.js";
import { helloYosePassing } from "./hello-yose-passing.js";
import { pingPassing } from "./ping-passing.js";
import { primeFactors } from "./prime-factors.js";

const docks = {};

const player = (request, response) => {
  console.log(`${request.method} ${request.url}`);
  //   console.log(request.headers);
  if (request.url === "/") {
    helloYosePassing(response);
  } else if (request.url === "/ping") {
    pingPassing(response);
  } else if (/\/primeFactors\?number=/.test(request.url)) {
    primeFactors(request, response);
  } else if (request.url === "/astroport" && request.method === "OPTIONS") {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-HEADERS": "content-type, user-agent",
      "content-length": "0",
    });
    response.end();
  } else if (request.url === "/astroport") {
    astroport(request, response);
  } else if (
    request.url === "/astroport/dock" &&
    request.method === "OPTIONS"
  ) {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-HEADERS": "content-type",
      "content-length": "0",
    });
    response.end();
  } else if (request.url === "/astroport/dock" && request.method === "POST") {
    dock(docks, request, response);
  } else if (request.url === "/astroport/docks" && request.method === "GET") {
    getDocks(docks, request, response);
  } else {
    failingWith404(response);
  }
  console.log({ docks });
};

export const playerServer = new Server(player);

if (!process.argv[1].endsWith("test.js")) {
  playerServer.start((port) => {
    console.log(`player server listening on port ${port}`);
  });
}
