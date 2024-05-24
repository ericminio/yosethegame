import {
    RouteDefault,
    RouteYop,
    Router,
    Server,
    html,
} from "../../yop/dist/index.js";

const router = new Router([
    new RouteYop(),
    new RouteDefault(html(new URL("./index.html", import.meta.url))),
]);

export const server = new Server(router.handler.bind(router));
