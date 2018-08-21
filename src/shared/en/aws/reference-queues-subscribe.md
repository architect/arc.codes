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
