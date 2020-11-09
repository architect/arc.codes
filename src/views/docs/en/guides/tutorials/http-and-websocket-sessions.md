---
title: HTTP & WebSocket sessions
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - HTTP sessions
  - WebSocket sessions
---

## Overview

Developing database backed stateful web applications used to require a web server, a database server, a whole supporting cast of software and frameworks and all the near-constant maintenance those things required. Now anyone with a text editor can handle POST requests directly with a Lambda function and API Gateway.

The first primitive to understand for building stateful interactions on the web is session state. HTTP is a stateless protocol which is a fancy way of saying every HTTP request is like a completely clean slate. If we want to remember things between HTTP requests you need a session.

In this tutorial, we will go over several ways to store session state within your app. There is an example app at the end that we will build to display how sessions work within Architect.

**Sections**
[HTTP sessions](#http-sessions)
[Database Sessions](#database-sessions)
[WebSocket sessions](#websocket-sessions)
[Strong Key](#strong-key)
[Common Session Use Cases](#common-session-use-cases)
[Example](#example)

---

## HTTP sessions

All `@http` defined routes are session capable via `@architect/functions`

- Requests are tagged to a session via a stateless, signed, encrypted, httpOnly cookie `_idx`
- Session data expires after a week of inactivity

This allows you to write fully stateful applications despite Lambda functions being completely stateless. 

Read the session:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  // reads the session from DynamoDB
  let session = await arc.http.session.read(req)
  return {
    type: 'text/html; charset=utf8',
    body: `<pre>${JSON.stringify(session, null, 2)}</pre>`
  }
}
```

Write the session:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  // reads the session from DynamoDB
  let session = await arc.http.session.read(req)

  // modify the state
  session.count = (session.count || 0) + 1
  // save the session state to DynamoDB
  let cookie = await arc.http.session.write(session)
  let status = 302
  let location = '/'
  // respond (and update the session cookie)
  return {cookie, status, location}
}
```

---

## Database Sessions

If you have stricter security requirements and do not want to expose any session state to clients you can opt into sessions backed by DynamoDB tables.

You'll need to define a session table in your `app.arc` file with `_idx` partition key and `_ttl` attribute for token expiry:

```bash
@app
testapp

@http
get /

@tables
session
  _idx *String
  _ttl TTL
```

Run `npx create` to generate the session database tables. Next opt your Lambda functions into using that table by overriding `SESSION_TABLE_NAME`:

```bash
npx env staging SESSION_TABLE_NAME jwe
npx env production SESSION_TABLE_NAME testapp-production-session
```

This will sync all production lambdas to use the DynamoDB table while testing and staging environments will continue to use the stateless cookie. If you add new routes you will need to remember to sync by running `npx env verify`.

---

## WebSocket sessions

ADD ME!

---

## Strong Key

Ensure your app has a strong secret key:

```bash
npx env production ARC_APP_SECRET something-much-better-than-this
```

Environment variables are automatically synced with all your lambda functions. When you add new functions you will need to sync their env variables by running `npx env verify`. 

---

## Common Session Use Cases

- Authentication
- Error messages
- Shopping carts

> See [the sessions reference](/reference/http-session) for more details.

---

## Example

1.) Create a fresh Architect project

```bash
mkdir -p ./mysesh
cd mysesh
```

2.) Create a `app.arc` file

```bash
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

3.) Add the `@architect/functions` runtime helper library to your functions. This gives the request object a method to read and write sessions.

```bash
cd src/http/get-index
npm init -f
npm i @architect/functions

cd ../post-count
npm init -f
npm i @architect/functions

cd ../post-reset
npm init -f
npm i @architect/functions
```

4.) Add `src/http/get-index/render.js` with plain vanilla HTML forms for adding and resetting the session

```javascript
// this is perfectly acceptable and FAST server side rendering 

module.exports = function render({count}) {
  return `<!doctype html>
<html>
<body>
<form method=post action=/count>
  <button>Count ${count}</button>
</form>
<form method=post action=/reset>
  <button>Reset</button>
</form>
</body>
</html>
    `
}
```

5.) Modify `src/http/get-index/index.js` to read the session if it exists and render the forms with the session state

```javascript
let arc = require('@architect/functions')
let render = require('./render')

async function home(req) {
  let count = req.session.count || 0
  return {
    html: render({ count })
  }
}

exports.handler = arc.http.async(home)
```

6.) Modify `src/http/post-count/index.js` to mutate the session and redirect home


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

7.) Modify `src/http/post-reset/index.js` to clear the session state

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

> For more information about `arc.http.async` helper, [check out the documentation](https://arc.codes/reference/functions/http/node/async)

8.) Initialize a `package.json` in the root of your project, and install `@architect/sandbox` for a local development server

```bash
npm init -f
npm install @architect/sandbox
```

9.) Add a start command to the scripts section in `package.json` found at the root of your project

```bash
...
"scripts": {
  "start": "sandbox"
}
...
```

10.) Preview by starting the dev server

```bash
npm start
```