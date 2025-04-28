import { challengeStatusId } from "./rendering.js";

export const run = async (document, challenges) => {
  const playerServerUrl = document.getElementById("url").value;
  const openChallenges = challenges.filter((challenge) => challenge.open);
  for (const challenge of openChallenges) {
    const { name, play } = challenge;
    const result = await play(playerServerUrl);
    document.getElementById(challengeStatusId(name)).innerHTML = result;
  }
  document.getElementById("score").innerHTML = "10";
};
