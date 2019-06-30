# <a id=arc.queues.publish href=#arc.queues.publish>`arc.queues.publish`</a>

## Publish to a queue from any other function

Once deployed you can invoke `@queues` from any other function defined under the same `@app` namespace:

```javascript
let arc = require('@achitect/functions')

arc.queues.publish({
  name: 'publish-log',
  payload: {hits: 1},
}, console.log)
```

Queue events are executed in the order in which they are received. 
# <a id=arc.queues.subscribe href=#arc.queues.subscribe>`arc.queues.subscribe`</a>

## Subscribe a function to a queue

An example, `publish-log` queue handler:

```javascript
let arc = require('@architect/functions')

function log(payload, callback) {
  console.log(JSON.stringify(payload, null, 2))
  callback()
}

exports.handler = arc.queues.subscribe(log)
```
