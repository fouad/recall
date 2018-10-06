import { getEvent, Event } from './event'

export interface TracerOptions {
  flush?: Function;
}

export interface Listeners {
  flush?: Function[];
}

export class Tracer {
  private events: Event[] = [];
  private listeners: Listeners = {};

  constructor(opts: TracerOptions = {}) {
    if (typeof opts !== "object") {
      throw new Error("Invalid options passed (must be an object)");
    }

    if (!this.listeners.flush) {
      this.listeners.flush = []
    }

    if (opts.flush) {
      this.listeners.flush.push(opts.flush)
    }
  }

  push (event: Event) : void {
    this.events.push(event)
  }

  flush () {}

  complete () {}

  cancel () {}
}