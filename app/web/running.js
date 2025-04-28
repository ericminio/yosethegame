export const run = async (document) => {
  const playerServerUrl = document.getElementById("url").value;
  challenges
    .filter((challenge) => challenge.open)
    .forEach(async ({ name, play }) => {
      const result = await play(playerServerUrl);
      document.getElementById(challengeStatusId(name)).innerHTML = result;
    });
  document.getElementById("score").innerHTML = 10;
};
