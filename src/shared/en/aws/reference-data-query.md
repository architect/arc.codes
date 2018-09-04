# <a id=data.get href=#data.get>`data.tablename.query`</a>

## Query a table for a collection of rows

Example:

```.arc
@app
testapp

@html
get /

@tables
notes
  noteID *String

```

And then in a Lambda function:

```javascript
// src/html/get-index/index.js
let arc = require('@architect/functions')
let data = require('@architect/data')

async function handler(req, res) {
  let noteID = req.query.noteID
  let result = await data.notes.query({
    KeyConditionExpression: 'noteID = :noteID',
    ExpressionAttributeValues: {
      ':noteID': noteID
    }
  })
  res({
    html: result.Items.join('<hr>')
  })
}

exports.handler = arc.html.get(handler)
```

## Next: [`scan`](/reference/data-scan)
