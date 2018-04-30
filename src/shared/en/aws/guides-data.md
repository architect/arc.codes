# Persist Data

> Data is the core to most apps; `.arc` bakes first class DynamoDB support for its speed, flexibility and ease of use

Durable persistence of structured data is the foundation for many kinds of applications. `@architect/data` is a very thin wrapper for `DynamoDB` and `DynamoDB.DocumentClient` that reads a `.arc` file and returns a client for creating, modifying, deleting and querying data from DynamoDB. In this guide you will build a simple note taking application covering the major points for working with Dynamo and `.arc`.

## Generating the Data Layer

Given the following `.arc` file:

```arc
@app
testapp

@html
get /
get /notes/:noteID

post /login
post /logout
post /notes
post /notes/:noteID
post /notes/:noteID/del

@tables
accounts
  accountID *String

notes
  accountID *String
  noteID **String
```

Running `npm run create` will generate routes and tables to model our persistence needs. Accounts have an `accountID` partition key. Notes also have an `accountID` partition key and a unique `noteID`. This is one way to model a "many-to-many" relationship in Dynamo. 

And the following tables are created:

- `testapp-staging-accounts`
- `testapp-production-accounts`
- `testapp-staging-notes`
- `testapp-production-notes`

> 🎩 Tip: `data._db` and `data._doc` return instances of DynamoDB and DynamoDB.DocumentCLient for directly accessing your data; use `data._name` to resolve the table names with the app name and environment prefix.

## Hydrating the Data Layer

Install `@architect/data` into the Lambda functions that will need it:

```bash
cd src/html/get-index 
npm i @architect/data
```

And then inside your function require `@architect/data` which will read `.arc` file and generate a data layer from it. You can immediately start working with the database without any configuration. `@architect/data` automatically scopes the table names. Using the `.arc` declarative manfiest provides two advantages: no syntax errors due to mispelled string identifiers for table names and no configuration code to map table names to execution environments ensuring staging and production data cannot get mixed up.

`@architect/data` generates the following API from the `.arc` file above:

- `data._db` an instance of `DynamoDB` from the `aws-sdk`
- `data._doc`an instance of `DynamoDB.DocumentClient` from the `aws-sdk`
- `data._name` a helper for returning an environment appropriate table name
- `data.accounts.get` get an account row
- `data.accounts.query` query accounts
- `data.accounts.scan` return all accounts in pages of 1mb
- `data.accounts.put` write an account row
- `data.accounts.update` update an account row
- `data.accounts.delete` delete an account row
- `data.notes.get` get a note
- `data.notes.query` query notes
- `data.notes.scan`return all notes in pages in 1mb
- `data.notes.put` write a note
- `data.notes.update` update a note
- `data.notes.delete` delete a note

In addition to providing some extra safety the generated code also saves on boilerplate! 

All generated methods accept an params object as a first parameter and an optional callback. If the callback is not supplied a Promise is returned. It is important to note this is a powerful client that allows you to read and write data indiscriminately. Security and access control to your Dyanmo tables is determined by your domain specific application business logic. 

> 🔐 Further restriction can be enabled by changing the Lambda IAM role; if you do that it's reccomended to script the creation and application of the role with the `aws-sdk` and commit that code into your app revision control under `/scripts/lockdown-lambda` and then document it in your `readme.md`. This way if you need to recreate the app in another region or change the policy things are documented, reproducable and automated. Domain specific infrastructure choices should be version controlled too. 

## Implementing a RESTful-ish Interface

Build out a quick admin interface. Add a layout to `/`.

```javascript
let arc = require('@architect/functions')
let layout = require('@architect/shared/layout')

function route(req, res) {
  let body = 'hello world'
  let title = 'welcome home'
  let html = layout({body, title})
  res({html})
}

exports.handler = arc.html.get(route)
```

Create the layout in `src/shared` so its available to all our functions:

```bash
mkdir src/shared
touch src/shared/layout.js
```

And edit it:

```javascript
// src/shared/layout.js
let auth = require('./_auth')

module.exports = function layout(params={}) {
  let body = params.body || 'hello world'
  let title = params.title || '@architect/data demo'
  return `<!doctype HtMl>
<html lang=en>
<head>
<meta charset=utf-8>
<meta name=viewport content=width=device-width,initial-scale=1,shrink-to-fit=no>
<link rel=stylesheet 
  href=https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css
  integrity=sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4 
  crossorigin=anonymous>
<title>${title}</title>
</head>
<body>
${auth}
${body}
</body>
</html>`
}
```
Include an HTML partial `_auth` control. The layout module itself accepts an optional params object with `body` and `title` keys and returns an HTML document as a string. Truly, string interpolation is the purest essence of web development. And thus for now we just use Bootstrap. 🤷🏽‍♀️

Implement the HTML partial auth control:

```javascript
// src/shared/_auth.js
module.exports = function _auth(params) {
  let {_url} = params
  let action = _url('/login')
  return `
<form action=${action} method=post>
  <div class=form-group>
    <label for=email>Email address</label>
    <input type=email class=form-control name=email placeholder="Enter email">
  </div>
  <div class=form-group>
    <label for=password>Password</label>
    <input type=password class=form-control name=password placeholder="Password">
  </div>
  <button type=submit class="btn btn-primary">Login</button>
</form>`
}
```

For now, just hardcode the credentials.

```javascript
// src/html/post-login.js
let arc = require('@architect/functions')

function route(req, res) {
  let location = req._url('/')
  let session = {}
  let authorized = req.body.email === 'b@brian.io' && req.body.password === 'lolwut'
  if (authorized) {
    session.account = {name: 'brianleroux'}
  }
  res({session, location})
}

exports.handler = arc.html.post(route)
```

No matter what happens this function will redirect back to `/`. By default, `session` will be reset unless the correct credentials are supplied. That's it for login.

### Logout

Modify the auth HTML partial to display a logout button if they are logged in.

```javascript
// src/shared/_auth.js
module.exports = function _auth(params) {
  let {_url, account} = params
  let loginAction = _url('/login')
  let loginForm = `
<form action=${loginAction} method=post>
  <div class=form-group>
    <label for=email>Email address</label>
    <input type=email class=form-control name=email placeholder="Enter email">
  </div>
  <div class=form-group>
    <label for=password>Password</label>
    <input type=password class=form-control name=password placeholder="Password">
  </div>
  <button type=submit class="btn btn-primary">Login</button>
</form>`
  let logoutAction = _url('/logout')
  let logoutForm = `
<form action=${logoutAction} method=post>
  <button type=submit class="btn btn-primary">Logout</button>
</form>`
  return account? logoutForm : loginForm
}
```

And implement the logout handler too.

```javascript
// src/html/post-logout/index.js
var arc = require('@architect/functions')

function route(req, res) {
  res({
    session: {},
    location: req._url('/'),
  })
}

exports.handler = arc.html.post(route)
```

This wipes the current session and redirects back to `/`.

### Write a Note

Modify the index route with its own HTML partial to render a form for creating notes when logged in.

```javascript
// src/html/get-index/_create.js
module.exports = function _create(params) {
  let {_url, account} = params
  // bail if there's no account
  if (!account) return ''
  // otherwise render the notes form
  let action = _url('/notes')
  return `
<form action=${action} method=post>
  <div class=form-group>
    <label for=title>Title</label>
    <input type=text class=form-control name=title placeholder="Title text here…">
  </div>
  <div class=form-group>
    <label for="exampleFormControlTextarea1">Note</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
  </div>
  <button type=submit class="btn btn-primary">Save Note</button>
</form> 
  `
}
```

And add it to the index handler:

```javascript
let arc = require('@architect/functions')
let layout = require('@architect/shared/layout')
let create = require('./_create')

function route(req, res) {
  let account = req.session.account
  let body = create({_url:req._url, account})
  let title = 'welcome home'
  let html = layout({body, title})
  res({html})
}

exports.handler = arc.html.get(route)
```

Implement the post handler:

```javascript
```

- generating keys

Extra credit:

- sanitize inputs with xss
- validate input; you probably can do without a library

### Read a Note 

### Show all Notes


```javascript
var arc = require('@architect/functions')
var data = require('@architect/data')

async function route(req, res) {
  var result = await data.notes.scan({})
  var html = result.Items.map(note).join('\n')
  res({html})
}

exports.handler = arc.html.get(route)
```
### Edit a Note

### Delete a Note

Use `data.notes.get` for the `get /notes/:noteID` route handler:

```javascript
// src/html/get-notes-000noteID
var arc = require('@architect/functions')
var data = require('@architect/data/hydrate')

async function route(req, res) {
  var noteID = req.params.noteID
  var note = await data.notes.get({noteID})
  var html = `
    <h1>${note.title}</h1>
    <p>${note.body}</p>
  `
  res({html})
}

exports.handler = arc.html.get(route)
```


## Patterns

- authoring for determinism: use a stateless client for performing stateful actions
