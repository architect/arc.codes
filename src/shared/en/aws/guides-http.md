# HTTP Functions

## Create full-featured web applications composed of fast, tiny HTTP functions

> `.arc` abstracts API Gateway configuration and provisioning, while `@architect/functions` (optionally) adds a very light but powerful API shim to Lambda for working with HTTP

Given the following example `.arc` file:

```arc
@app
testapp

@http
get /
```

By default, HTTP functions are dependency free with a minimal, but very powerful, low level API. 

```javascript
exports.handler = async function http(request) {
  return {
    status: 201,
    type: 'text/html; charset=utf8',
    body: `
    <!doctype html>
    <html>
      <body>hello world</body>
    </html>
   `
  }
}
```

Every HTTP handler receives a plain JavaScript object `request` as a first parameter with the following keys:

- <b>`body`</b> - `Object`, request body, including an `Object` containing any `application/x-www-form-urlencoded` form variables
- <b>`path`</b> - `string`, absolute path of the request
- <b>`method`</b> - `string`, one of `GET`, `POST`, `PATCH`, `PUT` and `DELETE`
- <b>`params`</b> - `Object`, any URL params, if defined in your function's path (i.e. `get /:foo/bar`)
- <b>`query`</b> - `Object`, any query params, if present
- <b>`headers`</b> - `Object`, contains all client request headers 

To send a response, HTTP functions support the following params as a plain JavaScript `Object`:

- <b>`status`</b> (or <b>`code`</b>) - `number`, sets the HTTP status code
- <b>`type`</b> - `string`, sets the `Content-Type` response header
- <b>`body`</b> - `string`, sets the response body
- <b>`location`</b> - `string`, sets the `Location` response header (combine with `status: 302` to redirect)
- <b>`cookie`</b> - `string`, sets the `Set-Cookie` response header
- <b>`cors`</b> - `boolean`, sets the various CORS headers


## Code sharing

Code sharing across your project's functions is implemented using `src/shared`. For example, this can be useful for shared layouts. Create the following file:

```javascript
// src/shared/layout.js
module.exports = function layout(html) {
  return `
    <!doctype html>
    <html>
    <body><h1>Layout!</h1>${html}</body>
    </html>
  `
}
```

And now you can reference it from any other function:

```javascript
// src/http/get-index/index.js
let layout = require('@architect/shared/layout')

module.exports = async function http(req) {
  let html = '<b>hello world!!</b>'
  return {
    type: 'text/html',
    body: layout(html)
  }
}
```

> 🔬 Read more about [sharing common code in Architect](https://arc.codes/guides/sharing-common-code)

---


# Helpers for your functions

HTTP functions come with `@architect/functions` and `@architect/data` installed. These have convenient helpers for working with the unique characteristics of API Gateway and DynamoDB, respectively.

```javascript
// opt into architect functions and data conveniences
let arc = require('@architect/functions')
let data = require('@architect/data')
```

Below we'll focus on `@architect/functions`; to learn more about the [`@architect/data` API, head here](/reference/data).

The following API is supported in `@architect/functions`:
 
- <b>[`arc.http`](#middleware-arc-http-)</b> - express-style middleware API
- <b>[`arc.http.session.read`](#sessions-arc-http-session-)</b> - read the session using the request cookie
- <b>[`arc.http.session.write`](#sessions-arc-http-session-)</b> - write the session returning a cookie string
- <b>[`arc.http.helpers.url`](#urls-arc-http-helpers-url-)</b> - transform `/` into the appropriate `staging` and `production` API Gateway paths
- <b>[`arc.http.helpers.static`](#static-arc-http-helpers-static-)</b> - accepts a path part and returns path to `localhost:3333` or `staging` and `production` S3 buckets
- <b>`arc.http.helpers.verify`</b> - verify a `csrf` token

> 📈 `@architect/functions` also has helpers for implementing pub/sub patterns by invoking SNS and SQS Lambda functions, defined by [`@events`](/reference/events) and [`@queues`](/reference/queues), respectively.


## Middleware (`arc.http`)

HTTP functions can opt into an Express-style middleware API. 

Here's an example in which we'll register `log`, `ping` and `index` to run in series. Each function continues to the next function in the series by calling `next()`. Execution is halted at any time in the chain by calling `res()`.

```javascript
let arc = require('@architect/functions')

function log(req, res, next) {
  console.log(JSON.stringify(req, null, 2))
  next()
}

function ping(req, res, next) {
  // does something with SNS here maybe
  next()
}

function index(req, res) {
  res({
    html: 'rendered index'
  })
}

exports.handler = arc.http(log, ping, index)
```

Middleware `req` has the following keys:

- <b>`body`</b> - `Object`, request body, including an `Object` containing any `application/x-www-form-urlencoded` form variables
- <b>`path`</b> - `string`, absolute path of the request
- <b>`method`</b> - `string`, one of `GET`, `POST`, `PATCH`, `PUT` and `DELETE`
- <b>`params`</b> - `Object`, any URL params, if defined in your function's path (i.e. `get /:foo/bar`)
- <b>`query`</b> - `Object`, any query params, if present
- <b>`headers`</b> - `Object`, contains all client request headers 

Middleware `res` is a function that accepts named parameters:

- **Required**: One of:
  - `json`
  - `html`
  - `text`
  - `css`
  - `js`
  - `xml`
  - `location`
- Optional: `session` - assign and overwrite the current session `Object`
- Optional: `status` or `code` of:
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


## Sessions (`arc.http.session`)

HTTP functions can opt into session support using Architect's anonymous, signed, secure sessions:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {

  // reads the session from DynamoDB
  let state = await arc.http.session.read(req) 

  // modify the state
  state.foo = 'bar'

  // save the session state to DynamoDB
  let cookie = await arc.http.session.write(state)

  // respond (and update the session cookie)
  return {
    cookie,
    status: 302,
    location: '/',
  }
}
```

All HTTP endpoints are sessions-enabled by default. 

- Requests are tagged to a session via a signed cookie `_idx`
- Session data expires after a week of inactivity

> Sessions are stateless by default; learn how to [opt into database backed sessions with DynamoDB](/guides/sessions)

## URLs (`arc.http.helpers.url`)

API Gateway generates long URLs that are hard to read, and extends the URL base path with either `staging` or `production` &mdash; this means a link intended to point at `/` should actually point at `/staging` or `/production`. (This pain point is eased if you set up a [custom domain name with DNS](/guides/custom-dns).)

`@architect/functions` also bundles a helper function `arc.http.helpers.url` for resolving URL paths that haven't yet been configured with DNS. This is helpful for early prototyping.

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


## Static (`arc.http.helpers.static`)

Architect projects can be set up with `staging` and `production` S3 buckets for file syncing from the [`public` folder](/guides/static-assets).

Each of these has its own URL – not to mention the local path in `sandbox`, which can mean trouble when trying to load the right version of a static asset.

The `arc.http.helpers.static` helper resolves URL paths for your static assets, so you're requesting the right file from every environment.

Here's an example of `static` usage:

```javascript
let arc = require('@architect/functions')
let static = arc.http.helpers.static

exports.handler = async function http(req) {
  return {
    type: 'text/html',
    body: `Hey, it's an image! <img src="${static('/img/rainbows.gif')}">`
  }
}
```


---


## Examples

A simple hello world HTML response:

```javascript
// src/http/get-index/index.js
exports.handler = async function http(req) {
  return {
    type: 'text/html'
    body: `<b>hello world</b>` 
  }
}
```

A redirect writing to the `session`:

```javascript
// src/http/post-login/index.js
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let loggedIn = req.body.email === 'admin' && req.body.password === 'admin'
  let cookie = await arc.http.session.write({loggedIn})
  return {
    cookie,
    status: 302,
    location: '/'
  }
}
```

A `302` response clearing the requester's session data:

```javascript
// src/http/get-logout/index.js
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let cookie = await arc.http.session.write({})
  return {
    cookie,
    status: 302,
    location: '/'
  }
}
```

An example `500` response:

```javascript
// src/http/get-some-broken-page/index.js
exports.handler = async function http(req) {
  return {
    type: 'text/html',
    status: 500,
    body: 'internal serverless error'
  }
}
```

An example JSON API endpoint:

```javascript
// src/http/get-cats/index.js
exports.handler = async function http(req) {
  return {
    type: 'application/json',
    status: 201,
    body: JSON.stringify({cats: ['sutr0']})
  }
}
```

---


## Example App

Let's implement a proof-of-concept login flow. [Example repo here.](https://github.com/arc-repos/arc-example-login-flow)

This example `.arc` project brings together all the concepts for defining HTTP Lambdas:

```arc
@app
loginflow

@http
get /
get /logout
get /protected
post /login
```

`npx create` generates the following directory structure:

```bash
/
├── src
│   ├── http
│   │   ├── get-index/
│   │   ├── get-logout/
│   │   ├── get-protected/
│   │   └── post-login/
│   └── shared/
├── .arc
└── package.json
```

First we render a form for `/login` if `req.session.isLoggedIn` is `false`:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

function index(req, res) {
  var header = `<h1>Login Demo</h1>`
  var protec = `<a href=${url('/protected')}>protected</a>`
  var logout = `<a href=${url('/logout')}>logout</a>`
  var nav = `<p>${protec} | ${logout}</p>`

  var form = `
  <form action=${url('/login')} method=post>
    <label for=email>Email</label>
    <input type=text name=email>
    <label for=password>Password</label>
    <input type=password name=password>
    <button>Login</button>
  </form>
  `

  res({
    html: `${header} ${req.session.isLoggedIn? nav : form}`
  })
}

exports.handler = arc.http(index)
```

That form performs an HTTP `POST` to `/login` where we look for mock values in `req.body.email` and `req.body.password`:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

function route(req, res) {
  var isLoggedIn = req.body.email === 'admin' && req.body.password === 'admin'
  res({
    session: {isLoggedIn},
    location: url(`/`)
  })
}

exports.handler = arc.http(route)
```

If successful `req.session.isLoggedIn` will be `true` and `nav` gets rendered. `/protected` utilizes middleware to ensure only logged in users can see it.

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

function protect(req, res, next) {
  if (req.session.isLoggedIn) {
    next()
  }
  else {
    res({
      location: url(`/`)
    })
  }
}

function attack(req, res) {
  var msg = 'oh hai you must be logged in to see me!'
  var logout = `<a href=${url('/logout')}>logout</a>`
  res({
    html: `${msg} ${logout}`
  })
}

exports.handler = arc.http(protect, attack)
```

Logging out just resets the `session` and redirects back to `/`.

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

function route(req, res) {
  res({
    session: {},
    location: url(`/`)
  })
}

exports.handler = arc.http(route)
```

And that's it! [Find the example repo here.](https://github.com/arc-repos/arc-example-login-flow)

<hr>

## Next: [Working locally & offline](/guides/offline)
