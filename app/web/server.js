import fs from "fs";
import { RouteAssetEqual } from "../yop/route-asset-equal.js";
import { Router } from "../yop/router.js";
import { Server } from "../yop/server.js";

import { wireEvents } from "./wiring.js";
import {
  dashName,
  challengeStatusId,
  challengeSectionHtml,
  showChallenges,
} from "./challenges.js";
import { run } from "./run.js";

const challenges = `[
  { name: "Hello Yose", open: true },
  { name: "Ping", open: true },
  { name: "Astroport", open: false },
];`;

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
  }, `const challenges = ${challenges}`)
  .replace(/export/g, "");
const html = fs
  .readFileSync(new URL("./index.html", import.meta.url))
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
