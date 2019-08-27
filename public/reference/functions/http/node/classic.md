# <a id=arc.http href=#arc.http>`arc.http`</a>

Architect provides two optional middleware helpers for cutting down on boilerplate HTTP operations.

Both middleware helpers conveniently attach user sessions to incoming `request` object (if applicable), and decode and parse the `request` body (again, if applicable).

Use whatever feels right for your project and team needs!

- `arc.http` is a classic continuation-passing style middleware API
  - Functions similarly to Express, and supported since the earliest versions of Architect
- [`arc.http.async`](/reference/functions/http/node/async) is an `async/await` style middleware API


## Basic Usage

```javascript
let arc = require('@architect/functions')

function route(req, res) {
  let html = '<h1>hello world</h1>'
  res({html})
}

exports.handler = arc.http(route)
```

`arc.http` registers one, or more, functions with the signature `(req, res, next)=>`.

`req` has the following keys:

- `body` any `application/x-www-form-urlencoded` form variables as a plain `Object`
- `path` absolute path of the request
- `method` one of `GET`, `POST`, `PATCH`, `PUT` and `DELETE`
- `params` any URL params defined
- `query` any query params defined
- `headers` a plain `Object` of request headers
- `session` a plain `Object` representing the current session

`res` is a function that accepts named parameters:

- **Required**: One of
  - `json`
  - `html`
  - `text`
  - `css`
  - `js`
  - `xml`
  - `location`
- Optionally: `session` to assign to the current session
- Optionally: `status` or `code` of:
  - `201` Created
  - `202` Accepted
  - `204` No Content
  - `400` Bad Request
  - `403` Forbidden
  - `404` Not Found
  - `406` Not Acceptable
  - `409` Conflict
  - `415` Unsupported Media Type
  - `500` Internal Serverless Error

The default HTTP status code is `200`. A `302` is sent automatically when redirecting via `location`.

---

- HTTP `POST` routes can **only** call `res` with `location` key and value of the path to redirect to.
- `session` can also optionally be set

In the following example we define `validate` middleware:

```javascript
var arc = require('@architect/functions')
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

exports.handler = arc.http(validate, handler)
```

Things to understand:

- `arc.http` accepts one or more functions that follow Express-style middleware signature: `(req, res, next)=>`
- `req` is a plain JavaScript `Object` with `path`, `method`, `query`, `params`, `body` keys
- `res` is a function that must be invoked with named params:
  - `location` with a URL value (a string starting w `/`)
  - `session` (optional) a plain `Object`
- `res` can also be invoked with an `Error`
  - optionally the `Error` instance property of `code`, `status` or `statusCode` can be one of `403`, `404` or `500` to change the HTTP status code
- `next` (optional) is a function to continue middleware execution

Here's an example using `session` and `location`. First we render a form:

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

exports.handler = arc.http(handler)

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

exports.handler = arc.http(handler)
```

---
