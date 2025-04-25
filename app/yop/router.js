const fail = (status, text) => (_, response) => {
  response.writeHead(status, {
    "content-type": "text/plain",
    "content-length": text.length,
  });
  response.end(text);
};

export class Router {
  constructor(routes) {
    this.routes = routes;
  }
  async handler(incoming, response) {
    let found = false;
    for (let i = 0; i < this.routes.length; i++) {
      let route = this.routes[i];
      let matching = await route.matches(incoming, this);
      if (matching) {
        found = true;
        try {
          await route.go(incoming, response, this);
        } catch (error) {
          fail(500, error.message)(incoming, response);
        }
        break;
      }
    }
    if (!found) {
      response.statusCode = 404;
      response.setHeader("content-type", "text/plain");
      response.write("NOT FOUND");
      response.end();
    }
  }
}
