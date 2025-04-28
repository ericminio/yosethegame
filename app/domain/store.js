import { challenges } from "./challenges.js";

export class Store {
  constructor() {
    this.store = {
      score: 0,
      challenges: challenges,
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
