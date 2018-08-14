<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# <a id=arc.tables.update href=#arc.tables.update>`arc.tables.update`</a>

## Respond to data being updated in a DynamoDB table

```javascript
var arc = require('@architect/functions')

function handler(record, callback) {
  console.log(JSON.stringify(record, null, 2))
  callback()
}

exports.handler = arc.tables.update(handler)
```
