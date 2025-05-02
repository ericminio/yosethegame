export const dashName = (name) => name.replace(/ /g, "-").toLowerCase();
export const challengeResultId = (name) => `challenge-${dashName(name)}-result`;
export const challengeExpectationsId = (name) =>
  `challenge-${dashName(name)}-expectations`;

export const challengeSectionHtml = ({ name, open, expectations }, store) => {
  const expectationsText = `<p class="expectations" id="${challengeExpectationsId(name)}">${open(store) ? expectations : ""}</p>`;
  return `
    <section class="challenge">
      <div class="challenge-header">
        <h2 class="challenge-name">${name}</h2>
      </div>
      ${expectationsText}
      <label id="${challengeResultId(name)}">${open(store) ? "" : "closed"}</label>
    </section>`;
};
