import { serveContent } from "./serve-content.js";

export class RouteAssetEqual {
  constructor(url, contentProvider) {
    this.url = url;
    this.contentProvider = contentProvider;
  }

  matches(incoming) {
    return incoming.url === this.url;
  }

  go(request, response) {
    serveContent(this.contentProvider)(request, response);
  }
}
