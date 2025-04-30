import { serveContent } from "./serve-content.js";

export class RouteDefault {
  constructor(contentProvider) {
    this.contentProvider = contentProvider;
  }

  matches() {
    return true;
  }

  go(request, response) {
    serveContent(this.contentProvider)(request, response);
  }
}
