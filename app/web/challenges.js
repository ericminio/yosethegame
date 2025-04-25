const challenges = [
  { name: "Hello Yose", open: true },
  { name: "Ping", open: true },
  { name: "Astroport", open: false },
];

const dashName = (name) => name.replace(" ", "-").toLowerCase();
const challengeStatusId = (name) => `challenge-${dashName(name)}-status`;

const challengeSectionHtml = ({ name, open }) => {
  return `
    <section>
      <h2>${name}</h2>
      <label id="${challengeStatusId(name)}">${open ? "open" : "closed"}</label>
    </section>`;
};

const showChallenges = async (document) => {
  document.getElementById("challenges").innerHTML = challenges.reduce(
    (acc, challenge) => acc + challengeSectionHtml(challenge),
    "",
  );
};
