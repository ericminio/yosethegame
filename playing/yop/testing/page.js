import { Page as PageJSDOM } from "./page-jsdom.js";

import { Page as PagePlaywright } from "./page-playwright.js";

export const Page =
  process.env.YOP_WEBTEST === "playwright"
    ? PagePlaywright
    : process.env.YOP_WEBTEST === "jsdom"
      ? PageJSDOM
      : PageJSDOM;
