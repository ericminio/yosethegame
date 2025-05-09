class Challenge {
  constructor(name, expectations) {
    this.name = name;
    this.expectations = expectations;
  }

  buildUrl(segments) {
    return segments.map((s) => s.replace(/\/*$/, "")).join("/");
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }

  async openPage(playerServerUrl) {
    return jsdom.JSDOM.fromURL(
      this.baseUrl(playerServerUrl),
      this.jsdomOptions(playerServerUrl),
    );
  }

  jsdomOptions(playerServerUrl) {
    return {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse: (window) => {
        window.fetch = async (url, options) => {
          return await fetch(`${this.baseUrl(playerServerUrl)}${url}`, options);
        };
      },
    };
  }
};
class ChallengeAstroport extends Challenge {
  constructor(name, expectations) {
    super(name, expectations);
  }

  baseUrl(playerServerUrl) {
    return super.buildUrl([playerServerUrl, "astroport"]);
  }

  readDockContent(page, gateNumber) {
    return new Promise(async (resolve) => {
      let dockContent = page.getElementById(`ship-${gateNumber}`).textContent;
      if (dockContent) {
        resolve(dockContent);
      } else {
        let count = 0;
        while (dockContent === "" && count < 3) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          dockContent = page.getElementById(`ship-${gateNumber}`).textContent;
          count++;
        }
        resolve(dockContent);
      }
    });
  }
};
class HelloYose extends Challenge {
  constructor() {
    super(
      "Hello Yose",
      `
        Update your server for <code>/</code> to answer with a page containing &quot;Hello Yose&quot;
        <div class="tip">
            <label class="light">&#x1f4a1;</label>
            <label>Enable CORS on your server</label>
        </div>
      `,
    );
  }

  open() {
    return true;
  }

  hidden() {
    return false;
  }
  teasing() {
    return false;
  }

  async play(playerServerUrl) {
    const expected = {
      status: 200,
      contentType: "text/html",
      content: 'A web page containing text "Hello Yose"',
    };
    try {
      const response = await fetch(this.buildUrl([playerServerUrl]));
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
      }
      if (contentType.indexOf(expected.contentType) == -1) {
        throw new Error(
          `content-type ${contentType} instead of ${expected.contentType}`,
        );
      }
      if (content.indexOf("Hello Yose") === -1) {
        throw new Error("'Hello Yose' not found in content");
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: { error: error.message },
      };
    }
  }
};
class Ping extends Challenge {
  constructor() {
    super(
      "Ping",
      `Update your server for <code>/ping</code> to answer with json { &quot;pong&quot;: &quot;hi there!&quot; }
        <div class="tip">
            <label class="light">&#x1f4a1;</label>
            <label>Enable CORS on your server</label>
        </div>
      `,
    );
  }

  open() {
    return true;
  }

  hidden() {
    return false;
  }

  teasing() {
    return false;
  }

  async play(playerServerUrl) {
    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({ pong: "hi there!" }),
    };
    try {
      const response = await fetch(this.buildUrl([playerServerUrl, "ping"]));
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
      }
      if (contentType.indexOf(expected.contentType) == -1) {
        throw new Error(
          `content-type ${contentType} instead of ${expected.contentType}`,
        );
      }
      if (content !== expected.content) {
        throw new Error(`content was not ${expected.content}`);
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: { error: error.message },
      };
    }
  }
};
const powerOfTwoChooser = {getNumber:() => {
    const numbers = [8, 16, 32, 64, 128, 1024, 2048];
    const index = Math.floor(Math.random() * numbers.length);
    return numbers[index];
  }};
class PowerOfTwo extends Challenge {
  constructor() {
    super(
      "Power of two",
      "Update your server for <code>/primeFactors?number=4</code> to answer with prime factors decomposition",
    );
  }

  open(store) {
    return new Ping().passed(store);
  }

  hidden() {
    return false;
  }

  teasing() {
    return false;
  }

  async play(playerServerUrl) {
    const number = powerOfTwoChooser.getNumber();
    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        decomposition: primeFactorsOf(number),
      }),
    };
    try {
      const response = await fetch(
        this.buildUrl([playerServerUrl, `primeFactors?number=${number}`]),
      );
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
      }
      if (contentType.indexOf(expected.contentType) == -1) {
        throw new Error(
          `content-type ${contentType} instead of ${expected.contentType}`,
        );
      }
      if (content !== expected.content) {
        return {
          status: "failed",
          expected,
          actual: {
            status,
            contentType,
            content: content.substring(0, 50),
          },
        };
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: { error: error.message },
      };
    }
  }
};
const stringGuardChooser = {getString:() => {
    const strings = [
      "yolo",
      "hello",
      "world",
      "geek",
      "javascript",
      "prime",
      "factors",
      "optimus",
      "batman",
      "surfer",
    ];
    const index = Math.floor(Math.random() * strings.length);
    return strings[index];
  }};
class StringGuard extends Challenge {
  constructor() {
    super(
      "String guard",
      "Update your server for <code>/primeFactors</code> to answer with bad request when the input is not a number",
    );
  }

  open(store) {
    return new PowerOfTwo().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new PowerOfTwo().open(store) && !new PowerOfTwo().passed(store);
  }

  async play(playerServerUrl) {
    const number = stringGuardChooser.getString();
    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        error: "not a number",
      }),
    };
    try {
      const response = await fetch(
        this.buildUrl([playerServerUrl, `primeFactors?number=${number}`]),
      );
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const content = await response.text();
      if (status !== expected.status) {
        throw new Error(`status ${status} instead of ${expected.status}`);
      }
      if (contentType.indexOf(expected.contentType) === -1) {
        throw new Error(
          `content-type ${contentType} instead of ${expected.contentType}`,
        );
      }
      if (content !== expected.content) {
        throw new Error(`content was not ${expected.content}`);
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: { error: error.message },
      };
    }
  }
};
class Astroport extends ChallengeAstroport {
  constructor() {
    super(
      "Astroport",
      "Update your server for <code>/astroport</code> to return a web page containing <code>#astroport-name</code>.",
    );
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

  async play(playerServerUrl) {
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page behind /astroport containing non-empty element #astroport-name",
    };

    try {
      const dom = await this.openPage(playerServerUrl);
      const page = dom.window.document;
      if (page.getElementById("astroport-name") === null) {
        throw new Error("missing element #astroport-name");
      }
      if (page.getElementById("astroport-name").textContent === "") {
        throw new Error("Element #astroport-name is empty");
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: {
          error: error.message,
        },
      };
    }
  }
};
class Gates extends ChallengeAstroport {
  constructor() {
    super(
      "Gates",
      `<p class="expectations">Well done! Now we need gates in this astroport to let ships dock and take loads.
      Each #gate-n element will be expected to include a #ship-n element</p>
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

  async play(playerServerUrl) {
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page containing #gate-1 #ship-1, #gate-2 #ship 2, #gate-3 ship-3",
    };

    try {
      const dom = await this.openPage(playerServerUrl);
      const page = dom.window.document;
      let one = page.querySelector("#gate-1 #ship-1");
      let two = page.querySelector("#gate-2 #ship-2");
      let three = page.querySelector("#gate-3 #ship-3");
      const count = [one, two, three].filter((e) => e).length;
      if (count !== 3) {
        throw new Error(`only ${count} gate(s) found`);
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: {
          error: error.message,
        },
      };
    }
  }
};
const shipChooser = {getShipName:() => {
    const ships = [
      "Gros Mollo",
      "The Black Pearl",
      "Millenium Falcon",
      "The Bounty",
      "The Great Condor",
      "Goldorak",
    ];
    const index = Math.floor(Math.random() * ships.length);
    return ships[index];
  }};
class Dock extends ChallengeAstroport {
  constructor() {
    super(
      "Dock",
      `<p class="expectations">Update your server to let the user dock a ship at the first gate.</p>
      
      After the user enters a ship name in the #ship field and press the #dock button,
      the ship's name should appear in the element #ship-1.`,
    );
  }

  open(store) {
    return new Gates().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new Gates().open(store) && !new Gates().passed(store);
  }

  async play(playerServerUrl) {
    const expected = {
      content: "A web page containing a #ship input field, and a #dock button",
    };

    try {
      const dom = await this.openPage(playerServerUrl);
      const page = dom.window.document;
      if (page.getElementById("ship") === null) {
        throw new Error("input field #ship is missing");
      }
      if (page.getElementById("dock") === null) {
        throw new Error("button #dock is missing");
      }
      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
      const dockContent = await this.readDockContent(page, 1);

      return new RegExp(shipName).test(dockContent)
        ? { status: "passed" }
        : {
            status: "failed",
            expected,
            actual: {
              content: `#ship-1 content is '${dockContent}'`,
            },
          };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: {
          error: error.message,
        },
      };
    }
  }
};
class Keep extends ChallengeAstroport {
  constructor() {
    super(
      "Keep",
      `When the user docks a ship, the ship should still appear docked after reload.
        <div class="tip">
            <label class="light">&#x1f4a1;</label>
            <label>Maybe your CORS config needs an update</label>
        </div>
      `,
    );
  }

  open(store) {
    return new Dock().passed(store);
  }

  hidden(store) {
    return !this.open(store);
  }

  teasing(store) {
    return new Dock().open(store) && !new Dock().passed(store);
  }

  async play(playerServerUrl) {
    const expected = {
      content: "A web page keeping the docked ship after reload",
    };

    try {
      let dom = await this.openPage(playerServerUrl);
      let page = dom.window.document;

      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
      const dockContentBeforeReload = await this.readDockContent(page, 1);
      if (!new RegExp(shipName).test(dockContentBeforeReload)) {
        throw new Error(
          `#ship-1 content is '${dockContentBeforeReload}' before reload`,
        );
      }

      dom = await this.openPage(this.buildUrl([playerServerUrl]));
      page = dom.window.document;
      const dockContent = await this.readDockContent(page, 1);
      if (!new RegExp(shipName).test(dockContent)) {
        throw new Error(`#ship-1 content is '${dockContent}' after reload`);
      }

      return { status: "passed" };
    } catch (error) {
      return {
        status: "failed",
        expected,
        actual: {
          error: error.message,
        },
      };
    }
  }
};
class Full extends ChallengeAstroport {
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
    return { status: "failed", message: "comming soon" };
  }
};
class Store {
  constructor() {
    this.store = {
      score: 0,
      running: false,
    };
    this.listeners = {};
  }

  register(key, listener) {
    const listeners = this.listeners[key] ?? [];
    listeners.push(listener);
    this.listeners[key] = listeners;
    if (this.get(key) !== undefined) {
      listener(this.get(key));
    }
  }

  save(key, value) {
    this.store[key] = value;
    const listeners = this.listeners[key] ?? [];
    for (const listener of listeners) {
      listener(value);
    }
  }

  get(key) {
    return this.store[key];
  }
};
const wireEvents = async (document, store) => {
  document.getElementById("run").addEventListener("click", () => {
    return run(document.getElementById("url").value, store);
  });
  store.register("score", (score) => {
    document.getElementById("score").innerHTML = `${score}`;
  });
  store.register("challenges", (challenges) => {
    document.getElementById("challenges").innerHTML = challenges.reduce(
      (acc, challenge) => acc + challengeSectionHtml(challenge, store),
      "",
    );
  });
  store.get("challenges").forEach((challenge) => {
    const challengeSection = document.getElementById(
      challengeSectionId(challenge.name),
    );
    store.register(challenge.name, () => {
      renderChallenge(challenge, store, challengeSection);
    });
    store.register("score", () => {
      renderChallenge(challenge, store, challengeSection);
    });
  });
  store.register("running", (running) => {
    const runTriggerElement = document.getElementById("run");
    renderRunTrigger(runTriggerElement, running);
  });
}
const dashName = (name) => name.replace(/ /g, "-").toLowerCase()
const challengeResultId = (name) => `challenge-${dashName(name)}-result`
const challengeSectionId = (name) =>
  `challenge-${dashName(name)}-section`
const challengeExpectationsId = (name) =>
  `challenge-${dashName(name)}-expectations`
const challengeSectionHtml = (challenge, store) => {
  return `
    <section class="challenge${challenge.hidden(store) && !challenge.teasing(store) ? " hidden" : ""}" id="${challengeSectionId(challenge.name)}">
      ${challengeSectionInnerHtml(challenge, store)}
    </section>`;
}
const challengeSectionInnerHtml = (
  { name, open, teasing, expectations },
  store,
) => {
  const result = store.get(name);
  const expectationsText =
    result && result.status === "passed"
      ? ""
      : `<p class="expectations" id="${challengeExpectationsId(name)}">${open(store) ? expectations : ""}</p>`;
  const resultStatus = result
    ? result.status === "passed"
      ? `<label class="challenge-status-passed">&#10004;</label>`
      : `<label class="challenge-status-failed">&#10007;</label>`
    : "";
  const resultText = result
    ? result.status === "failed"
      ? `<pre>${JSON.stringify(result, null, 2)}</pre>`
      : ""
    : open(store)
      ? ""
      : "closed";
  let html = `
      <div class="challenge-header">
        <h2 class="challenge-name">${name}</h2>
        ${resultStatus}
      </div>
      ${expectationsText}
      <label id="${challengeResultId(name)}">${resultText}</label>
    `;
  if (teasing(store)) {
    html = `
        <div class="hidden">
            ${html}
        </div>
        <div class="teaser">...</div>
    `;
  }
  return html;
}
const renderChallenge = (challenge, store, challengeSection) => {
  challengeSection.innerHTML = challengeSectionInnerHtml(challenge, store);
  challengeSection.className = `challenge${challenge.hidden(store) && !challenge.teasing(store) ? " hidden" : ""}`;
}
const renderRunTrigger = (element, isRunning) => {
  const classList = ["run-trigger"];
  if (isRunning) {
    classList.push("spinning");
  }
  element.className = classList.join(" ");
  element.innerHTML = isRunning ? "&#x25b6;" : "&#x25b6;";
}
const run = async (playerServerUrl, store) => {
  store.save("running", true);
  let score = 0;
  const challenges = store.get("challenges");
  for (const challenge of challenges) {
    store.save(challenge.name, null);
  }
  store.save("score", score);
  const challengesCopy = [...challenges];

  while (challengesCopy.some((challenge) => challenge.open(store))) {
    const openChallenges = challengesCopy.reduce((acc, challenge) => {
      if (challenge.open(store)) {
        acc.push(challenge);
      }
      return acc;
    }, []);
    for (const challenge of openChallenges) {
      let result;
      try {
        result = await challenge.play(playerServerUrl);
      } catch (error) {
        result = {
          status: "failed",
          message: error.message,
        };
      }
      store.save(challenge.name, result);
      if (/passed/.test(result.status)) {
        score += 10;
        store.save("score", score);
      }
    }

    for (const challenge of openChallenges) {
      challengesCopy.splice(
        challengesCopy.findIndex((c) => c.name === challenge.name),
        1,
      );
    }
  }

  store.save("running", false);
}
const primeFactorsOf = (number) => {
  const factors = [];
  let divisor = 2;
  while (number > 1) {
    if (number % divisor === 0) {
      factors.push(divisor);
      number = number / divisor;
    }
  }

  return factors;
}