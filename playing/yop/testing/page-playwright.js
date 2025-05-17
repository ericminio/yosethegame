import { firefox } from "playwright";

export class PlaywrightPage {
  constructor() {}

  async open(spec) {
    if (!!this.browser) {
      await this.browser.close();
    }
    this.browser = await firefox.launch({ headless: true });
    this.page = await this.browser.newPage();

    await this.page.goto(spec);
    return this;
  }

  async close() {
    if (!!this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async querySelector(selector) {
    return this.page.locator(`css=${selector}`).first();
  }

  async enterValue(selector, value) {
    const input = await this.querySelector(selector);
    await input.clear();
    await input.fill(value);
  }

  async clickElement(selector) {
    const selected = await this.querySelector(selector);
    await selected.click();
  }

  async textContent(selector) {
    const selected = await this.querySelector(selector);
    return await selected.textContent();
  }

  async title() {
    return await this.page.title();
  }

  async html() {
    return await this.page.content();
  }

  async section(text) {
    const selected = await this.find({ tag: "section", text });
    return selected.text.replace(/\s\s+/g, " ").trim();
  }

  async click(text) {
    const selected = await this.find({ tag: "button", text });
    await selected.element.click();
  }

  async enter(prompt, value) {
    const input = await this.input(prompt);
    await input.clear();
    await input.fill(value);
  }

  async input(prompt) {
    const label = await this.find({ tag: "label", text: prompt });
    const id = await label.element.getAttribute("for");
    if (!id || id.length === 0) {
      throw new Error(`label with text '${prompt}' is missing for attribute`);
    }
    const candidates = await this.page.locator(`css=#${id}`).all();
    if (candidates.length == 0) {
      throw new Error(`input with id '${id}' not found`);
    }
    return candidates[0];
  }

  async find({ tag, text }) {
    const elements = await this.page.locator(tag).all();
    const candidates = [];
    for (let i = 0; i < elements.length; i++) {
      const candidate = elements[i];
      const actualText = await candidate.textContent();
      const actualName = await candidate.getAttribute("name");
      const className = await candidate.getAttribute("class");
      if (
        actualText.indexOf(text) !== -1 ||
        (actualName && actualName.indexOf(text) !== -1)
      ) {
        candidates.push({ element: candidate, text: actualText, className });
      }
    }
    if (candidates.length === 0) {
      throw new Error(`${tag} with text or name '${text}' not found`);
    }
    const selected = candidates.sort(
      (a, b) => a.text.length - b.text.length,
    )[0];
    return selected;
  }
}
