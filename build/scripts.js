import { stringify } from "./stringifier.js";

import {
  primeFactorsOf,
  powerOfTwoChooser,
} from "../app/domain/4-power-of-two-lib.js";
import { stringGuardChooser } from "../app/domain/5-string-guard-lib.js";
import { Store } from "../app/domain/store.js";
import { wireEvents } from "../app/web/wiring.js";
import {
  dashName,
  challengeResultId,
  challengeSectionId,
  challengeExpectationsId,
  challengeSectionHtml,
  challengeSectionInnerHtml,
  renderChallenge,
  renderRunTrigger,
} from "../app/web/rendering.js";
import { run } from "../app/domain/running.js";
import { StringGuard } from "../app/domain/5-string-guard.js";
import { HelloYose } from "../app/domain/1-hello-yose.js";
import { Ping } from "../app/domain/2-ping.js";
import { PowerOfTwo } from "../app/domain/4-power-of-two.js";
import { Astroport } from "../app/domain/3-astroport.js";
import { Challenge } from "../app/domain/challenge.js";
import { Gates } from "../app/domain/6-gates.js";
import { Dock } from "../app/domain/7-dock.js";
import { shipChooser } from "../app/domain/7-dock-lib.js";
import { Keep } from "../app/domain/8-keep.js";
import { ChallengeAstroport } from "../app/domain/challenge-astroport.js";
import { Full } from "../app/domain/9-full.js";
const codes = [
  `${Challenge.toString()};`,
  `${ChallengeAstroport.toString()};`,
  `${HelloYose.toString()};`,
  `${Ping.toString()};`,
  `const powerOfTwoChooser = ${stringify(powerOfTwoChooser)};`,
  `${PowerOfTwo.toString()};`,
  `const stringGuardChooser = ${stringify(stringGuardChooser)};`,
  `${StringGuard.toString()};`,
  `${Astroport.toString()};`,
  `${Gates.toString()};`,
  `const shipChooser = ${stringify(shipChooser)};`,
  `${Dock.toString()};`,
  `${Keep.toString()};`,
  `${Full.toString()};`,
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
  renderRunTrigger,
  run,
  primeFactorsOf,
]
  .reduce((acc, fn) => {
    return acc + `\nconst ${fn.name} = ${fn.toString()}`;
  }, codes)
  .replace(/export/g, "");
