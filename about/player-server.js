import { Server } from "../yop/http/server.js";

const helloYosePassing = (response) => {
  const html = "<html><body>Hello Yose</body></html>";
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "text/html",
    "content-length": html.length,
  });
  response.end(html);
};

const pingFailing = (response) => {
  const pong = JSON.stringify({ random: "not expected" });
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "content-length": pong.length,
  });
  response.end(pong);
};

const failingWith404 = (response) => {
  const text = "NOT FOUND";
  response.writeHead(404, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "text/plain",
    "content-length": text.length,
  });
  response.end(text);
};

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
