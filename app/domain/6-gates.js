import { Astroport } from "./3-astroport.js";
import { Challenge } from "./challenge.js";

export class Gates extends Challenge {
  constructor() {
    super(
      "Gates",
      `<p class="expectations">Well done! Now we need gates in this astroport to let ships dock and take loads.</p>
      Update your server for <code>/astroport</code> to return a web page with 3 gates.`,
    );
  }

  open(store) {
    return new Astroport().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new Astroport().open(store) && !new Astroport().passed(store);
  }
}
