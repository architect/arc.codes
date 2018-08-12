# <a id=data.scanhref=#data.scan>`data.tablename.scan`</a>

## Paginate through all rows in a table

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
  let notes = await data.notes.scan({})
  res({
    html: `count: ${notes.Count}`
  })
}

exports.handler = arc.html.get(handler)
```

## Next: [`put`](/reference/data-put)
