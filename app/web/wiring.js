import {
  challengeExpectationsId,
  challengeSectionHtml,
  challengeResultId,
  challengeSectionId,
  challengeSectionInnerHtml,
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
    store.register("score", () => {
      const html = challengeSectionInnerHtml(challenge, store);
      document.getElementById(challengeSectionId(challenge.name)).innerHTML =
        html;
    });
  });
};
