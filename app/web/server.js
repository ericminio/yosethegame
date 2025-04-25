import {
  RouteAssetEqual,
  RouteDefault,
  RouteYop,
  Router,
  Server,
  html,
  scripts,
} from "../../yop/dist/index.js";

const router = new Router([
  new RouteYop(),
  new RouteAssetEqual(
    "/app.js",
    scripts(["./wiring.js", "./challenges.js", "./run.js"], import.meta.url),
  ),
  new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));
