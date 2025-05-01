export const dashName = (name) => name.replace(" ", "-").toLowerCase();
export const challengeStatusId = (name) => `challenge-${dashName(name)}-status`;

export const challengeSectionHtml = ({ name, open, expectations }, store) => {
  const expectationsText = open(store) ? `<p>${expectations}</p>` : "";
  return `
    <section>
      <hr/>
      <h2>${name}</h2>
      ${expectationsText}
      <label id="${challengeStatusId(name)}">${open(store) ? "open" : "closed"}</label>
    </section>`;
};
