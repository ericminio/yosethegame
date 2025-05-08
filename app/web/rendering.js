export const dashName = (name) => name.replace(/ /g, "-").toLowerCase();
export const challengeSectionId = (name) =>
  `challenge-${dashName(name)}-section`;
export const challengeResultId = (name) => `challenge-${dashName(name)}-result`;
export const challengeExpectationsId = (name) =>
  `challenge-${dashName(name)}-expectations`;

export const renderChallenge = (challenge, store, challengeSection) => {
  challengeSection.outerHTML = challengeSectionHtml(challenge, store);
};

export const challengeSectionHtml = (challenge, store) => {
  return `
    <section class="challenge${challenge.hidden(store) && !challenge.teasing(store) ? " hidden" : ""}" id="${challengeSectionId(challenge.name)}">
      ${challengeSectionInnerHtml(challenge, store)}
    </section>`;
};

export const challengeSectionInnerHtml = (
  { name, open, teasing, expectations },
  store,
) => {
  const result = store.get(name);
  const expectationsText =
    result && result.status === "passed"
      ? ""
      : `<p class="expectations" id="${challengeExpectationsId(name)}">${open(store) ? expectations : ""}</p>`;
  const resultStatus = result
    ? result.status === "passed"
      ? `<label class="challenge-status-passed">&#10004;</label>`
      : `<label class="challenge-status-failed">&#10007;</label>`
    : "";
  const resultText = result
    ? result.status === "failed"
      ? `<pre>${JSON.stringify(result, null, 2)}</pre>`
      : ""
    : open(store)
      ? ""
      : "closed";
  let html = `
      <div class="challenge-header">
        <h2 class="challenge-name">${name}</h2>
        ${resultStatus}
      </div>
      ${expectationsText}
      <label id="${challengeResultId(name)}">${resultText}</label>
    `;
  if (teasing(store)) {
    html = `
        <div class="hidden">
            ${html}
        </div>
        <div class="teaser">...</div>
    `;
  }
  return html;
};

export const renderRunTrigger = (element, isRunning) => {
  const classList = ["run-trigger"];
  if (isRunning) {
    classList.push("spinning");
  }
  element.className = classList.join(" ");
};
