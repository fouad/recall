import { hrtime } from './utils'

export interface Event {
  ts: number;
  pid: number;
  tid: number;
  /** event phase */
  ph?: string;
  [otherData: string]: any;
}

export function getEvent(): Event {
  const time = hrtime() // [seconds, nanoseconds]
  const ts = time[0] * 1000000 + Math.round(time[1] / 1000) // microseconds

  return {
    ts,
    pid: process.pid,
    tid: process.pid // no meaningful tid for node.js
  }
}