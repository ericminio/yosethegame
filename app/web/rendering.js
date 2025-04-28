export const dashName = (name) => name.replace(" ", "-").toLowerCase();
export const challengeStatusId = (name) => `challenge-${dashName(name)}-status`;

export const challengeSectionHtml = ({ name, open }) => {
  return `
    <section>
      <h2>${name}</h2>
      <label id="${challengeStatusId(name)}">${open ? "open" : "closed"}</label>
    </section>`;
};

export const showChallenges = async (document, store) => {
  const challenges = store.get("challenges");
  document.getElementById("challenges").innerHTML = challenges.reduce(
    (acc, challenge) => acc + challengeSectionHtml(challenge),
    "",
  );
};
