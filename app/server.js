import fs from "fs";
import { RouteAssetEqual } from "./yop/route-asset-equal.js";
import { Router } from "./yop/router.js";
import { Server } from "./yop/server.js";

import { wireEvents } from "./web/wiring.js";
import {
  dashName,
  challengeStatusId,
  challengeSectionHtml,
  showChallenges,
} from "./web/rendering.js";
import { run } from "./web/running.js";
import { challenges } from "./challenges/index.js";
import { stringify } from "./yop/stringifier.js";

const challengesDefinition = `const challenges = ${stringify(challenges)}`;

const scripts = [
  wireEvents,
  dashName,
  challengeStatusId,
  challengeSectionHtml,
  showChallenges,
  run,
]
  .reduce((acc, fn) => {
    return acc + `\nconst ${fn.name} = ${fn.toString()}`;
  }, challengesDefinition)
  .replace(/export/g, "");

const html = fs
  .readFileSync(new URL("./web/index.html", import.meta.url))
  .toString();

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
