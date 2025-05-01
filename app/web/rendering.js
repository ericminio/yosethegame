export const dashName = (name) => name.replace(" ", "-").toLowerCase();
export const challengeStatusId = (name) => `challenge-${dashName(name)}-status`;
export const challengeExpectationsId = (name) =>
  `challenge-${dashName(name)}-expectations`;

export const challengeSectionHtml = ({ name, open, expectations }, store) => {
  const expectationsText = `<p id="${challengeExpectationsId(name)}">${open(store) ? expectations : ""}</p>`;
  return `
    <section class="challenge">
      <h2 class="challenge-name">${name}</h2>
      ${expectationsText}
      <label id="${challengeStatusId(name)}">${open(store) ? "" : "closed"}</label>
    </section>`;
};
