import { challengeSectionHtml } from "./rendering.js";

export const wireEvents = async (document, store) => {
  document.getElementById("run").addEventListener("click", () => {
    run(document.getElementById("url").value, store);
  });
  store.register("score", (score) => {
    document.getElementById("score").innerHTML = `${score}`;
  });
  store.register("challenges", (challenges) => {
    document.getElementById("challenges").innerHTML = challenges.reduce(
      (acc, challenge) => acc + challengeSectionHtml(challenge),
      "",
    );
  });
  store.get("challenges").forEach(({ name }) => {
    store.register(name, (result) => {
      document.getElementById(challengeStatusId(name)).innerHTML =
        `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    });
  });
};
