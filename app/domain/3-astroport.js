import { HelloYose } from "./1-hello-yose.js";
import { Challenge } from "./challenge.js";

export class Astroport extends Challenge {
  constructor() {
    super("Astroport", "Update your server for ... (coming soon)");
  }

  open(store) {
    return new HelloYose().passed(store);
  }

  hidden() {
    return false;
  }

  teasing() {
    return false;
  }

  async play() {
    return { status: "failed" };
  }
}
