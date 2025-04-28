import { stringify } from "../../../yop/utils/stringifier.js";

import { challenges } from "../../domain/index.js";
import { wireEvents } from "../wiring.js";
import {
  dashName,
  challengeStatusId,
  challengeSectionHtml,
  showChallenges,
  showScore,
} from "../rendering.js";
import { run } from "../running.js";

const challengesDefinition = `const challenges = ${stringify(challenges)}`;

export const scripts = [
  wireEvents,
  dashName,
  challengeStatusId,
  challengeSectionHtml,
  showChallenges,
  showScore,
  run,
]
  .reduce((acc, fn) => {
    return acc + `\nconst ${fn.name} = ${fn.toString()}`;
  }, challengesDefinition)
  .replace(/export/g, "");
