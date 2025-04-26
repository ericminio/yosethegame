import { RouteAssetEqual } from "./yop/route-asset-equal.js";
import { Router } from "./yop/router.js";
import { Server } from "./yop/server.js";
import { scripts } from "./web/assets/scripts.js";
import { html } from "./web/assets/html.js";

const router = new Router([
  new RouteAssetEqual("/app.js", () => ({
    content: scripts,
    contentType: "application/javascript",
  })),
  new RouteAssetEqual("/", () => ({
    content: html,
    contentType: "text/html",
  })),
]);

export const server = new Server(router.handler.bind(router));
