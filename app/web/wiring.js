import {
  challengeSectionHtml,
  challengeSectionId,
  renderChallenge,
  renderRunTrigger,
} from "./rendering.js";

export const wireEvents = async (document, store) => {
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
};
