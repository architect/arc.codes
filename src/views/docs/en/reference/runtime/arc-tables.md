---
title: arc.tables
description: Work with tables defined in app.arc
sections:
  - Overview
  - get
  - query
  - scan
  - put
  - delete
  - update
  - data._db
  - data._doc
  - data._name
  - Examples
---

## Overview

Returns an object that can be used to access data in database tables as defined under `@tables` in your `app.arc` file. For example, given the following `app.arc` file snippet:

```bash
@tables
accounts
  accountID *String

messages
  msgID *String
```

Running the following code:

```js
let data = await arc.tables()
```
Would yield the following objects: 
- `data.accounts`: reference to the `accounts` table
- `data.messages`: reference to the `messages` table

... which contain the following methods:


## get

`get(key, callback)`: retrieves the record from the table with `key` key and invokes callback when complete

```js
let result = await data.accounts.get({
  accountID: 'fake'
})
// returns {"accountID: "fake"}
```

## query

`query(params, callback)`: queries the table using params and invokes callback with the result

```js
let result = await data.accounts.query({
  KeyConditionExpression: 'accountID = :id',
  ExpressionAttributeValues: {
    ':id': 'one',
  }
})
```

## scan - `scan(params, callback)`

scans the table using params and invokes callback with the result


## put - `put(item, callback)`

adds item to the table and invokes callback with the item when complete


## delete - `delete(key, callback)`

deletes the record from the table with `key` key and invokes callback with the result


## update - `update(params, callback)`

updates an item in the table using params and invokes callback when complete


## `data._db`
an instance of `DynamoDB` from the `aws-sdk`

## `data._doc`
an instance of `DynamoDB.DocumentClient` from the `aws-sdk`

## `data._name`
a helper for returning an environment appropriate table name

## Examples

Example, given the following `app.arc` file:

```bash
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

Generate a lightweight data access layer.

```javascript
// src/http/get-index
let arc = require('@architect/functions')

exports.handler = async function http() {
  let data = await arc.tables()
  // do something with data here...
  return {statusCode: 201}
}
```

For the example above the generated API is:

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

async function route(req, res) {
  let data = await arc.tables()
  let result = await data.notes.scan({})
  let html = `<pre>${JSON.stringify(result, null, 2)}</pre>`
  res({html})
}

exports.handler = arc.http(route)
```

The generated data layer also allows direct access to DynamoDB through a few methods:

- `data._db` which returns an instance of [`AWS.DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- `data._doc` returns an instance of [`AWS.DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- `data._name` helper function that returns a completely resolved resource name which is useful for constructing queries to tables or indexes

---

### Get an instance of `AWS.DynamoDB` from the `aws-sdk`

Example, given the following `app.arc` file:

```bash
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
let arc = require('@architect/functions')

// list all tables
let tables = await arc.tables._db.listTables({})
// result: {Tables: ['testapp-staging-bikes', 'testapp-production-bikes']}
```

- [`AWS.DynamoDB` reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)

---

### Get an instance of `AWS.DynamoDB.DocumentClient` from the `aws-sdk`

In this example we'll model a comic book store. Accounts are uniquely identified by email. One account has many purchases. Notice how the `app.arc` comments annotates the extra fields on the purchases table definition (`#comicID` and `#price`). DynamoDB tables only define a schema for keys. All other attributes are optional. Likewise these comments are not significant but they will help your future colleagues understand the schema intent.

```bash
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
let {tables} = require('@architect/functions')

let email = 'b@brian.io'
let data = await tables()
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

---

### Get a row by key

Example:

```bash
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
let {http, tables} = require('@architect/functions')

async function handler(req, res) {
  let noteID = req.query.noteID
  let data = await tables()
  let note = await data.notes.get({noteID})
  res({
    html: note.body
  })
}

exports.handler = http(handler)
```

---

### Query a table for a collection of rows

```bash
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
let {http, tables} = require('@architect/functions')

async function handler(req, res) {
  let noteID = req.query.noteID
  let data = await tables()
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

---

### Paginate through all rows in a table

```bash
@app
testapp

@http
get /

@tables
notes
  noteID *String

```

```javascript
// src/html/get-index/index.js
let {http, tables} = require('@architect/functions')

async function handler(req, res) {
  let data = await tables()
  let notes = await data.notes.scan({})
  res({
    html: `count: ${notes.Count}`
  })
}

exports.handler = http(handler)
```

---

### Write a row

```bash
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
let {http, tables} = require('@architect/functions')
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
  let data = await tables()
  let note = await data.notes.put({noteID, body, title, ts})
  res({
    location
  })
}

exports.handler = http(handler)
```

The function defines `getID` helper. Internally the function uses a custom UNIX epoch by hard-coding an app specific start value. The value returned is a very short and unique key that is also URL safe.

---

### Update one row in a table

```bash
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

let {http, tables} = require('@architect/functions')

async function handler(req, res) {
  let data = await tables()
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

exports.handler = http(handler)
```

---

### Delete a row by key

```bash
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

let {http, tables} = require('@architect/functions')
let url = http.helpers.url

async function handler(req, res) {
  let data = await tables()
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

exports.handler = http(handler)
```

The POST to `/notes` creates a row and redirects home:

```javascript
// src/http/post-notes/index.js

let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  let noteID = req.body.noteID
  let msg = 'hello world!'
  let data = await tables()
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
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  let noteID = req.body.noteID
  let data = await tables()
  let note = await data.notes.delete({noteID})
  return {
    status: 302,
    location: url('/')
  }
}
```