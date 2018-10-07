import { hrtime } from './utils'

const isNode = typeof process !== 'undefined'
// Unicode computer = `5535756507` in decimal
const DEFAULT_PID = isNode ? process.pid : 5535756507

export interface EventInput {
  id?: number
  ts?: number
  pid?: number
  tid?: number
  type?: string
  name?: string
  tags?: string[]
  props?: any
}

export interface Event {
  pid: number
  tid: number
  ts: number
  args?: any
  id?: number
  ph?: string
  cat?: string
  name?: string
}

export function getEvent(input: EventInput): Event {
  const time = hrtime()
  const ts = input.ts || time[0] * 1000000 + Math.round(time[1] / 1000)

  const output = <Event>{
    ts,
    ph: input.type,
    pid: input.pid || DEFAULT_PID,
    tid: input.tid || DEFAULT_PID
  }

  if (input.id) {
    output.id = input.id
  }

  if (input.name) {
    output.name = input.name
  }

  if (input.props) {
    output.args = input.props
  }

  if (input.tags && input.tags.length > 0) {
    output.cat = input.tags.join(', ')
  } else {
    output.cat = 'blink.user_timing'
  }

  return output
}
