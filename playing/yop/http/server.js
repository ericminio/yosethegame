import http from "http";

const notImplemented = (_, response) => {
  response.writeHead(501, { "Content-Type": "text/plain" });
  response.end("NOT IMPLEMENTED");
};

export class Server {
  constructor(maybePort, maybeHandler) {
    if (Number.isInteger(maybePort)) {
      this.port = maybePort;
      this.handler = maybeHandler || notImplemented;
    } else {
      this.port = null;
      this.handler = maybePort || notImplemented;
    }
    this.sockets = [];
    this.internal = http.createServer();
    this.internal.on("connection", (socket) => {
      this.sockets.push(socket);
      socket.on("close", () => {
        this.sockets.splice(this.sockets.indexOf(socket), 1);
      });
    });
    this.use(this.handler);
    this.started = false;
    this.portFinder = new PortFinder(this.internal, this.port);
  }
  start(done) {
    if (this.started) {
      if (done) {
        done(this.port);
      } else {
        return Promise.resolve(this.port);
      }
    } else {
      if (done) {
        this.findPort(done);
      } else {
        return new Promise((resolve) => {
          this.findPort(resolve);
        });
      }
    }
  }
  stop(done) {
    this.sockets.forEach((socket) => socket.destroy());
    if (done) {
      this.close(done);
    } else {
      return new Promise((resolve) => {
        this.close(resolve);
      });
    }
  }
  use(handler) {
    this.internal.removeListener("request", this.handler);
    this.handler = handler;
    this.internal.on("request", this.handler);
  }
  close(then) {
    this.internal.close(() => {
      this.started = false;
      then();
    });
  }
  findPort(then) {
    this.portFinder.please((port) => {
      this.started = true;
      this.port = port;
      then(port);
    });
  }
}

class PortFinder {
  constructor(server, port) {
    this.port = port || 5001;
    this.server = server;
  }

  please(callback) {
    this.server.removeAllListeners("error");
    this.server.listeners("listening").forEach((listener) => {
      if (!/setupConnectionsTracking/.test(listener.toString())) {
        this.server.removeListener("listening", listener);
      }
    });
    this.server.on("listening", () => {
      if (!this.found) {
        this.found = true;
        callback(this.port);
      }
    });
    this.server.on("error", (error) => {
      if (!this.found) {
        this.port += 1;
        this.server.listen(this.port);
      }
    });
    this.found = false;
    this.server.listen(this.port);
  }
}
