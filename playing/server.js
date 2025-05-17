import { RouteAssetEqual } from "./yop/http/route-asset-equal.js";
import { RouteDefault } from "./yop/http/route-default.js";
import { Router } from "./yop/http/router.js";
import { Server } from "./yop/http/server.js";
import { scripts } from "../build/scripts.js";
import fs from "fs";

const router = new Router([
  new RouteAssetEqual("/jsdom.js", () => ({
    content: fs
      .readFileSync(new URL("../app/web/assets/jsdom.js", import.meta.url))
      .toString(),
    contentType: "application/javascript",
  })),
  new RouteAssetEqual("/app.js", () => ({
    content: scripts,
    contentType: "application/javascript",
  })),
  new RouteDefault(() => ({
    content: fs
      .readFileSync(new URL("../app/web/assets/index.html", import.meta.url))
      .toString(),
    contentType: "text/html",
  })),
]);

export const server = new Server(router.handler.bind(router));

if (!process.argv[1].endsWith("test.js")) {
  server.start((port) => {
    console.log(`listening on port ${port}`);
  });
}
