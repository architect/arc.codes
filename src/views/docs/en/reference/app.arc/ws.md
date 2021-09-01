---
title: '@ws'
description: Define WebSocket endpoints
---

Define WebSocket endpoint and Lambda handler functions.

### Example

This `app.arc` file defines both HTTP and WebSocket endpoints:

<arc-viewer default-tab=arc>
<div slot=contents class=bg-g4>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
myapp

@ws

```

</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "architect": {
    "app": "myapp"
    "ws": {}
  },
  "start": "npx sandbox",
  "dependencies": {
    "@architect/architect": "latest"
  }
}
```

</div>
</arc-tab>

<arc-tab label=toml>
<h5>toml</h5>
<div slot=content>

```toml
app="testapp"

"ws"
```

</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yml
---
app: testapp

ws: ~
```

</div>
</arc-tab>

</div>
</arc-viewer>

Running `arc create` generates the following functions:

```bash
/
├── ws
│   ├── connect
│   ├── default
│   ├── disconnect
├── app.arc
└── package.json
```

Each function responds to WebSocket events from a client.

In the [payload delivered to the function](#function-payload) there is a `connectionId` that uniquely identifies a client. This `connectionId` can be used to send messages to the correct client.

### Functions

The functions created by the `@ws` pragma handle events from a WebSocket client.

* Connect - This function is invoked when a WebSocket client connects to the application
* Default - This function is invoked when a WebSocket client sends a message to the application
* Disconnect - This function is invoked when a WebSocket client disconnects from your application

#### Function Payload

|Argument|Description|
|---|---|
|`req`|The WebSocket request payload|
|`req.requestContext.connectionId`|An id that uniquely identifies a client|

#### Send Messages

To publish a message to a WebSocket client you can use arc's runtime library `@architect/functions`' `ws.send` method. You can call this method from any of your application's functions.

Docs: [node](/docs/en/reference/runtime/node.js#arc.ws) - [ruby](/docs/en/reference/runtime/ruby#arc.ws) - [python](/docs/en/reference/runtime/python#arc.ws)
