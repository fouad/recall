import { getEvent, Event, EventInput } from './event'

export interface TracerOptions {
  noChrome?: boolean
  flush?: Function
}

export interface Listeners {
  flush?: Function[]
}

export interface Trace {
  traceEvents: Event[]
  table?: Function
}

export class Tracer {
  public counter: number = 0
  private events: Event[] = []
  private listeners: Listeners = {}

  constructor(opts: TracerOptions = {}) {
    if (typeof opts !== 'object') {
      throw new Error('Invalid options passed (must be an object)')
    }

    if (!this.listeners.flush) {
      this.listeners.flush = []
    }

    if (opts.flush) {
      this.listeners.flush.push(opts.flush)
    }

    if (!opts.noChrome) {
      this.setupChrome()
    }
  }

  push(event: Event): void {
    if (!event.id) {
      event.id = ++this.counter
    }

    if (!event.args) {
      event.args = {
        sessionId: '-1'
      }
    } else if (!event.args.sessionId) {
      event.args.sessionId = '-1'
    }

    this.events.push(event)
  }

  flush() {
    const trace = <Trace>{
      traceEvents: this.events.splice(0)
    }

    trace.table = tableFactory(trace)

    if (this.listeners && this.listeners.flush) {
      this.listeners.flush.forEach(fn => fn(trace))
    }

    return trace
  }

  begin(input: EventInput = {}) {
    if (typeof input === 'string') {
      input = <EventInput>{
        name: input
      }
    }

    input.type = 'S'

    const event = getEvent(input)

    this.push(event)

    return event.id
  }

  end(input: EventInput = {}) {
    if (typeof input === 'string') {
      input = <EventInput>{
        name: input
      }
    }

    input.type = 'F'

    const event = getEvent(input)

    this.push(event)

    return event.id
  }

  instant(input: EventInput = {}) {
    if (typeof input === 'string') {
      input = <EventInput>{
        name: input
      }
    }

    input.type = 'I'

    this.push(getEvent(input))
  }

  complete(input: EventInput = {}) {
    input.type = 'X'

    if (!input.props) {
      input.props = { success: true }
    }

    this.push(getEvent(input))

    return this.flush()
  }

  cancel(input: EventInput = {}) {
    input.props = { success: false }

    return this.complete(input)
  }

  // Setup trace to work in Chrome DevTools
  setupChrome() {
    this.instant({
      name: 'TracingStartedInPage',
      tags: ['disabled-by-default-devtools.timeline'],
      props: {
        data: {
          sessionId: '-1',
          page: '0xfff',
          frames: [
            {
              frame: '0xfff',
              url: 'recall',
              name: 'Recall'
            }
          ]
        }
      }
    })

    this.instant({
      name: 'TracingStartedInBrowser',
      tags: ['disabled-by-default-devtools.timeline'],
      props: {
        data: {
          sessionId: '-1'
        }
      }
    })
  }
}

function tableFactory(trace: Trace) {
  return () => trace.traceEvents
}

export default {
  Tracer
}
