class Challenge {
  constructor(name, expectations) {
    this.name = name;
    this.expectations = expectations;
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }
};
class ChallengeAstroport extends Challenge {
  constructor(name, expectations) {
    super(name, expectations);
  }

  jsdomOptions(baseUrl) {
    return {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse: (window) => {
        window.fetch = async (url, options) => {
          return await fetch(`${baseUrl}${url}`, options);
        };
      },
    };
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
      "Update your server for <code>/</code> to answer with a page containing &quot;Hello Yose&quot;",
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
    const response = await fetch(playerServerUrl);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 200,
      contentType: "text/html",
      content: 'A web page containing text "Hello Yose"',
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content.indexOf("Hello Yose") !== -1
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
  }
};
class Ping extends Challenge {
  constructor() {
    super(
      "Ping",
      "Update your server for <code>/ping</code> to answer with json { &quot;pong&quot;: &quot;hi there!&quot; }",
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
    const response = await fetch(`${playerServerUrl}/ping`);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({ pong: "hi there!" }),
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content === expected.content
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
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
    const response = await fetch(
      `${playerServerUrl}/primeFactors?number=${number}`,
    );
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        decomposition: primeFactorsOf(number),
      }),
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content === expected.content
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
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
    const response = await fetch(
      `${playerServerUrl}/primeFactors?number=${number}`,
    );
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 400,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        error: "not a number",
      }),
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content === expected.content
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
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
      content: "A web page containing non-empty element #astroport-name",
    };

    try {
      const baseUrl = `${playerServerUrl}/astroport`;
      const dom = await jsdom.JSDOM.fromURL(
        baseUrl,
        this.jsdomOptions(baseUrl),
      );
      const page = dom.window.document;

      return page.querySelector("#astroport-name") !== null &&
        page.querySelector("#astroport-name").textContent !== ""
        ? { status: "passed" }
        : {
            status: "failed",
            expected,
            actual: {
              status: 200,
              contentType: "text/html",
              content: page.body.innerHTML,
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
      const baseUrl = `${playerServerUrl}/astroport`;
      const dom = await jsdom.JSDOM.fromURL(
        baseUrl,
        this.jsdomOptions(baseUrl),
      );
      const page = dom.window.document;
      let one = page.querySelector("#gate-1 #ship-1");
      let two = page.querySelector("#gate-2 #ship-2");
      let three = page.querySelector("#gate-3 #ship-3");

      return one && two && three
        ? { status: "passed" }
        : {
            status: "failed",
            expected,
            actual: {
              status: 200,
              contentType: "text/html",
              content: page.body.innerHTML,
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
      const baseUrl = `${playerServerUrl}/astroport`;
      const dom = await jsdom.JSDOM.fromURL(
        baseUrl,
        this.jsdomOptions(baseUrl),
      );
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
      `When the user docks a ship, the ship should still appear docked after reload.`,
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
      const baseUrl = `${playerServerUrl}/astroport`;
      let dom = await jsdom.JSDOM.fromURL(baseUrl, this.jsdomOptions(baseUrl));
      let page = dom.window.document;

      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      page.getElementById("ship").value = shipName;
      page.getElementById("dock").click();
      await this.readDockContent(page, 1);

      dom = await jsdom.JSDOM.fromURL(baseUrl, this.jsdomOptions(baseUrl));
      page = dom.window.document;
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
class Store {
  constructor() {
    this.store = {
      score: 0,
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
    store.register("score", () => {
      const challengeSection = document.getElementById(
        challengeSectionId(challenge.name),
      );
      renderChallenge(challenge, store, challengeSection);
    });
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
  challengeSection.outerHTML = challengeSectionHtml(challenge, store);
}
const run = async (playerServerUrl, store) => {
  let score = 0;
  const challenges = store.get("challenges");
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
      }
    }

    for (const challenge of openChallenges) {
      challengesCopy.splice(
        challengesCopy.findIndex((c) => c.name === challenge.name),
        1,
      );
    }
  }
  store.save("score", score);
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