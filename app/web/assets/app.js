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
class Astroport extends Challenge {
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
      const dom = await jsdom.JSDOM.fromURL(`${playerServerUrl}/astroport`, {
        runScripts: "dangerously",
        resources: "usable",
      });
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