const test = require('ava')
const { Tracer } = require('../dist')

test(t => {
  const trace = new Tracer()

  trace.begin({ name: 'browser.render' })

  trace.end({ name: 'browser.render' })

  console.log(trace.toString())
})
