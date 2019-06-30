# <a id=arc.http href=#arc.http>`arc.http`</a>

**Note**: this is the previous middleware API supported by previous versions of Architect. The new API, which supports `async/await` and returning responses, rather than using callbacks and `next()` is **[`arc.middleware`](/reference/middleware)**.

`arc.http` is an express-style middleware API for HTTP functions.

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
# URLs (`arc.http.helpers.url`)

## Get the correct URLs across sandbox, staging and production

API Gateway generates long URLs that are hard to read, and extends the URL base path with either `staging` or `production` &mdash; this means a link intended to point at `/` should actually point at `/staging` or `/production`. 

> 👉🏽 Note: you don't need to worry about URL differences if you set up a [custom domain name with DNS](/guides/custom-dns)

If you haven't set up DNS yet, `@architect/functions` bundles a helper function `arc.http.helpers.url` for resolving URL paths. This is helpful for early prototyping.

Here's an example index page that demonstrates `url` usage:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  if (req.session.isLoggedIn) {
    return {
      type: 'text/html',
      body: `<a href=${url('/logout')}>logout</a>`
    }
  }
  else {
    return {
      status: 302,
      location: url('/login')
    } 
  }
}
```

> 👋 After DNS propagates you can remove calls to `arc.http.helpers.url` from your code. Learn how to [assign a domain name](/guides/custom-dns) by setting up DNS.


# <a id=arc.http.session href=#arc.http.session>`arc.http.session`</a>

Read and write to DynamoDB session tables.

> 🦉 `arc.http.session.read` reads session state for a request.

`read(request, [callback]) => Promise` 
- accepts a request object and an optional Node style errback
- if no callback is supplied returns a Promise that resolves session state

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  // read the session
  let session = await arc.http.session.read(req)
  let html = `<h1>hello ${session.name || 'unknown'}</h1>`
  return {
    type: 'text/html',
    body: html
  }
}
```

> 💾 `arc.http.session.write` writes session into DynamoDB.

`write(state, [callback]) => Promise`
- accepts session state as a plain JavaScript object and an optional Node style errback
- if no callback is supplied returns a Promise that resolves a Set-Cookie string

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {

  // read the session
  let session = await arc.http.session.read(req)

  // write the session
  session.name = req.body.name

  // save the session state 
  let cookie = await arc.http.session.write(session)

  // update the session cookie and redirect
  return {
    cookie,
    status: 302,
    location: '/'
  }
}
```


# <a id=proxy.public href=#proxy.public>`proxy.public`</a>

## Proxy S3 through API Gateway

Given the following `.arc` file:

```arc
@app
spa

@static
@http
get /

```

And to proxy all requests to S3:

```javascript
// add this to `src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.proxy.public({spa:true})
```

Setting `{spa:false}` will fall back to normal 404 behavior. If `/public/404.html` is defined that file will be used.
