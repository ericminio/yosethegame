const challenges = [{name:"Hello Yose",open:() => true,play:async (playerServerUrl) => {
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
  }},{name:"Ping",open:() => true,play:async (playerServerUrl) => {
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
  }},{name:"Astroport",open:(store) => {
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
  store.get("challenges").forEach(({ name, open }) => {
    store.register(name, (result) => {
      document.getElementById(challengeStatusId(name)).innerHTML =
        `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    });
    store.register("score", () => {
      if (!store.get(name)) {
        document.getElementById(challengeStatusId(name)).innerHTML = open(store)
          ? "open"
          : "closed";
      }
    });
  });
}
const dashName = (name) => name.replace(" ", "-").toLowerCase()
const challengeStatusId = (name) => `challenge-${dashName(name)}-status`
const challengeSectionHtml = ({ name, open }, store) => {
  return `
    <section>
      <hr/>
      <h2>${name}</h2>
      <label id="${challengeStatusId(name)}">${open(store) ? "open" : "closed"}</label>
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