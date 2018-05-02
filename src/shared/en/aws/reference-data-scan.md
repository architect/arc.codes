# <a id=data.get href=#data.get>`data.tablename.get`</a>

## Get a row by key

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
  let note = await data.notes.get({noteID})
  res({
    html: note.body
  })
}

exports.handler = arc.html.get(handler)
```
