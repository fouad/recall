const fs = require('fs')
const test = require('ava')
const { Tracer } = require('../dist/recall')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test(t => {
  const trace = new Tracer()

  trace.begin({ name: 'browser.render' })
  trace.end({ name: 'browser.render' })

  if (trace.flush().traceEvents.length === 4) {
    t.pass()
  } else {
    t.fail()
  }
})

test(async t => {
  const trace = new Tracer()

  const t1 = trace.begin({ name: 'app.render' })

  await sleep(250)

  const t2 = trace.begin({ name: 'app.fetchData' })

  await sleep(250)

  trace.end({ id: t1, name: 'app.render' })

  await sleep(250)

  trace.end({ id: t2, name: 'app.fetchData' })

  const t3 = trace.begin({ name: 'app.render' })

  await sleep(50)

  trace.end({ id: t3, name: 'app.render' })

  fs.writeFileSync(
    './tmp/trace-3902f2093f.json',
    JSON.stringify(trace.flush().traceEvents, null, 2)
  )

  t.pass()
})
