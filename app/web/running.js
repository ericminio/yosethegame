export const run = async (document) => {
  challenges
    .filter((c) => c.open)
    .forEach(({ name }) => {
      const status = dashName(name) == "hello-yose" ? "passed" : "failed";

      document.getElementById(challengeStatusId(name)).innerHTML = status;
    });
};
