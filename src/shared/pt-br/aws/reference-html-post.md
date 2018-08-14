<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# <a id=arc.html.post href=#arc.html.post>`arc.html.post`</a>

## HTTP `POST` handler aways responds with a redirect

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

exports.handler = arc.html.post(validate, handler)
```

Things to understand:

- `arc.html.post` accepts one or more functions that follow Express-style middleware signature: `(req, res, next)=>`
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
