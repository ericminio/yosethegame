const powerOfTwoChooser = {getNumber:() => {
    const numbers = [8, 16, 32, 64, 128, 1024, 2048];
    const index = Math.floor(Math.random() * numbers.length);
    return numbers[index];
  }};
const challenges = [{name:"Hello Yose",expectations:"Update your server for / to answer with a page containing &quot;Hello Yose&quot;",open:() => true,play:async (playerServerUrl) => {
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
  }},{name:"Ping",expectations:"Update your server for /ping to answer with json { &quot;pong&quot;: &quot;hi there!&quot; }",open:() => true,play:async (playerServerUrl) => {
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
  }},{name:"Power of two",expectations:"Update your server for /primeFactors?number=4 to answer with json { &quot;number&quot;: 4, &quot;decomposition&quot;: [2, 2] }",open:(store) => {
    const pingResult = store.get("Ping");
    return pingResult && pingResult.status === "passed" ? true : false;
  },play:async (playerServerUrl) => {
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
  }},{name:"Astroport",expectations:"Update your server for ... (coming soon)",open:(store) => {
    const helloYoseResult = store.get("Hello Yose");
    const pingResult = store.get("Ping");
    if (helloYoseResult && helloYoseResult.status === "passed") {
      return pingResult && pingResult.status === "passed";
    }
    return false;
  },play:async () => ({ status: "failed" })}];
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
  store.get("challenges").forEach(({ name, expectations, open }) => {
    store.register(name, (result) => {
      document.getElementById(challengeResultId(name)).innerHTML =
        `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    });
    store.register("score", () => {
      if (!store.get(name)) {
        if (open(store)) {
          document.getElementById(challengeExpectationsId(name)).innerHTML =
            expectations;
          document.getElementById(challengeResultId(name)).innerHTML = "";
        } else {
          document.getElementById(challengeResultId(name)).innerHTML = "closed";
        }
      }
    });
  });
}
const dashName = (name) => name.replace(/ /g, "-").toLowerCase()
const challengeResultId = (name) => `challenge-${dashName(name)}-result`
const challengeExpectationsId = (name) =>
  `challenge-${dashName(name)}-expectations`
const challengeSectionHtml = ({ name, open, expectations }, store) => {
  const expectationsText = `<p class="expectations" id="${challengeExpectationsId(name)}">${open(store) ? expectations : ""}</p>`;
  return `
    <section class="challenge">
      <div class="challenge-header">
        <h2 class="challenge-name">${name}</h2>
      </div>
      ${expectationsText}
      <label id="${challengeResultId(name)}">${open(store) ? "" : "closed"}</label>
    </section>`;
}
const run = async (playerServerUrl, store) => {
  const challenges = store.get("challenges");
  const openChallenges = challenges.filter((challenge) =>
    challenge.open(store),
  );
  let score = 0;
  for (const challenge of openChallenges) {
    const result = await challenge.play(playerServerUrl);
    store.save(challenge.name, result);
    if (/passed/.test(result.status)) {
      score += 10;
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