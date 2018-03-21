# <a id=arc.events.subscribe href=#arc.events.subscribe>`arc.events.subscribe`</a>

## Subscribe functions to events

An example of a `hit-counter` event handler:

```javascript
var arc = require('@smallwins/arc-prototype')

function count(payload, callback) {
  console.log(JSON.stringify(payload, null, 2))
  // maybe save count to the db here
  callback()
}

exports.handler = arc.events.subscribe(count)
```
