import { HelloYose } from "./1-hello-yose.js";
import { Ping } from "./2-ping.js";
import { Astroport } from "./3-astroport.js";
import { PowerOfTwo } from "./4-power-of-two.js";
import { StringGuard } from "./5-string-guard.js";

export class Store {
  constructor() {
    this.store = {
      score: 0,
      challenges: [
        new HelloYose(),
        new Ping(),
        new PowerOfTwo(),
        new StringGuard(),
        new Astroport(),
      ],
    };
    this.listeners = {};
  }

  register(key, listener) {
    const listeners = this.listeners[key] ?? [];
    listeners.push(listener);
    this.listeners[key] = listeners;
    if (this.get(key) !== undefined) {
      listener(this.get(key));
    }
  }

  save(key, value) {
    this.store[key] = value;
    const listeners = this.listeners[key] ?? [];
    for (const listener of listeners) {
      listener(value);
    }
  }

  get(key) {
    return this.store[key];
  }
}
