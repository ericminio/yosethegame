import { Server } from "../../app/yop/server.js";

const player = (request, response) => {
  if (request.url === "/") {
    const html = "<html><body>Hello Yose</body></html>";
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "content-type": "text/html",
      "content-length": html.length,
    });
    response.end(html);
  } else if (request.url === "/ping") {
    const pong = JSON.stringify({ random: "not expected" });
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json",
      "content-length": pong.length,
    });
    response.end(pong);
  } else {
    const text = "NOT FOUND";
    response.writeHead(404, {
      "Access-Control-Allow-Origin": "*",
      "content-type": "text/plain",
      "content-length": text.length,
    });
    response.end(text);
  }
};

export const playerServer = new Server(player);

if (!process.argv[1].endsWith("test.js")) {
  playerServer.start((port) => {
    console.log(`player server listening on port ${port}`);
  });
}
