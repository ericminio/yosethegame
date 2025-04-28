export const run = async (playerServerUrl, store) => {
  const challenges = store.get("challenges");
  const openChallenges = challenges.filter((challenge) => challenge.open);
  let score = 0;
  for (const challenge of openChallenges) {
    const result = await challenge.play(playerServerUrl);
    store.save(challenge.name, result);
    if (/passed/.test(result)) {
      score += 10;
    }
  }
  store.save("score", score);
};
