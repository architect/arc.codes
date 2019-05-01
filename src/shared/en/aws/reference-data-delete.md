# <a id=data.delete href=#data.delete>`data.tablename.delete`</a>

## Delete a row by key

Example:

```arc
@app
notes

@http
get /
post /notes
post /notes/:noteID/del

@tables
notes
  noteID *String
```

And then in a Lambda function:

```javascript
// src/http/get-index/index.js
let arc = require('@architect/functions')
let data = require('@architect/data')
let url = arc.http.helpers.url

async function handler(req, res) {
  let notes = await data.notes.scan({})
  let noteID = notes.Count > 0? notes.Items[0] : false
  if (noteID) {
    let action = url(`/notes/${noteID}/del`)
    let html = `
      Delete a Note
      <form action=${action} method=post>
        <input type=text name=noteID>
        <button>delete</button>
      </form>
    `
  }
  else {
    let action = url(`/notes/${noteID}`)
    let html = `
      Create a Note
      <form action=${action} method=post>
        <input type=text name=noteID value=${Date.now()}>
        <button>delete</button>
      </form>
    `
  }
  res({html})
}

exports.handler = arc.http(handler)
```

The POST to `/notes` creates a row and redirects home:

```javascript
// src/http/post-notes/index.js
let arc = require('@architect/functions')
let data = require('@architect/data')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  let noteID = req.body.noteID
  let msg = 'hello world!'
  let note = await data.notes.put({noteID, msg})
  return {
    status: 302,
    location: url('/')
  }
}
```

The POST to `/notes/:noteID/del` deletes the row and redirects home:

```javascript
// src/http/post-notes-000noteID-del/index.js
let arc = require('@architect/functions')
let data = require('@architect/data')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  let noteID = req.body.noteID
  let note = await data.notes.delete({noteID})
  return {
    status: 302,
    location: url('/')
  }
}
```
