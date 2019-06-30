# <a id=arc.events.publish href=#arc.events.publish>`arc.events.publish`</a>

## Publish events from any other function

Once deployed you can invoke `@event` handlers from any other function defined under the same `@app` namespace:

```javascript
var arc = require('@achitect/functions')

arc.events.publish({
  name: 'hit-counter',
  payload: {hits: 1},
}, console.log)
```

You can also invoke Lambdas across `@app` namespaces:

```javascript
var arc = require('@achitect/functions')

arc.events.publish({
  app: 'some-other-app',
  name: 'hit-counter',
  payload: {hits: 2},
}, console.log)
```

# <a id=arc.events.subscribe href=#arc.events.subscribe>`arc.events.subscribe`</a>

## Subscribe functions to events

An example of a `hit-counter` event handler:

```javascript
var arc = require('@architect/functions')

function count(payload, callback) {
  console.log(JSON.stringify(payload, null, 2))
  // maybe save count to the db here
  callback()
}

exports.handler = arc.events.subscribe(count)
```

