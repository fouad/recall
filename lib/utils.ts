const performance = (<any>global).performance || {}
const performanceNow =
  performance.now ||
  performance.mozNow ||
  performance.msNow ||
  performance.oNow ||
  performance.webkitNow ||
  function() {
    return new Date().getTime()
  }

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
export function hrtime(previousTimestamp?: Array<number>) {
  if (typeof process !== 'undefined') {
    return process.hrtime()
  }

  let clocktime = performanceNow.call(performance) * 1e-3
  let seconds = <number>Math.floor(clocktime)
  let nanoseconds = <number>Math.floor((clocktime % 1) * 1e9)

  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0]
    nanoseconds = nanoseconds - previousTimestamp[1]
    if (nanoseconds < 0) {
      seconds--
      nanoseconds += 1e9
    }
  }

  return [seconds, nanoseconds]
}

export default {
  hrtime
}
