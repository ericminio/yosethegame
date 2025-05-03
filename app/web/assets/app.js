const powerOfTwoChooser = {getNumber:() => {
    const numbers = [8, 16, 32, 64, 128, 1024, 2048];
    const index = Math.floor(Math.random() * numbers.length);
    return numbers[index];
  }};
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
const challenges = [{name:"Hello Yose",expectations:"Update your server for <code>/</code> to answer with a page containing &quot;Hello Yose&quot;",open:() => true,hidden:() => false,play:async (playerServerUrl) => {
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
  }},{name:"Ping",expectations:"Update your server for <code>/ping</code> to answer with json { &quot;pong&quot;: &quot;hi there!&quot; }",open:() => true,hidden:() => false,play:async (playerServerUrl) => {
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
  }},{name:"Power of two",expectations:"Update your server for <code>/primeFactors?number=4</code> to answer with prime factors decomposition",open:(store) => {
    const pingResult = store.get("Ping");
    return pingResult && pingResult.status === "passed" ? true : false;
  },hidden:() => false,play:async (playerServerUrl) => {
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
  }},{name:"String guard",expectations:"Update your server for <code>/primeFactors</code> to answer with &quot;not a number&quot; when the input is not a number",open:(store) => {
    const powerOfTwoResult = store.get("Power of two");
    return powerOfTwoResult && powerOfTwoResult.status === "passed"
      ? true
      : false;
  },hidden:(store) => {
    const powerOfTwoResult = store.get("Power of two");
    return powerOfTwoResult && powerOfTwoResult.status === "passed"
      ? false
      : true;
  },play:async (playerServerUrl) => {
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
  }},{name:"Astroport",expectations:"Update your server for ... (coming soon)",open:(store) => {
    const helloYoseResult = store.get("Hello Yose");
    const pingResult = store.get("Ping");
    if (helloYoseResult && helloYoseResult.status === "passed") {
      return pingResult && pingResult.status === "passed";
    }
    return false;
  },hidden:() => false,play:async () => ({ status: "failed" })}];
class Store {
  constructor() {
    this.store = {
      score: 0,
      challenges: challenges,
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
    <section class="challenge" id="${challengeSectionId(challenge.name)}">
      ${challengeSectionInnerHtml(challenge, store)}
    </section>`;
}
const challengeSectionInnerHtml = (
  { name, open, hidden, expectations },
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
  if (hidden(store)) {
    html = `<div class="hidden">${html}</div><div class="teaser">...</div>`;
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