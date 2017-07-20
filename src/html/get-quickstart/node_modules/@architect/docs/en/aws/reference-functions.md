# Functions

> `@architect/functions` is for creating cloud function signatures

- <a href=#arc.html.get>`arc.html.get(...fns)`</a>
- <a href=#arc.html.post>`arc.html.post(...fns)`</a>
- <a href=#arc.json.get>`arc.json.get(...fns)`</a>
- <a href=#arc.json.post>`arc.json.post(...fns)`</a>
- <a href=#arc.events.subscribe>`arc.events.subscribe((payload, callback)=>)`</a>
- <a href=#arc.events.publish>`arc.events.publish(params, callback)` where `params` requires `name` and `payload` and optionally `app` keys</a>
- <a href=#arc.tables.insert>`arc.tables.insert((record, callback)=>)`</a>
- <a href=#arc.tables.update>`arc.tables.update((record, callback)=>)`</a>
- <a href=#arc.tables.destroy>`arc.tables.destroy((record, callback)=>)`</a>

`arc.html` and `arc.json` functions accepts one or more Express middleware style functions `(req, res, next)=>`.

---

## <a id=arc.html.get href=#arc.html.get>`arc.html.get`</a>

> HTTP `GET` handler that responds with `text/html`

An example:

```javascript
var arc = require('@architect/functions')

function handler(req, res) {
  res({
    html: '<strong>Hello world</strong>'
  })
}

exports.handler = arc.html.get(handler)
```

Things to understand:

- `arc.html.get` accepts one or more functions that follow Express style middleware signature: `(req, res, next)=>`
- `req` is a plain JavaScript `Object` with `path`, `method`, `query`, `params`, `body` keys
- `res` is a function that must be invoked with named params: 
  - `html` a string value containing html content
  - or `location` with a url value (a string starting w `/`)
  - `session` (optional) a plain `Object`
- `next` is an optional function to continue middleware execution 

Here's an example using `session` and `location`. First we render a form.

```javascript
// src/html/get-index
var arc = require('@architect/functions')

var form = `
<form action=/count method=post>
  <button>1up</button>
</form>
`

function handler(req, res) {
  var count = req.session.count || 0
  res({
    html: `<h1>${count}</h1><section>${form}</section>`
  })
}

exports.handler = arc.html.get(handler)

```

The form handler increments `req.session.count` and redirects back home.

```javascript
// src/html/post-count
var arc = require('@architect/functions')

function handler(req, res) {
  var count = (req.session.count || 0) + 1
  res({
    session: {count},
    location: '/'
  })
}

exports.handler = arc.html.post(handler)

```

---

## <a id=arc.html.post href=#arc.html.post>`arc.html.post`</a>

> HTTP `POST` handler that responds with HTTP statusCode `302` and Location redirect

- HTTP `POST` routes can **only** call `res` with `location` key and value of the path to redirect to. 
- `session` can also optionally be set.

In the following example we define `validate` middleware:

```javascript
var arc = require('@smallwins/arc-prototype')
var sendEmail = require('./_send-email')

function validate(req, res, next) {
  var isValid = typeof req.body.email != 'undefined'
  if (isValid) {
    next()
  }
  else {
    res({
      session: {
        errors: ['email missing']
      },
      location: '/contact'
    })
  }
}

function handler(req, res) {
  sendEmail({
    email: req.body.email
  }, 
  function _email(err) {
    res({
      location: `/contact?success=${err? 'yep' : 'ruhroh'}`
    })
  })
}

exports.handler = arc.html.post(validate, handler)
```

### Sessions

By default, all `@html` routes are session enabled. If you wish to disable sessions remove `SESSION_TABLE_NAME` env variable from the deployment config in the AWS Console.

## <a id=arc.json.get href=#arc.json.get>`arc.json.get`</a>

A `@json` route handler:

```javascript
var arc = require('@smallwins/arc-prototype')

function handler(req, res) {
  res({
    json: {noteID: 1, body: 'hi'}
  })
}

exports.handler = arc.json.get(handler)
```

Things to understand:

- `arc.json.get` and `arc.json.post` accept one or more functions that follow Express style middleware ssignature: `(req, res, next)=>`
- `req` is a plain object with `path`, `method`, `query`, `params`, `body` keys
- `res` is a function that must be invoked with either `json` or `location` and optionally a `session` key
- `next` is an optional function to continue middleware execution

### Sessions

By default, all `@json` routes are session enabled. If you wish to disable sessions remove `SESSION_TABLE_NAME` env variable from the deployment config in the AWS Console.

---

## <a id=arc.json.post href=#arc.json.post>`arc.json.post`</a>

```javascript
var arc = require('@smallwins/arc-prototype')

function handler(req, res) {
  res({
    json: {noteID: 1, body: 'hi'}
  })
}

exports.handler = arc.json.post(handler)
```

---

## <a id=arc.events.subscribe href=#arc.events.subscribe>`arc.events.subscribe`</a>

> Subscribe functions to events

An example of a `hit-counter` event handler:

```javascript
var arc = require('@smallwins/arc-prototype')

function count(payload, callback) {
  console.log(JSON.stringify(payload, null, 2))
  // maybe save count to the db here
  callback()
}

exports.handler = arc.events.subscribe(count)
```

---

## <a id=arc.events.publish href=#arc.events.publish>`arc.events.publish`</a>

> Publish events from any other function

Once deployed you can invoke `@event` handlers from any other function defined under the same `@app` namespace:

```javascript
var arc = require('@achitect/functions')

arc.events.publish({
  name: 'hit-counter',
  payload: {hits: 1},
}, console.log)
```

You can also invoke Lambdas across `@app` namespaces:

```javascript
var arc = require('@achitect/functions')

arc.events.publish({
  app: 'some-other-app',
  name: 'hit-counter',
  payload: {hits: 2},
}, console.log)
```

---

## <a id=arc.tables.insert href=#arc.tables.insert>`arc.tables.insert`</a>

> Respond to data being inserted into a DynamoDB table

```javascript
var arc = require('@architect/functions')

function handler(record, callback) {
  console.log(JSON.stringify(record, null, 2))
  callback()
}

exports.handler = arc.tables.insert(handler)
```

---

## <a id=arc.tables.update href=#arc.tables.update>`arc.tables.update`</a>

> Respond to data being updated in a DynamoDB table

```javascript
var arc = require('@architect/functions')

function handler(record, callback) {
  console.log(JSON.stringify(record, null, 2))
  callback()
}

exports.handler = arc.tables.update(handler)
```
---

## <a id=arc.tables.destroy href=#arc.tables.destroy>`arc.tables.destroy`</a>

> Respond to data being removed from a DynamoDB table

```javascript
var arc = require('@architect/functions')

function handler(record, callback) {
  console.log(JSON.stringify(record, null, 2))
  callback()
}

exports.handler = arc.tables.destroy(handler)
```
---

## Next Steps

Read about [`@app`](/reference/app) namespace defined in an `.arc` file.
