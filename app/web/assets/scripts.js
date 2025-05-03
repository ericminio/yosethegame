import { stringify } from "./stringifier.js";

import {
  primeFactorsOf,
  powerOfTwoChooser,
} from "../../domain/4-power-of-two-lib.js";
import { stringGuardChooser } from "../../domain/5-string-guard-lib.js";
import { challenges } from "../../domain/challenges.js";
import { Store } from "../../domain/store.js";
import { wireEvents } from "../wiring.js";
import {
  dashName,
  challengeResultId,
  challengeSectionId,
  challengeExpectationsId,
  challengeSectionHtml,
  challengeSectionInnerHtml,
  renderChallenge,
} from "../rendering.js";
import { run } from "../../domain/running.js";

const codes = [
  `const powerOfTwoChooser = ${stringify(powerOfTwoChooser)};`,
  `const stringGuardChooser = ${stringify(stringGuardChooser)};`,
  `const challenges = ${stringify(challenges)};`,
  `${Store.toString()};`,
].join("\n");

export const scripts = [
  wireEvents,
  dashName,
  challengeResultId,
  challengeSectionId,
  challengeExpectationsId,
  challengeSectionHtml,
  challengeSectionInnerHtml,
  renderChallenge,
  run,
  primeFactorsOf,
]
  .reduce((acc, fn) => {
    return acc + `\nconst ${fn.name} = ${fn.toString()}`;
  }, codes)
  .replace(/export/g, "");
