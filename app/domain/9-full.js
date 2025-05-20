import { Keep } from "./8-keep.js";
import { ChallengeAstroport } from "./challenge-astroport.js";

export class Full extends ChallengeAstroport {
  constructor() {
    super("Full", `Display a message when all gates are occupied.`);
  }

  open(store) {
    return new Keep().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new Keep().open(store) && !new Keep().passed(store);
  }

  async play(playerServerUrl) {
    return { status: "pending", message: "comming soon" };
  }
}
