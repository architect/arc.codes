---
title: '<code>@ws</code>'
category: app.arc
description: Define WebSocket endpoints
---

Define WebSocket endpoint and Lambda handler functions.

### Example

This `app.arc` file defines both HTTP and WebSocket endpoints:

<arc-viewer default-tab=arc>
<div slot=contents>

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

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: testapp

ws: ~
```

</div>
</arc-tab>

</div>
</arc-viewer>

Running `arc create` generates the following WebSocket handlers, each mapping to a required WebSocket event (referred to as an action):

```bash
/
├── src/ws/
│   ├── connect
│   ├── default
│   └── disconnect
├── app.arc
└── package.json
```

Each handler responds to WebSocket actions from clients. In the [payload delivered to the function](#function-payload) there is a `connectionId` that uniquely identifies a client. Use this `connectionId` to send messages to the correct client (if needed).


### Default actions

Each action handler created by the `@ws` pragma receives events from WebSocket clients.

- `connect` - Invoked when a WebSocket client connects to the application
- `default` - Invoked when a WebSocket client sends any (un-routed) message to the application
- `disconnect` - Invoked when a WebSocket client disconnects from your application


### Custom actions

In addition to the three default WebSocket actions (`connect`, `default`, `disconnect`), you can create custom actions to be routed via message payloads like so:

```arc
@ws
some-custom-action
another-custom-action
```

These will generate additional handlers in your `src/ws` dir (e.g. `src/ws/some-custom-action/`). Custom action invocation routing is performed by sending a JSON payload with the corresponding `action` property; for example:

```javascript
// Assuming the client is already connected
ws.send(JSON.stringify({
  whatever: 'some data'
})) // Invokes `default`

ws.send(JSON.stringify({
  action: 'some-custom-action',
  whatever: 'related data'
})) // Invokes `some-custom-action`
```


#### Payload

WebSocket event payloads may contain a fair bit of data, but here are a few key bits:

| Argument | Description |
| --- | --- |
| `req` | The WebSocket request payload |
| `req.requestContext.connectionId` | An ID that uniquely identifies the client |
| `req.body` | Body payload sent by the client (if present) |


#### Send messages

To publish a message to a WebSocket client you can use Arc's runtime library `@architect/functions`' `ws.send` method. You can call this method from any of your application's functions so long as you have a valid `connectionId`.

Docs: [Node.js](/docs/en/reference/runtime-helpers/node.js#arc.ws) | [Ruby](/docs/en/reference/runtime-helpers/ruby#arc.ws) | [Python](/docs/en/reference/runtime-helpers/python#arc.ws)
