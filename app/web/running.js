export const run = async (document) => {
  challenges
    .filter((c) => c.open)
    .forEach(({ name, verify }) => {
      const status = verify();

      document.getElementById(challengeStatusId(name)).innerHTML = status;
    });
};
