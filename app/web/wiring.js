import { challengeSectionHtml, challengeStatusId } from "./rendering.js";

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
};
