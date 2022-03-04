---
title: Cloud function middleware
category: Frontend
description: Short Tutorial showing both async/await and callback-style runtime helpers to modify request objects.
sections:
  - Overview
  - arc.http.async
  - arc.http
  - Example
---

## Overview

Architect provides two optional middleware helpers for cutting down on boilerplate HTTP operations by using the [`@architect/functions`](https://github.com/architect/functions) library.

- [`arc.http.async`](/docs/en/reference/macros/runtime-helper-reference/arc-http-async) is an `async/await` style middleware API
- [`arc.http`](/docs/en/reference/macros/runtime-helper-reference/arc-http) is a classic callback-style middleware API

Both middleware helpers conveniently attach user sessions to the incoming `request` object (if applicable), and decode and parse the `request` body (again, if applicable).

`@http` functions are executed in a stateless and short lived environment. It is unreliable to chain `@http` functions together without a data store, message bus, or client session in-between because any errors will fail silently by default. You should plan your function to not be dependent on the output from previous functions. By catching the request object and safely passing it around in middleware functions, you can more easily trace errors and choose when to fan out the work.

**Sections:**

  - [Overview](#overview)
  - [arc.http.async](#arc.http.async)
  - [arc.http](#arc.http)
  - [Example](#example)

## `arc.http.async`

Combine multiple `async/await` operations in a single HTTP function handler.

`arc.http.async()` accepts `async` functions as arguments, and returns a Lambda compatible function signature. These functions will be run in series and allow you to transform the request object with multiple async functions before emitting a `response` to the client.

### Example

Here's an example in which we'll register `addCountryCode`, `validateUser`, and `showDashboard` functions to run in series.

- `addCountryCode` adds `countryCode` to our `request`
- `validateUser` will return a redirect response if the user is not logged in (ending `arc.http.async` processing), or return nothing if the user is logged in (continuing execution)
- `showDashboard` will show a dashboard for users, since we know they're logged in

1. Create a new Architect project with `arc init` in your terminal.

```bash
mkdir arc-async-middleware
cd arc-async-middleware
arc init
```

2. Replace the `app.arc` file with the following:

```arc
# app.arc file
@app
arc-async

@http
get /
get /dashboard
```

3. Run `arc create` to generate the folder structure and some template code.

4. You should now see two HTTP functions, `get-index` and `get-dashboard`.

5. In order to use the runtime helpers, we have to install `@architect/functions` and require it at the top of the file. Each HTTP function as a self contained unit, so any dependencies you need must be present within the function folder.

```bash
cd src/http/get-dashboard
npm init -y
npm install @architect/functions
```

6. Let's go ahead and replace the contents of `src/http/get-dashboard/index.js` with the following:

```javascript
// src/http/get-dashboard/index.js

let arc = require('@architect/functions')

// Add a 'countryCode' attribute to the request
async function addCountryCode(request) {
  // AWS already does this with req.headers['CloudFront-Viewer-Country']
  // but for other cloud providers you can use your preferred geoIP module
  // ... or just pretend everyone is in New Zealand!
  request.countryCode = 'NZ'
  // The modified request will be used in subsequent steps
  return request
}

// Check to see if the user in a query string is on the authorized list
async function validateUser(request) {
  let user = request.query.user
  let authorized = ['nic_cage']

  if(!authorized.includes(user)) {
    console.log(`You are not authorized`)
    return {
      status: 200,
      body: `Meditate further for authorization`
    }
  }
  console.log(`nic_cage is authorized`)
  //return nothing, so execution continues
}

// Show a HTML page. If we've reached this step we know the user is logged in, and we know their country code!
async function showDashboard(request) {
  console.log(`Showing dashboard`)
  let body = `
  <body>
    <h1>Dashboard</h1>
    <p>Hi! ${request.query.user} You are logged in from ${request.countryCode}! <a href="/logout">logout</a><p>
  </body>`
  return {
    status: 200,
    type: 'text/html',
    body
  }
}

exports.handler = arc.http.async(addCountryCode, validateUser, showDashboard)
```

In a single handler, we can add a country code to the `request` object, pass it to an authentication function, and finally build a `response` back to the client.

6. Now let's try it using Sandbox, our local dev environment.

```bash
cd /arc-async-middleware
arc sandbox
```
Navigate to `http://localhost:3333/dashboard?user=nic_cage` and you should see the final HTML come through. If you change the query string to another user, like `user=paul`, it will fail. The arc.http.async API works well with the shared folder to do things like re-use `validateUser` to protect multiple HTTP functions.

### Common use cases for `arc.http.async`

- Authentication as shown above.
- Tracking user interactions (kick off a `@event` to save something to the database without blocking the request)
- Adding additional information to requests

---

## `arc.http`

`arc.http` is a classic continuation-passing style middleware API. It registers one, or more, functions with the signature `(req, res, next)=>`.
This type of middleware can execute code, make changes to the request objects, and call the next middleware function that is registered.

- HTTP `POST` routes can **only** call `res` with `location` key and value of the path to redirect to.
- `session` can also optionally be set

### Example

In this example we will use the classic HTTP middleware function to render session data with user interaction.

1. Create a new Architect project with `arc init` in your terminal.

```bash
mkdir arc-http-middleware
cd arc-http-middleware
arc init
```

2. Replace the `app.arc` file with the following:

```arc
# app.arc file

@app
arc-http-middleware

@http
get /
post /count
```

3. Run `arc create` to generate the folder structure and some template code.

4. You should now see two HTTP functions, `get-index` and `post-count`.

5. In order to use the runtime helpers, we have to install `@architect/functions` and require it at the top of the file. Each HTTP function as a self contained unit, so any dependencies you need must be present within the function folder.

```bash
cd src/http/get-index
npm init -y
npm install @architect/functions

cd ../post-count
npm init -y
npm install @architect/functions
```
5. Now we can replace the contents of `/src/http/get-index/index.js` with the following:

```javascript
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

6. We can also replace the contents of `/src/http/post-count/index.js` with the following:

```javascript
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

7. Now we can get it running locally to see our results, we'll have to make sure to be in our project root directory and install our local dev server, Sandbox.

``` bash
cd /arc-http-middleware
npm init -y
npm install @architect/sandbox
arc sandbox
```

8. You should now see a page served at `http://localhost:3333` that updates with the number of clicks.

## Things to note about `arc.http`:

- `arc.http` accepts one or more functions that follow Express-style middleware signature: `(req, res, next)=>`
- `req` is a plain JavaScript `Object` with `path`, `method`, `query`, `params`, `body` keys
- `res` is a function that must be invoked with named params:
  - `location` with a URL value (a string starting w `/`)
  - `session` (optional) a plain `Object`
- `res` can also be invoked with an `Error`
  - optionally the `Error` instance property of `code`, `status` or `statusCode` can be one of `403`, `404` or `500` to change the HTTP status code
- `next` (optional) is a function to continue middleware execution

