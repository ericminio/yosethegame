import { stringify } from "./stringifier.js";

import {
  primeFactorsOf,
  powerOfTwoChooser,
} from "../../domain/4-power-of-two-lib.js";
import { stringGuardChooser } from "../../domain/5-string-guard-lib.js";
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
  renderRunTrigger,
} from "../rendering.js";
import { run } from "../../domain/running.js";
import { StringGuard } from "../../domain/5-string-guard.js";
import { HelloYose } from "../../domain/1-hello-yose.js";
import { Ping } from "../../domain/2-ping.js";
import { PowerOfTwo } from "../../domain/4-power-of-two.js";
import { Astroport } from "../../domain/3-astroport.js";
import { Challenge } from "../../domain/challenge.js";
import { Gates } from "../../domain/6-gates.js";
import { Dock } from "../../domain/7-dock.js";
import { shipChooser } from "../../domain/7-dock-lib.js";
import { Keep } from "../../domain/8-keep.js";
import { ChallengeAstroport } from "../../domain/challenge-astroport.js";
import { Full } from "../../domain/9-full.js";
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
