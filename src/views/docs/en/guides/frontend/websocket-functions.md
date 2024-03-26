---
title: WebSocket functions
category: Frontend
description: WebSockets provide a persistent connection between a client and a server.
sections:
  - Overview
  - Getting started
  - Custom Routes
  - Event Payload
  - Examples
---

## Overview

WebSockets provide a persistent connection between a client and a server. When we need persistent real-time data, we create a web socket server and then a connecting client for the two endpoints to exchange messages back-and-forth.

We accomplish this by using [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html), which assembles client connections for HTTP functions. WebSockets can now be an event source for Lambda. In other words, you can now add WebSockets to your application without running, maintaining, and operating servers / containers / VMs.

Architect provides endpoints pre-configured with Lambda handler functions deployed and ready to iterate, complete with local development and isolated staging and production environments.


### When and why would someone want to use a cloud function WebSocket?

- Your app needs real time push of data; this includes (but is not limited to) web browsers. (Many things speak the `wss` protocol!)
- You desire a stateless runtime execution model for your app layer; your app receives WebSocket events, processes them, possibly communicates back to socket clients by posting through an HTTP API, and then terminates execution
- You want nothing to do with maintaining, patching, or running WebSocket server resources
- You desire usage-based billing and want to only pay for resources in use; horizontal scaling should be transparent with no pre-provisioning of nodes/clusters/instances/VMs/containers in order to operate WebSocket-enabled infra

**Sections**
[Overview](#overview)
[Getting started](#getting-started)
[Custom Routes](#custom-routes)
[Event Payload](#event-payload)
[Examples](#examples)


## Getting started

### Provision

Your `app.arc` manifest file abstracts API Gateway configuration and provisioning, while `@architect/functions` (optionally) adds a very light but powerful API to Lambda for working with WebSockets. You provision WebSocket functions by adding the `ws` pragma to your `app.arc` manifest file.

This `app.arc` file defines both HTTP and WebSocket endpoints:

```arc
@app
testapp

@ws
# no other config required

@http
get /
```

Running `arc init` generates the following functions in your project:

```bash
/
|-src
| |-http
| | '-get-index/
| '-ws
|   |-connect/
|   |-default/
|   '-disconnect/
'-app.arc
```

Architect generates the following predefined routes that can be used: `connect`, `disconnect`, and `default`. In addition, you can create custom routes.

- `src/ws/connect` is invoked when the WebSocket is connected.
- `src/ws/default` is invoked whenever a message is sent.
- `src/ws/disconnect` is invoked when disconnected.

**`connect`**

The `connect` route is called when a persistent connection between the client and a WebSocket API is being initiated.The `connect` Lambda is primarily intended to verify `event.header.Origin`.

**`default`**

The `default` route is called if the route selection expression cannot be evaluated against the message or if no matching route is found. The `default` Lambda will be the main event bus for WebSocket events. The `event.requestContext.connectionId` variable is used for determining the current WebSocket.

**`disconnect`**

The `disconnect` route is called when the client or the server disconnects from the API. The `disconnect` Lambda is used to cleanup any records of `event.requestContext.connectionId`.

**`custom`**

Custom route are called after the route selection expression is evaluated against the message if a matching route is found; the match determines which integration is invoked.

> By default, WebSocket functions are dependency free with a minimal, but very powerful, low level API.

---

## Custom Routes

If you want to invoke a specific integration based on message content, you can do so by creating a custom route.

A custom route uses a route key and integration that you specify. When an incoming message contains a JSON property, and that property evaluates to a value that matches the route key value, API Gateway invokes the integration.

Here is how to specify custom WebSocket route keys:

```arc
@app
testapp

@ws
action
status
join
default
connected
disconnected
```

---

## Event Payload

WebSocket functions are always invoked with an `event` payload that contains useful information:

- `event.requestContext.connectionId` the currently executing WebSocket connection
- `event.requestContext.apiId` the currently executing WebSocket `apiId`
- `event.body` the message payload


### Publish event payload (JSON) to a WebSocket client

Node

```javascript
let arc = require('@achitect/functions')

await arc.ws.send({
  id: event.context.connectionId
  payload: { action: 'ping' },
})
```

Ruby

```ruby
require 'architect/functions'

Arc::WS.send id: event.context.connectionId, payload: { action: 'ping' }
```

Python

```python
import arc.ws

arc.ws.send(id=event.context.connectionId, payload={ 'action': 'ping' })
```

---

## Examples

Render the app HTML shell and embed the current WebSocket URL in a global `WS_URL`.

```javascript
// src/http/get-index/index.js

let getURL = require('./get-web-socket-url')

/**
 * renders the html app chrome
 */
exports.handler = async function http(req) {
  return {
    type: 'text/html; charset=utf8',
    body: `<!doctype html>
<html>
<body>
<h1>WebSockets</h1>
<main>Loading...</main>
<input id=message type=text placeholder="Enter message" autofocus>
<script>
window.WS_URL = '${getURL()}'
</script>
<script type=module src=/_static/index.mjs></script>
</body>
</html>`
  }
}
```

We'll put the browser JavaScript in `public/index.mjs`:

```javascript
// public/index.mjs

// get the WebSocket url from the backend
let url = window.WS_URL

// all the DOM nodes this script will mutate
let main = document.getElementsByTagName('main')[0]
let msg = document.getElementById('message')

// setup the WebSocket
let ws = new WebSocket(url)
ws.onopen = open
ws.onclose = close
ws.onmessage = message
ws.onerror = console.log

// connect to the WebSocket
function open() {
  let ts = new Date(Date.now()).toISOString()
  main.innerHTML = `<p><b><code>${ts} - opened</code></b></p>`
}

// report a closed WebSocket connection
function close() {
  main.innerHTML = 'Closed <a href=/>reload</a>'
}

// write a message into main
function message(e) {
  let msg = JSON.parse(e.data)
  main.innerHTML += `<p><code>${msg.text}</code></p>`
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


### Send Events from Lambda

Send a JSON payload to any `connectionId` from runtime function code.

```javascript
// src/ws/connect

let arc = require('@architect/functions')

exports.handler = async function connected(event) {
  let id = event.requestContext.connectionId
  let payload = { ok: true, ts: Date.now() }
  await arc.ws.send({ id, payload })
  return { statusCode: 200 }
}
```
