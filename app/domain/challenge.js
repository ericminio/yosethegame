import jsdom from "jsdom";
export class Challenge {
  constructor(name, expectations) {
    this.name = name;
    this.expectations = expectations;
    this.playerDocument = undefined;
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
    this.playerDocument = dom.window.document;
    return this.playerDocument;
  }

  jsdomOptions(playerServerUrl) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("jsdomError", (error) => {
      this.playerDocument.error = `JSDOM Error -- ${error.message}`;
    });
    return {
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole,
      beforeParse: (window) => {
        window.fetch = async (url, options) => {
          return await fetch(`${this.baseUrl(playerServerUrl)}${url}`, options);
        };
      },
    };
  }
}
