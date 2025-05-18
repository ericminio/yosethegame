import jsdom from "jsdom";
import { TextEncoder, TextDecoder } from "util";
import { buildUrl } from "../../../app/domain/build-url.js";

export class JsdomPage {
  constructor() {
    this.error = undefined;
  }

  async open(segments) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("jsdomError", (error) => {
      this.error = `JSDOM Error -- ${error.message}`;
    });
    const options = {
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole,
      beforeParse: (window) => {
        window.fetch = async (url, options) => {
          const target =
            url.indexOf("http") === 0 ? url : buildUrl([segments[0], url]);
          return await fetch(`${target}`, options);
        };
        window.TextEncoder = window.TextEncoder || TextEncoder;
        window.TextDecoder = window.TextDecoder || TextDecoder;
      },
    };
    return new Promise(async (resolve, reject) => {
      try {
        const dom = await jsdom.JSDOM.fromURL(buildUrl(segments), options);
        this.window = dom.window;
        this.document = dom.window.document;
        if (this.document.readyState === "loading") {
          this.document.addEventListener("DOMContentLoaded", () => {
            if (this.error) {
              reject(new Error(this.error));
            }
            resolve(this);
          });
        } else {
          if (this.error) {
            reject(new Error(this.error));
          }
          resolve(this);
        }
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async close() {
    return new Promise((resolve) => {
      this.window.close();
      resolve();
    });
  }

  async querySelector(selector) {
    return this.document.querySelector(selector);
  }

  async enterValue(selector, value) {
    const input = await this.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new this.window.Event("input"));
  }

  async clickElement(selector) {
    const selected = await this.querySelector(selector);
    await selected.click();
  }

  async textContent(selector) {
    const selected = await this.querySelector(selector);
    return selected.textContent;
  }

  executeScript(code) {
    code(this.window, this.document);
  }

  location() {
    return this.window.location.href;
  }

  title() {
    return this.document.title;
  }

  html() {
    return this.document.body.innerHTML;
  }

  section(text) {
    return this.find({ tag: "section", text })
      .textContent.replace(/\s\s+/g, " ")
      .trim();
  }

  color(text) {
    const label = this.find({ tag: "label", text });
    const style = this.document.defaultView.getComputedStyle(label, null);

    return style.color;
  }

  activeElementId() {
    return this.document.activeElement.id;
  }

  inputValue(prompt) {
    return this.input(prompt).value;
  }

  inputId(prompt) {
    return this.input(prompt).id;
  }

  element(selector) {
    return this.document.querySelector(selector);
  }

  click(text) {
    this.find({ tag: "button", text }).click();
  }

  enter(prompt, value) {
    let field = this.input(prompt);
    field.value = value;
    field.dispatchEvent(new this.window.Event("input"));
  }

  input(prompt) {
    let label = this.find({ tag: "label", text: prompt });
    if (label.htmlFor.length === 0) {
      throw new Error(`label with text '${prompt}' is missing for attribute`);
    }
    let candidate = this.element(`#${label.htmlFor}`);
    if (candidate === null) {
      throw new Error(`input with id '${label.htmlFor}' not found`);
    }
    return candidate;
  }

  find(options) {
    if (!this.document) {
      throw new Error("page.document must be defined");
    }
    const document = options.in || this.document;
    let candidates = Array.from(document.querySelectorAll(options.tag)).filter(
      (element) =>
        element.textContent.indexOf(options.text) !== -1 ||
        element.getAttribute("name") === options.text,
    );
    if (candidates.length === 0) {
      throw new Error(
        `${options.tag} with text or name '${options.text}' not found`,
      );
    }
    return candidates.sort(
      (a, b) => a.textContent.length - b.textContent.length,
    )[0];
  }
}
