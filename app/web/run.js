const run = async (document) => {
  challenges
    .filter((c) => c.open)
    .forEach(({ name }) => {
      const dashName = name.replace(" ", "-").toLowerCase();
      const id = `challenge-${dashName}-status`;

      const status = dashName == "hello-yose" ? "passed" : "failed";

      document.getElementById(id).innerHTML = status;
    });
};
