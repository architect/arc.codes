<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# <a id=arc.tables.destroy href=#arc.tables.destroy>`arc.tables.destroy`</a>

## Respond to data being removed from a DynamoDB table

```javascript
var arc = require('@architect/functions')

function handler(record, callback) {
  console.log(JSON.stringify(record, null, 2))
  callback()
}

exports.handler = arc.tables.destroy(handler)
```
