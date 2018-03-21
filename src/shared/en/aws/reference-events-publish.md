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

