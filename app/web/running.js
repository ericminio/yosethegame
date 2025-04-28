import { challengeStatusId } from "./rendering.js";

export const run = async (document, challenges, store) => {
  const playerServerUrl = document.getElementById("url").value;
  const openChallenges = challenges.filter((challenge) => challenge.open);
  let score = 0;
  for (const challenge of openChallenges) {
    const { name, play } = challenge;
    const result = await play(playerServerUrl);
    document.getElementById(challengeStatusId(name)).innerHTML = result;
    if (/passed/.test(result)) {
      score += 10;
    }
  }
  store.save("score", score);
};
