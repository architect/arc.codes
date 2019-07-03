# Web Sockets

## Real time web apps composed of tiny functions

The `@ws` primitive creates a web socket endpoint and handler functions. Web socket functions are deployed as AWS Lambda functions wired with API Gateway to send and receive web socket events: `connect`, `disconnect` and `default`. 

---

- <a href=#local><b>🚜 Work Locally</b></a> 
- <a href=#req><b>🛫 Event Payload</b></a>
- <a href=#res><b>🛬 Browser Implementation</b></a>

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

## Browser Implementation

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
<script type=module src=/index.mjs></script>
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

# Summary 

## `ws-connect`

The `ws-connect` Lambda is primarily intended to verify `event.header.Origin`. 

## `ws-default`

The `ws-default` Lambda will be the main event bus for web socket events. The `event.requestContext.connectionId` variable is used for determining the current web socket.

## `ws-disconnect`

The `ws-disconnect` Lambda is used to cleanup any records of `event.requestContext.connectionId`.

> 🔭 Find [the example repo on GitHub](https://github.com/architect/arc-example-ws).

