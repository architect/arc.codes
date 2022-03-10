---
title: Adding WebSockets to your app
category: Frontend
description: Add real-time connections between clients with cloud functions.
sections:
  - Overview
  - Connecting to your WebSocket
  - Implementing sessions
---

## Overview

The [`@ws`](/docs/en/reference/arc-pragmas/@ws) primitive creates a WebSocket endpoint and stateless handler functions:

- **`connect`**: This handler function is used when a client first connects to your WebSocket API.
- **`disconnect`**: This handler function is used when a client disconnects from your API.
- **`default`**: Used when the route selection expression produces a value that does not match any of the other route keys in your API routes. This can be used, for example, to implement a generic error handling mechanism.

These handler functions allow you to hold a long lived state connection between two different endpoints.

**Sections**
  - [Overview](#overview)
  - [Connecting to your WebSocket](#connecting-to-your-websocket)
  - [Implementing sessions](#implementing-sessions)

## Connecting to your WebSocket

`app.arc` abstracts API Gateway configuration and provisioning, while `@architect/functions` (optionally) adds a very light but powerful API shim to Lambda for working with WebSockets

Given the following example `app.arc` file:

```arc
@app
testapp

@ws
# no further config required

@http
get /
```

Architect generates the following functions:

- `src/ws/ws-connect` invoked when the web socket is connected
- `src/ws/ws-default` invoked whenever a message is sent
- `src/ws/ws-disconnect` invoked when disconnected

Web socket functions are always invoked with an `event` payload that contains useful information:

- `event.requestContext.connectionId` the currently executing web socket connection
- `event.requestContext.apiId` the currently executing web socket `apiId`
- `event.body` the message payload

```javascript
exports.handler = async function ws(event) {
  // event.requestContext.connectionId
  // event.requestContext.apiId
  // event.body
  return {statusCode: 200}
}
```

By default, WebSocket functions are dependency free with a minimal, but very powerful, low level API.

## Implementing sessions

Render the app HTML shell and embed the current web socket URL in a global `WS_URL`.

```javascript
// src/http/get-index/index.js

let getURL = require('./get-web-socket-url')

// renders the html app chrome
exports.handler = async function http(req) {
  return {
    type: 'text/html; charset=utf8',
    body: `
<!doctype html>
<html>
  <body>
    <h1>Web sockets</h1>
    <main>Loading...</main>
    <input
      id=message
      type=text
      placeholder="Enter message"
      autofocus
    >
    <script>
      window.WS_URL = '${ getURL() }'
    </script>
    <script type=module src=/index.mjs></script>
  </body>
</html>
  `
  }
}
```

The URL lookup code could use environment variables if hardcoding seems rash.

```javascript
// src/http/get-index/get-web-socket-url.js

module.exports = function getWS() {
  let env = process.env.ARC_ENV
  let testing = 'ws://localhost:3333'
  let staging = 'wss:// fixme: these urls are printed after create'
  let production = 'wss:// fixme: these urls are printed after create'
  if (env === 'testing')
    return testing
  if (env === 'staging')
    return staging
  if (env === 'production')
    return production
  return testing
}
```

We'll put the browser JavaScript in `public/index.mjs`:

```javascript
// public/index.mjs

// get the web socket url from the backend
let url = window.WS_URL

// all the DOM nodes this script will mutate
let main = document.getElementsByTagName('main')[0]
let msg = document.getElementById('message')

// setup the web socket
let ws = new WebSocket(url)
ws.onopen = open
ws.onclose = close
ws.onmessage = message
ws.onerror = console.log

// connect to the web socket
function open() {
  let ts = new Date(Date.now()).toISOString()
  main.innerHTML = `<p><b><code>${ ts } - opened</code></b></p>`
}

// report a closed web socket connection
function close() {
  main.innerHTML = 'Closed <a href=/>reload</a>'
}

// write a message into main
function message(e) {
  let msg = JSON.parse(e.data)
  main.innerHTML += `<p><code>${ msg.text }</code></p>`
}

// sends messages to the lambda
msg.addEventListener('keyup', function(e) {
  if (e.key == 'Enter') {
    let text = e.target.value // get the text
    e.target.value = ''       // clear the text
    ws.send(JSON.stringify({ text }))
  }
})
```

> The `/public/index.mjs` path assumes `@static` setup S3 buckets to serve browser code; you can also setup an `@http` function to serve `text/javascript` code.

## `ws-connect`

The `ws-connect` Lambda is primarily intended to verify `event.header.Origin`.

## `ws-default`

The `ws-default` Lambda will be the main event bus for web socket events. The `event.requestContext.connectionId` variable is used for determining the current web socket.

## `ws-disconnect`

The `ws-disconnect` Lambda is used to cleanup any records of `event.requestContext.connectionId`.

> 🔭  Find [the example repo on GitHub](https://github.com/architect/arc-example-ws).
