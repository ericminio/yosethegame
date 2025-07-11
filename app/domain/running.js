export const run = async (playerServerUrl, store, pageDriver) => {
  store.save("running", true);
  let score = 0;
  const challenges = store.get("challenges");
  for (const challenge of challenges) {
    store.save(challenge.name, null);
  }
  store.save("score", score);
  const challengesCopy = [...challenges];

  while (challengesCopy.some((challenge) => challenge.open(store))) {
    const openChallenges = challengesCopy.reduce((acc, challenge) => {
      if (challenge.open(store)) {
        acc.push(challenge);
      }
      return acc;
    }, []);
    for (const challenge of openChallenges) {
      let result;
      try {
        result = await challenge.play(playerServerUrl, pageDriver);
      } catch (error) {
        result = {
          status: "failed",
          message: error.message,
        };
      }
      store.save(challenge.name, result);
      if (/passed/.test(result.status)) {
        score += 10;
        store.save("score", score);
      }
    }

    for (const challenge of openChallenges) {
      challengesCopy.splice(
        challengesCopy.findIndex((c) => c.name === challenge.name),
        1,
      );
    }
  }

  store.save("running", false);
};
