---
title: Architect sessions
category: Frontend
description: Use HTTP sessions in an Architect project
sections:
  - Overview
  - HTTP sessions
  - Strong secret key
  - Example
---

Developing database-backed, stateful web applications used to require a web server, a database server, a whole supporting cast of software and frameworks and all the near-constant maintenance those things required. Now anyone with a text editor can handle POST requests directly with a Lambda function and API Gateway. Read more about [Functional Web Apps](https://fwa.dev)

The first primitive to understand for building stateful interactions on the web is session state. HTTP is a stateless protocol which is a fancy way of saying every HTTP request is like a completely clean slate. If we want to remember things between HTTP requests you need a session.

This guide will go over several ways to store session state within your app. There is an example app at the end that demonstrates how sessions work within Architect.


## HTTP sessions

All `@http` defined routes are session capable via `@architect/functions`.

- Requests are tagged to a session via a stateless, signed, encrypted, `httpOnly` cookie: `_idx`
- Session data expires after a week of inactivity

This allows you to write fully stateful applications despite Lambda functions being completely stateless.

Manually read and write sessions:

```javascript
// a simple request counter
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  // reads the session from the request
  let session = await arc.http.session.read(req)
  // modify the state
  session.count = (session.count || 0) + 1
  // write the session to a cookie
  let cookie = await arc.http.session.write(session)

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=utf8',
      'set-cookie': cookie
    },
    body: `<pre>${JSON.stringify(session, null, 2)}</pre>`
  }
}
```

Alternatively, use `arc.http[.async]`'s built-in session management for a simpler implementation:

```javascript
let arc = require('@architect/functions')

async function handler(req) {
  let session = req.session
  session.count = (session.count || 0) + 1

  return {
    session,
    html: `<pre>${JSON.stringify(session, null, 2)}</pre>`
  }
}

exports.handler = arc.http.async(handler)
```

> See [the Node.js sessions reference](../../reference/runtime-helpers/node.js#arc.http.session) for more details on `arc.http` and `arc.http.session`.


## Strong secret key

Ensure your app has a strong secret key. It should have a minimum length of 16 bytes.

```bash
npx arc --env production --add ARC_APP_SECRET something-much-better-than-this
```

Environment variables are automatically synced with all your lambda functions. When you add new functions you will need to sync their env variables by running `npx arc env`.


## Example

1. Create a fresh Architect project

```bash
mkdir -p ./mysesh
cd mysesh
npm init -f
npm install @architect/architect
```

2. Create a `app.arc` file

```arc
@app
bigsesh

@http
get /
post /count
post /reset
```

And generate the boilerplate code by running:

```bash
arc init
```

3. Add the `@architect/functions` runtime helper library to your project. This gives the request object a method to read and write sessions.

```bash
npm i @architect/functions
```

4. Modify `src/http/get-index/index.js` to read the session if it exists and render the forms with the session state

```javascript
let arc = require('@architect/functions')

async function home(req) {
  let count = req.session.count || 0

  return {
    // this is perfectly acceptable and FAST server side rendering
    html: `
<!doctype html>
<html>
  <body>
    <form method=post action=/count>
      <button>Count ${ count }</button>
    </form>
    <form method=post action=/reset>
      <button>Reset</button>
    </form>
  </body>
</html>
    `
  }
}

exports.handler = arc.http.async(home)
```

5. Modify `src/http/post-count/index.js` to mutate the session and redirect home

```javascript
let arc = require('@architect/functions')

async function counter(req) {
  let count = (req.session.count || 0) + 1
  return {
    session: { count },
    location: '/'
  }
}

exports.handler = arc.http.async(counter)
```

> FYI: Per recommended security practice Architect applications use `httpOnly` cookies for storing session state; anyone can implement their own mechanism using Set-Cookie headers directly

6. Modify `src/http/post-reset/index.js` to clear the session state

```javascript
let arc = require('@architect/functions')

async function reset(req) {
  return {
    session: {},
    location: '/'
  }
}

exports.handler = arc.http.async(reset)
```

> For more information about `arc.http.async` helper, [check out the documentation](../../reference/runtime-helpers/node.js#arc.http.async)

7. Preview by starting the dev server

```bash
npx arc sandbox
```

Navigate to `localhost:3333` to test out the counter.
