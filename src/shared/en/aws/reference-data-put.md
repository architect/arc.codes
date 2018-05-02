# <a id=data.get href=#data.get>`data.tablename.put`</a>

## Write a row

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

Add `hashids` library to generate unique keys:

```bash
cd src/html/post-notes
npm i hashids
```

Implement a function to save a note:

```javascript
// src/html/post-notes/index.js
let arc = require('@architect/functions')
let data = require('@architect/data')
let Hashids = require('hashids')

function getID() {
  let hashids = new Hashids
  let epoch = Date.now() - 1525066366572
  return hashids.encode(epoch)
}

async function handler(req, res) {
  let noteID = getID()
  let body = req.body.body
  let title = req.body.title
  let ts = new Date(Date.now()).toISOString()
  let note = await data.notes.put({noteID, body, title, ts})
  res({
    location
  })
}

exports.handler = arc.html.get(handler)
```

The function defines `getID` helper. Internally the function uses a custom UNIX epoch by hardcoding an app specific start value. The value returned is a very short and unique key that is also url safe.
