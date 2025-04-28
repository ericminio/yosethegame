export const wireEvents = async (document, store) => {
  document.getElementById("run").addEventListener("click", () => {
    run(document, challenges, store);
  });
  store.register("score", (score) => {
    document.getElementById("score").innerHTML = `${score}`;
  });
  store.get("challenges").forEach(({ name }) => {
    store.register(name, (result) => {
      document.getElementById(challengeStatusId(name)).innerHTML = result;
    });
  });
};
