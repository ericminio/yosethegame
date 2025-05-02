export const dashName = (name) => name.replace(/ /g, "-").toLowerCase();
export const challengeSectionId = (name) =>
  `challenge-${dashName(name)}-section`;
export const challengeResultId = (name) => `challenge-${dashName(name)}-result`;
export const challengeExpectationsId = (name) =>
  `challenge-${dashName(name)}-expectations`;

export const challengeSectionHtml = ({ name, open, expectations }, store) => {
  return `
    <section class="challenge" id="${challengeSectionId(name)}">
      ${challengeSectionInnerHtml({ name, open, expectations }, store)}
    </section>`;
};

export const challengeSectionInnerHtml = (
  { name, open, expectations },
  store,
) => {
  const expectationsText = `<p class="expectations" id="${challengeExpectationsId(name)}">${open(store) ? expectations : ""}</p>`;
  return `
      <div class="challenge-header">
        <h2 class="challenge-name">${name}</h2>
      </div>
      ${expectationsText}
      <label id="${challengeResultId(name)}">${open(store) ? "" : "closed"}</label>
    `;
};
