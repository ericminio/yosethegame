import jsdom from "jsdom";
export class Challenge {
  constructor(name, expectations) {
    this.name = name;
    this.expectations = expectations;
  }

  buildUrl(segments) {
    return segments.map((s) => s.replace(/\/*$/, "")).join("/");
  }

  passed(store) {
    const result = store.get(this.name);
    return result && result.status === "passed" ? true : false;
  }

  async openPage(playerServerUrl) {
    const dom = await jsdom.JSDOM.fromURL(
      this.baseUrl(playerServerUrl),
      this.jsdomOptions(playerServerUrl),
    );
    return dom.window.document;
  }

  jsdomOptions(playerServerUrl) {
    return {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse: (window) => {
        window.fetch = async (url, options) => {
          return await fetch(`${this.baseUrl(playerServerUrl)}${url}`, options);
        };
      },
    };
  }
}
