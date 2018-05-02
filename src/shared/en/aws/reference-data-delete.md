# <a id=data.delete href=#data.delete>`data.tablename.delete`</a>

## Delete a row by key

Example:

```.arc
@app
testapp

@html
get /
post /notes/:noteID/del

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
  let note = await data.notes.delete({noteID})
  res({
    html: note.body
  })
}

exports.handler = arc.html.get(handler)
```
