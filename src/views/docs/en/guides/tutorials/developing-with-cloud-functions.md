---
title: Developing with cloud functions
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Principles & best practices
  - Helpers for your functions
  - Tutorial example
---

## Overview

> This document describes reasons to build cloud function-based applications (or CFAs), with considerations and added context on how they differ from other kinds of software.

Traditionally, most apps demand three critical things of their maintainers:

1. Managing the codebase
2. Managing the server infrastructure that runs the codebase
3. Managing the plumbing that ties the code and infra together

Architect offers a powerful new approach to app development: **building applications centered around cloud functions**.

With Architect, your app deploys instantly, you pay only for what you use, and you can finally scale your app from a simple prototype to a massive success without ever having to change your cloud infra.

### ✨Let's learn your new superpowers

- **Deploy new code instantaneously** - a single function deploys globally in seconds, and a large app in minutes. This means orders of magnitude tighter iteration cycles and faster fixes, which in turn means far greater customer value.

- **Scale up to meet increased demand instantly** - cloud functions are completely elastic, and instantly create additional instantiations of themselves as demand grows. Never worry about the app going down again.

- **Scale and grow automatically** - time spent capacity planning is time wasted

- **Are more secure** - cloud functions adhere to least privilege at the lowest levels, each being locked down and secured from the filesystem all the way up through the other cloud services it can communicate with

- **Do not keep ports or processes open** - with nothing to scan and attack, say goodbye to one of your app's chief security vectors

- **Recycle instantly** – no more lag to do simple things like modify environment variables, cloud functions are easily reconfigured, and changes go live in milliseconds

- **Never require patching** - the latest under-the-hood security updates are baked into every invocation in real-time, without maintainer intervention

- **Never require maintenance** - planned downtime to tidy up your server cluster is simply a thing of the past

- **Only pay for what you for what you use, and at affordable rates** - not having to keep servers running means not having to pay for servers sitting idle; and even when in heavy use, cloud functions are highly affordable

Cloud function apps embody the dream we've been promised of the cloud for decades. With these new superpowers comes new considerations.

---

## Principles & best practices

### Statelessness between invocations

Unlike servers, which can take seconds or minutes to spin up, cloud functions start in milliseconds, and can instantly fan out to massive scale.
- This is possible because cloud functions are effectively stateless between each invocation
- However, many of today's applications assume some statefulness between executions, so this may be a new consideration for your application architecture

### Statelessness can impact your choice of database

Because cloud functions are effectively stateless, older socket-based data persistence systems (example: most SQL databases) can become overwhelmed by their need to open and close connections so frequently.
- For this reason, cloud functions work best with persistence systems that utilize fast, non-socket-based methods of transaction (e.g. HTTP, API, etc.)
- Examples include Architect Data / DynamoDB, Firebase, RethinkDB, FaunaDB, GraphQL, etc.
- This is, of course, evolving! We understand there projects launching soon to enable cloud function-friendly accessing of socket-based databases like SQL, Postgres, MongoDB, etc.

### Smaller cloud functions run faster

Cloud functions start and run fastest when they're small and discrete.
- For this reason Architect applications split your application up into individual, stateless functions, each its own directory in your repo
- Of course, intra-project code sharing would be a requirement to keep things dry, so Architect applications share code via `src/shared/` and `src/views/` directories ([learn more here](/en/guides/tutorials/code-sharing-across-functions))
- In practice, this looks a lot like a micro-services-based architecture, except now it has the advantage of being reflected in how your app runs in the cloud
- This also has the added benefit of massively aiding debugging – no more grepping through your entire application's logs, just look at the cloud function in which you've got the bug!

### Requests as Input

By default, HTTP functions are dependency free with a minimal, but very powerful, low level API. Every HTTP function receives a plain JavaScript `Object` called `request` as a first parameter.

`request` has the following keys:

- **`body`:** receives `Object` - request body, including an `Object` containing any `application/x-www-form-urlencoded` form variables
- **`path`:** receives `string` - absolute path of the request
- **`method`:** receives `string` - one of `GET`, `POST`, `PATCH`, `PUT` and `DELETE`
- **`params`:** receives `Object` - any URL params, if defined in your function's path (i.e. `get /:foo/bar`)
- **`query`:** receives `Object` - any query params, if present
- **`headers`:** receives `Object` - contains all client request headers 

Routes also get the AWS [`context`](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html) `Object` as a second argument, which can be used for performance optimization and other tricks, but most routes don't use it. 

### Return a response

To send a response, HTTP functions return a plain JavaScript `Object` with the following params:

- **`status`:** (or **`code`**) receives `number` - sets the HTTP status code
- **`type`:** receives `string` - sets the `Content-Type` response header
- **`body`:** receives `string` - sets the response body
- **`location`:** receives `string` - sets the `Location` response header (combine with `status: 302` to redirect)
- **`cookie`:** receives `string` - sets the `Set-Cookie` response header
- **`cors`:** receives `boolean` - sets the various CORS headers

`@architect/functions` (optionally) adds additional useful tools for working with HTTP, including middleware, sessions, and more.

### Code sharing

Code sharing across your project's functions is implemented using `src/shared` directory. For example, this can be useful for shared layouts. Create the following file:

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

> Read more about [sharing common code in Architect](/en/guides/tutorials/code-sharing-across-functions)

---

## Helpers for your functions

HTTP functions come with `@architect/functions` and `@architect/data` installed. These have convenient helpers for working with API Gateway and DynamoDB, respectively.

```javascript
// opt into architect functions and data conveniences

let arc = require('@architect/functions')
let data = require('@architect/data')
```

In the example below we'll use some of the helpers from  `@architect/functions`:

- [`arc.http.session`](/en/reference/runtime-helper-reference/arc-http-session) - read the session using the request cookie, write the session returning a cookie string
- [`arc.http.helpers.url`](/en/reference/runtime-helper-reference/arc-http-helpers#url) - transform `/` into the appropriate `staging` and `production` API Gateway paths
- [`arc.http.helpers.static`](http://localhost:3333/en/reference/runtime-helper-reference/arc-static) - accepts a path part and returns path to `localhost:3333` or `staging` and `production` S3 buckets
- `arc.http.helpers.verify` - verify a `csrf` token

---

## Tutorial example

### Create full-featured web applications composed of fast, tiny HTTP functions

Here we'll start from a basic 'hello world' app example and then build a bigger app with signups and logins. 

We'll do this using **AWS Lambdas** (small functions that trigger when their URL is hit.) You can think of lambdas as the equivalent of 'routes' in traditional web apps. 

AWS Lambdas are accessed via API Gateway, but `app.arc` abstracts API Gateway and Lambda configuration and provisioning so that creating a lambda function is a smooth and seamless experience.

### Hello world

Let's begin by provisioning a lambda function that will serve as the root of our app and give a simple `hello world` HTML response. 

Given the following example `app.arc` file:

```bash
@app
testapp

@http
get /
```

When a user visits `/`, the following HTTP function in `src/http/get-index/index.js` will run: 

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

### 404 handling

404s are handled by `/src/http/get-index`. You can intercept the requests and show an error page:

```javascript
// Route handles 404s

const notFound = async function http(request) {
  if (request.path !== "/") {
    return {
      status: 404,
      type: 'text/html; charset=utf8',
      body: `<b>${request.path} not found</b>` 
    }
  }
}
```

Then fall back to the regular home page:

```javascript
// Regular route for GET /

const showHomepage = async function http(request) {
  return {
    type: 'text/html; charset=utf8'
    body: `<b>hello world</b>` 
  }
}
```

Use middleware to combine the lambdas:

```javascript
// Combine the handlers together using Arc middleware

exports.handler = arc.http.middleware(notFound, showHomepage)
```

### Redirect

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

### Clearing sessions

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

### A `500` response:

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

### JSON API endpoint

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

## Example App

Let's implement a proof-of-concept login flow. There's [a repo with the example below on GitHub](https://github.com/architect/arc-example-login-flow).

This example `app.arc` project brings together all the concepts for defining HTTP Lambdas:

```bash
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
├── app.arc
└── package.json
```

First we make `GET` for `/` show a message for logged in users, or a login form for logged out users, depending on `state.isLoggedIn`:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  let state = await arc.http.session.read(req)
  let isLoggedIn = !!state.isLoggedIn

  var loggedInPage = `
	<h2>You're logged in</h2>
  	<p>
	  <a href=${url('/protected')}>protected</a>
	  <a href=${url('/logout')}>logout</a>
	</p>`

  var notLoggedInPage = `
  	<h2>Logged out</h2>	
    <form action=${url('/login')} method=post>
      <label for=email>Email</label>
      <input type=text name=email>
      <label for=password>Password</label>
      <input type=password name=password>
      <button>Login</button>
    </form>
  `

   return {
    type: 'text/html',
    body: `
	<body>
		<h1>Login Demo</h1>
		${isLoggedIn ? loggedInPage : notLoggedInPage}
	<body>`
  }
}
```

That form performs an HTTP `POST` to `/login` where we look for mock values in `req.body.email` and `req.body.password`:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(request) {
  let session = await arc.http.session.read(request)
  let isLoggedIn = request.body.email === 'admin@example.com' && request.body.password === 'admin'
  session.isLoggedIn = isLoggedIn
  const location = isLoggedIn ? '/' : '/login'
  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: 302,
    location
  }
}
```

If successful `session.isLoggedIn` will be `true` and we'll redirect to `/`, which, since we're logged in now, will show different content. 

`/protected` utilizes middleware to ensure only logged in users can see it.

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

async function requireLogin(request) {
  let state = await arc.http.session.read(request)

  if (!state.isLoggedIn) {
    console.log(`Attempt to access protected page without logging in!`)
    // Return a response, so middleware processing ends
    return {
      status: 302,
      location: url(`/`)
    }
  }
  console.log(`We're logged in`)
  // return nothing, so middleware processing continues
}

async function showProtectedPage(request) {
  console.log(`Showing dashboard`)

  let protectedPage = `
	<body>
		<h1>Dashboard</h1>
		<p>Only logged in users can visit this page!</p>
		<p><a href="${url('/logout')}">logout</a></p>
	</body>`
  return respond.makeResponse(protectedPage)
}

exports.handler = arc.middleware(requireLogin, showProtectedPage)

```

Logging out just resets the `session` and redirects back to `/`.

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function route(request) {
  let session = await arc.http.session.read(request)
  session.isLoggedIn = false
  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: 302,
    location: url('/')
  }
}

```

And that's it! Remember you can find [the oauth guide here](https://learn.begin.com/basic/state/oauth)
