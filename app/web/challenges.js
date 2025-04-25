const challenges = [
  { name: "Hello Yose", open: true },
  { name: "Ping", open: true },
  { name: "Astroport", open: false },
];

const showChallenges = async (document) => {
  const html = challenges.reduce((acc, challenge) => {
    const dashName = challenge.name.replace(" ", "-").toLowerCase();
    const status = challenge.open ? "open" : "closed";
    const section = `
          <section>
            <h2>${challenge.name}</h2>
            <label id="challenge-${dashName}-status">${status}</label>
          </section>`;
    return acc + section;
  }, "");
  document.getElementById("challenges").innerHTML = html;
};
