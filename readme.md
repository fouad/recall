<p align="center">
  <a href="https://www.npmjs.com/package/recall"><img src="./docs/images/banner.png" alt="recall" /></a>
</p>

<p align="center">
  Simple library for tracing JavaScript<br/>
  with <a href="#what-is-google-trace-event">Google's Trace Event</a>.
</p>
<br/>

<p align="center">
  <a href="https://unpkg.com/recall/dist/recall.js">
    <img src="https://img.badgesize.io/https://unpkg.com/recall/dist/recall.js?compression=gzip&amp;label=recall&cache=4">
  </a>
  <a href="https://www.npmjs.com/package/recall">
    <img src="https://img.shields.io/npm/v/recall.svg?maxAge=3600&label=recall&colorB=007ec6&cache=4">
  </a>
</p>
<br/>

### Getting Started

#### Installation

Install with npm:

```shell
npm install --save recall
```

Or with yarn:

```shell
yarn add recall
```

#### Examples

```javascript
import { Tracer } from 'recall'

const trace = new Tracer()

trace.begin('app.render')
trace.begin('app.fetchData')

// Start fetching data, while the rest of the app tries to render
trace.end('app.render')
trace.end('app.fetchData')

// Time the re-render with data
trace.begin('app.render.withData')
trace.end('app.render.withData')

// Log as a table
console.table(trace.table())
```

### Usage

#### Generating a trace event

```javascript
import { Tracer, getEvent } from 'recall'

const trace = new Tracer()

// You can either use a string as your message
// with optional properties to add context
trace.begin('myapp.some-random.eventName', {
  variant: 'A'
})

// Or you can pass in an `analytics-event` compatible object
trace.end({
  name: 'myapp.some-random.eventName',
  props: {
    variant: 'A'
  }
})

// Or you can manually generate the event
trace.push(
  getEvent({
    type: 'end',
    name: 'myapp.some-random.eventName',
    props: {
      variant: 'A'
    }
  })
)
```

#### Logging the trace

```javascript
import { Tracer } from 'recall'

const trace = new Tracer({
  flush: async record => {
    await fetch('/api/traces', {
      data: JSON.stringify(record),
      method: 'post',
      headers: {
        'content-type': 'application/json'
      }
    })
  }
})

trace.begin('http.request.1')
trace.begin('http.request.2')

trace.end('http.request.1', {
  httpRequest: {
    statusCode: 200
  }
})

trace.end('http.request.2', {
  httpRequest: {
    statusCode: 500
  }
})

// When you're ready to send the trace
trace.complete()
// Or if the user navigates off the page
window.onbeforeload = () => trace.cancel()
```

### Frequently Asked Questions

#### What is Google Trace Event?

The Google Trace Event Format is a data representation that is processed by the Google Trace Viewer application. These are the same events that are used in Google Chrome and Node.js tracing. You can [read more here](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview).

### Contributing

All contributions are welcome! `recall` is [MIT-licensed](./license).
