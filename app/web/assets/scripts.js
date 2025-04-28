import { stringify } from "../../../yop/utils/stringifier.js";

import { challenges } from "../../domain/index.js";
import { Store } from "../../domain/store.js";
import { wireEvents } from "../wiring.js";
import {
  dashName,
  challengeStatusId,
  challengeSectionHtml,
  showChallenges,
} from "../rendering.js";
import { run } from "../running.js";

const challengesDefinition = `const challenges = ${stringify(challenges)};\n`;
const storeDefinition = `${Store.toString()};\n`;

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
  }, challengesDefinition + storeDefinition)
  .replace(/export/g, "");
