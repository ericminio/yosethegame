import { stringify } from "../../yop/stringifier.js";

import { challenges } from "../../challenges/index.js";
import { wireEvents } from "../wiring.js";
import {
  dashName,
  challengeStatusId,
  challengeSectionHtml,
  showChallenges,
} from "../rendering.js";
import { run } from "../running.js";

const challengesDefinition = `const challenges = ${stringify(challenges)}`;

export const scripts = [
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
