import { JsdomPage } from "./page-jsdom.js";

import { PlaywrightPage } from "./page-playwright.js";

export const Page =
  process.env.YOP_WEBTEST === "playwright"
    ? PlaywrightPage
    : process.env.YOP_WEBTEST === "jsdom"
      ? JsdomPage
      : JsdomPage;

export const pageDriverChooser = (env) => {
  if (env.YOP_WEBTEST === "playwright") {
    return new PlaywrightPage();
  }
  return new JsdomPage();
};
