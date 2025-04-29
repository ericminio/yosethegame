export const run = async (playerServerUrl, store) => {
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
};
