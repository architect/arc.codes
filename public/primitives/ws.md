# Web Sockets

## Real time web apps with stateless cloud functions

The `@ws` primitive creates a web socket endpoint and stateless handler functions: `connect`, `disconnect` and `default`. 

---

- <a href=#local><b>🚜 Work Locally</b></a> 
- <a href=#provision><b>🌾 Provision</b></a> 
- <a href=#deploy><b>⛵️ Deploy</b></a>
- <a href=#event><b>🎉 Event Payload</b></a>
- <a href=#browser><b>🧭 Browser Implementation</b></a>
- <a href=#send><b>🧁 Send Events from Lambda</b></a>
- <a href=#custom><b>🚙 Custom Routes</b></a>

---

<h2 id=local>🚜 Work Locally</h2>

An example `.arc` file:

```arc
@app
testapp

@ws
# no further config required

@http
get /
```

Architect generates the following functions:

- `src/ws/connect` invoked when the web socket is connected
- `src/ws/default` invoked whenever a message is sent
- `src/ws/disconnect` invoked when disconnected

## `connect`

The `connect` Lambda is primarily intended to verify `event.header.Origin`. 

## `default`

The `default` Lambda will be the main event bus for web socket events. The `event.requestContext.connectionId` variable is used for determining the current web socket.

## `disconnect`

The `disconnect` Lambda is used to cleanup any records of `event.requestContext.connectionId`.

---

<h2 id=provision>🌾 Provision</h2>

Web socket functions generate many supporting AWS resources. Some highlights:

- `AWS::ApiGatewayV2::Route`
- `AWS::ApiGatewayV2::Integration`
- `AWS::ApiGatewayV2::Api`
- `AWS::ApiGatewayV2::Deployment`
- `AWS::ApiGatewayV2::Stage`

Additionally these `AWS::SSM::Parameter` resources are created which can be inspected at runtime:

- **`/[StackName]/ws/https`** with a value like `https://xxx.execute-api.us-west-1.amazonaws.com/production/@connections`
- **`/[StackName]/ws/wss`** with a value like `wss://xxx.execute-api.us-west-1.amazonaws.com/production`

> All runtime functions have the environment variable `AWS_CLOUDFORMATION` which is the currently deployed CloudFormation stack name; this combined w the runtime `aws-sdk` or `@architect/functions` can be used to lookup these values in SSM

---

<h2 id=deploy>⛵️ Deploy</h2>

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy dirty` to overwrite deployed staging lambda functions 
- `arc deploy production` to run a full CloudFormation production deployment

> 🔭 Find [the example repo on GitHub](https://github.com/architect/arc-example-ws).

---

<h2 id=event>🎉 Event Payload</h2>

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

---

<h2 id=browser>🧭 Browser Implementation</h2>

Render the app HTML shell and embed the current web socket URL in a global `WS_URL`.

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
<h1>Web sockets</h1>
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
  main.innerHTML = `<p><b><code>${ts} - opened</code></b></p>`
}

// report a closed web socket connection
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
    ws.send(JSON.stringify({text}))
  }
})
```

---

<h2 id=send>🧁 Send Events from Lambda</h2>

Send a JSON payload to any `connectionId` from runtime function code.

```javascript
// src/ws/connected
let arc = require('@architect/functions')

exports.handler = async function connected(event) {
  let id = event.requestContext.connectionId
  let payload = {ok: true, ts: Date.now()}
  await arc.ws.send({id, payload})
  return {statusCode: 200}
}
```

---

<h2 id=custom>🚙 Custom Routes</h2>

Specify custom web socket route keys:

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

