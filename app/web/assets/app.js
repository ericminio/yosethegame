class JsdomPage {
  constructor() {
    this.error = undefined;
  }

  async open(segments) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("jsdomError", (error) => {
      this.error = `JSDOM Error -- ${error.message}`;
    });
    const options = {
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole,
      beforeParse: (window) => {
        window.fetch = async (url, options) => {
          const target =
            url.indexOf("http") === 0 ? url : buildUrl([segments[0], url]);
          return await fetch(`${target}`, options);
        };
        window.TextEncoder = window.TextEncoder || TextEncoder;
        window.TextDecoder = window.TextDecoder || TextDecoder;
      },
    };
    return new Promise(async (resolve, reject) => {
      try {
        const dom = await jsdom.JSDOM.fromURL(buildUrl(segments), options);
        this.window = dom.window;
        this.document = dom.window.document;
        if (this.document.readyState === "loading") {
          this.document.addEventListener("DOMContentLoaded", () => {
            if (this.error) {
              reject(new Error(this.error));
            }
            resolve(this);
          });
        } else {
          if (this.error) {
            reject(new Error(this.error));
          }
          resolve(this);
        }
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async close() {
    return new Promise((resolve) => {
      if (this.window) {
        this.window.close();
      }
      resolve();
    });
  }

  async querySelector(selector) {
    return this.document.querySelector(selector);
  }

  async enterValue(selector, value) {
    const input = await this.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new this.window.Event("input"));
  }

  async clickElement(selector) {
    const selected = await this.querySelector(selector);
    await selected.click();
  }

  async textContent(selector) {
    const selected = await this.querySelector(selector);
    return selected.textContent;
  }

  executeScript(code) {
    code(this.window, this.document);
  }

  location() {
    return this.window.location.href;
  }

  title() {
    return this.document.title;
  }

  html() {
    return this.document.body.innerHTML;
  }

  section(text) {
    return this.find({ tag: "section", text })
      .textContent.replace(/\s\s+/g, " ")
      .trim();
  }

  color(text) {
    const label = this.find({ tag: "label", text });
    const style = this.document.defaultView.getComputedStyle(label, null);

    return style.color;
  }

  activeElementId() {
    return this.document.activeElement.id;
  }

  inputValue(prompt) {
    return this.input(prompt).value;
  }

  inputId(prompt) {
    return this.input(prompt).id;
  }

  element(selector) {
    return this.document.querySelector(selector);
  }

  click(text) {
    this.find({ tag: "button", text }).click();
  }

  enter(prompt, value) {
    let field = this.input(prompt);
    field.value = value;
    field.dispatchEvent(new this.window.Event("input"));
  }

  input(prompt) {
    let label = this.find({ tag: "label", text: prompt });
    if (label.htmlFor.length === 0) {
      throw new Error(`label with text '${prompt}' is missing for attribute`);
    }
    let candidate = this.element(`#${label.htmlFor}`);
    if (candidate === null) {
      throw new Error(`input with id '${label.htmlFor}' not found`);
    }
    return candidate;
  }

  find(options) {
    if (!this.document) {
      throw new Error("page.document must be defined");
    }
    const document = options.in || this.document;
    let candidates = Array.from(document.querySelectorAll(options.tag)).filter(
      (element) =>
        element.textContent.indexOf(options.text) !== -1 ||
        element.getAttribute("name") === options.text,
    );
    if (candidates.length === 0) {
      throw new Error(
        `${options.tag} with text or name '${options.text}' not found`,
      );
    }
    return candidates.sort(
      (a, b) => a.textContent.length - b.textContent.length,
    )[0];
  }
};
class Challenge {
  constructor(name, expectations, assignment) {
    this.name = name;
    this.expectations = expectations;
    this.assignment = assignment;
    this.playerDocument = {};
    this.error = undefined;
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }
};
class ChallengeAstroport extends Challenge {
  constructor(name, expectations, assignment) {
    super(name, expectations, assignment);
  }

  waitForShipDockedAtGivenGate(gateNumber, shipName, pageDriver) {
    const pattern = new RegExp(shipName);
    return new Promise(async (resolve) => {
      let dockContent = await pageDriver.textContent(`#ship-${gateNumber}`);
      if (pattern.test(dockContent)) {
        resolve(dockContent);
      } else {
        let count = 0;
        while (!pattern.test(dockContent) && count < 7) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          dockContent = await pageDriver.textContent(`#ship-${gateNumber}`);
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
            <label>Because your server will be called from here,
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">CORS</a> has to be enabled
            for everything: html pages, json endpoints.
            For now, only <code>Access-Control-Allow-Origin</code> is needed.
            Here is <a href="https://github.com/ericminio/yosethegame/blob/dev/playing/hello-yose-passing.js">an example</a></label>
        </div>
      `,
      "Update your server for / to answer with a page containing Hello Yose",
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
      const response = await fetch(buildUrl([playerServerUrl]));
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
      'Update your server for /ping to answer with json { pong: "hi there!" }',
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
      const response = await fetch(buildUrl([playerServerUrl, "ping"]));
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
      "Update your server for /primeFactors?number=4 to answer with prime factors decomposition",
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
        buildUrl([playerServerUrl, `primeFactors?number=${number}`]),
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
      "Update your server for /primeFactors to answer with bad request when the input is not a number",
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
      status: 400,
      contentType: "application/json",
      content: JSON.stringify({
        number,
        error: "not a number",
      }),
    };
    try {
      const response = await fetch(
        buildUrl([playerServerUrl, `primeFactors?number=${number}`]),
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
      "Update your server for /astroport to return a web page containing #astroport-name",
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

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page behind /astroport containing non-empty element #astroport-name",
    };

    try {
      await pageDriver.open([playerServerUrl, "astroport"]);
      if ((await pageDriver.querySelector("#astroport-name")) === null) {
        throw new Error("missing element #astroport-name");
      }
      if ((await pageDriver.textContent("#astroport-name")) === "") {
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
      "Update your server for /astroport to return a web page with 3 gates.",
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

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      status: 200,
      contentType: "text/html",
      content:
        "A web page containing #gate-1 #ship-1, #gate-2 #ship 2, #gate-3 ship-3",
    };

    try {
      await pageDriver.open([playerServerUrl, "astroport"]);
      let one = await pageDriver.querySelector("#gate-1 #ship-1");
      let two = await pageDriver.querySelector("#gate-2 #ship-2");
      let three = await pageDriver.querySelector("#gate-3 #ship-3");
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
    } finally {
      await pageDriver.close();
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
      "Update your server to let the user dock a ship at the first gate",
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

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      content: "A web page containing a #ship input field, and a #dock button",
    };
    try {
      await pageDriver.open([playerServerUrl, "astroport"]);
      if ((await pageDriver.querySelector("input#ship")) === null) {
        throw new Error("input field #ship is missing");
      }
      if ((await pageDriver.querySelector("button#dock")) === null) {
        throw new Error("button #dock is missing");
      }
      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;

      await pageDriver.enterValue("#ship", shipName);
      await pageDriver.clickElement("#dock");
      const dockContent = await this.waitForShipDockedAtGivenGate(
        1,
        shipName,
        pageDriver,
      );

      if (pageDriver.error) {
        throw new Error(pageDriver.error);
      }
      if (!new RegExp(shipName).test(dockContent)) {
        return {
          status: "failed",
          expected,
          actual: {
            content: `#ship-1 content is '${dockContent}'`,
          },
        };
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
    } finally {
      await pageDriver.close();
    }
  }
};
class Keep extends ChallengeAstroport {
  constructor() {
    super(
      "Keep",
      `When the user docks a ship, the ship should still appear docked after page reload.
        <div class="tip">
            <label class="light">&#x1f4a1;</label>
            <label>Maybe your <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">CORS</a> config
            needs an update
            to answer <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#preflighted_requests">preflight requests</a></label>
        </div>
      `,
      "Update your server to keep the ship docked after page reload",
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

  async play(playerServerUrl, pageDriver) {
    pageDriver = pageDriver || new JsdomPage();
    const expected = {
      content: "A web page keeping the docked ship after reload",
    };

    try {
      await pageDriver.open([playerServerUrl, "astroport"]);

      const shipName = shipChooser.getShipName();
      expected.content = `#ship-1 content is '${shipName}'`;
      await pageDriver.enterValue("#ship", shipName);
      await pageDriver.clickElement("#dock");
      const dockContentBeforeReload = await this.waitForShipDockedAtGivenGate(
        1,
        shipName,
        pageDriver,
      );
      if (!new RegExp(shipName).test(dockContentBeforeReload)) {
        throw new Error(
          `#ship-1 content is '${dockContentBeforeReload}' before reload`,
        );
      }

      await pageDriver.open([playerServerUrl, "astroport"]);
      const dockContent = await this.waitForShipDockedAtGivenGate(
        1,
        shipName,
        pageDriver,
      );
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
    } finally {
      await pageDriver.close();
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
    return { status: "pending", message: "comming soon" };
  }
};
class Store {
  constructor() {
    this.store = {
      score: 0,
      running: false,
      challenges: [
        new HelloYose(),
        new Ping(),
        new PowerOfTwo(),
        new StringGuard(),
        new Astroport(),
        new Gates(),
        new Dock(),
        new Keep(),
      ],
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
    return run(document.getElementById("url").value, store, new JsdomPage());
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
  classList.push(isRunning ? "running" : "ready");

  element.className = classList.join(" ");
  element.innerHTML = isRunning ? "&#x25b6;" : "&#x25b6;";
}
const run = async (playerServerUrl, store, pageDriver) => {
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
        result = await challenge.play(playerServerUrl, pageDriver);
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
const buildUrl = (segments) => {
  return segments
    .map((s) => s.replace(/\/*$/, ""))
    .map((s) => s.replace(/^\/*/, ""))
    .join("/");
}