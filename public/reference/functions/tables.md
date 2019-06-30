# <a id=data href=#data>`@architect/data`</a>

## Interact with DynamoDB tables defined in `.arc`

Example, given the following `.arc` file:

```.arc
@app
testapp

@http
get /

@tables
notes
  personID *String
  noteID **String

ppl
  personID *String
```

The `.arc` file gets copied into every lambda `node_modules/@architect/shared/.arc` upon every deploy or restart of the sandbox. `@architect/data` uses a `.arc` file to generate a lightweight data access layer. For the example above the generated API is:

- `data.notes.get`
- `data.notes.query`
- `data.notes.scan`
- `data.notes.put`
- `data.notes.delete`
- `data.notes.update`
- `data.ppl.get`
- `data.ppl.query`
- `data.ppl.scan`
- `data.ppl.put`
- `data.ppl.delete`
- `data.ppl.update`

The following code in `src/html/get-index/index.js` demos usage:

```javascript
let arc = require('@architect/functions')
let data = require('@architect/data')

async function route(req, res) {
  let result = await data.notes.scan({})
  let html = `<pre>${JSON.stringify(result, null, 2)}</pre>`
  res({html})
}

exports.handler = arc.http(route)
```

`@architect/data` also allows direct access to DynamoDB through a few methods:

- `data._db` which returns an instance of [`AWS.DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- `data._doc` returns an instance of [`AWS.DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- `data._name` helper function that returns a completely resolved resource name which is useful for constructing queries to tables or indexes

## Next: [`data._name`](/reference/data-name)
# <a id=data.db href=#data.db>`data._db`</a>

## Get an instance of `AWS.DynamoDB` from the `aws-sdk`

Example, given the following `.arc` file:

```.arc
@app
testapp

@http
get /

@tables
bikes
  bikeID *String

@index
bikes
  type *String
```

Connect directly to DynamoDB.

```javascript
let data = require('@architect/data')

// list all tables 
let tables = await data._db.listTables({})
// result: {Tables: ['testapp-staging-bikes', 'testapp-production-bikes']}
```

- [`AWS.DynamoDB` reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)

# <a id=data.doc href=#data.doc>`data._doc`</a>

## Get an instance of `AWS.DynamoDB.DocumentClient` from the `aws-sdk`

In this example we'll model a comic book store. Accounts are uniquely identified by email. One account has many purchases. Notice how the `.arc` comments annotates the extra fields on the purchases table definition (`#comicID` and `#price`). DynamoDB tables only define a schema for keys. All other attributes are optional. Likewise these comments are not significant but they will help your future colleagues understand the schema intent. 

```arc
@app
testapp

@http
get /

@tables
accounts
  email *String
  
purchases
  email *String
  #comicID
  #price

comics
  comicID *String

@index
comics
  publisher *String
```

Accessing the data with `DynamoDB.DocumentClient` is slightly nicer than the lower level `DynamoDB` client because it returns rows unformatted by their underlying DynamoDB types.

```javascript
let data = require('@architect/data')

let email = 'b@brian.io'

let TableName = data._name('purchases')

let purchases = await data._doc.query({
  TableName,
  KeyConditionExpression: 'email = :email',
  ExpressionAttributeValues: {
    ':email': email
  }
})
```

In the example above we query purchases by email to see all the comics they bought.

- [`AWS.DynamoDB.DocumentClient` reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

# <a id=data.get href=#data.get>`data.tablename.get`</a>

## Get a row by key

Example:

```arc
@app
testapp

@http
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

exports.handler = arc.http(handler)
```

# <a id=data.get href=#data.get>`data.tablename.query`</a>

## Query a table for a collection of rows

Example:

```arc
@app
testapp

@http
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

exports.handler = arc.http(handler)
```

# <a id=data.scan href=#data.scan>`data.tablename.scan`</a>

## Paginate through all rows in a table

Example:

```arc
@app
testapp

@http
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

exports.handler = arc.http(handler)
```

## Next: [`put`](/reference/data-put)


# <a id=data.get href=#data.get>`data.tablename.put`</a>

## Write a row

Example:

```arc
@app
testapp

@http
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

exports.handler = arc.http(handler)
```

The function defines `getID` helper. Internally the function uses a custom UNIX epoch by hardcoding an app specific start value. The value returned is a very short and unique key that is also URL safe.

# <a id=data.update href=#data.update>`data.tablename.update`</a>

## Update one row in a table

Example:

```arc
@app
testapp

@http
get /

@tables
accounts
  accountID *String

```

And then in a Lambda function:

```javascript
// src/html/get-index/index.js
let arc = require('@architect/functions')
let data = require('@architect/data')

async function handler(req, res) {
  await data.accounts.update({
    Key: { accountID: req.body.accountID },
    UpdateExpression: 'SET login = :login' ,
    ExpressionAttributeValues: {
      ':login': req.body.username = 'admin' && req.body.password === 'admin'
    }
  })
  res({
    location: '/'
  })
}

exports.handler = arc.http(handler)
```

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
