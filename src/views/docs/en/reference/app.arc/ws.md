---
title: '@ws'
description:
---

Define WebSocket endpoint and Lambda handler functions.

### Syntax

No other config required

### Example

This `app.arc` file defines both HTTP and WebSocket endpoints:

<arc-tab-bar>

<arc-tab label=arc>

  <h5>arc</h5>

  <div slot=content>

```arc
@app
myapp

@http
get /

@ws
# no other config required

```

  </div>

<arc-tab>

<arc-tab label=json>

  <h5>json</h5>

  <div slot=content>

```json
{
  "architect": {
    "app": "myapp",
    "http": [
      [ "get", "/" ]
    ],
    "ws": {}
  },
  "start": "npx sandbox",
  "dependencies": {
    "@architect/architect": "latest"
  }
}
```

  </div>

<arc-tab>

<arc-tab label=toml>

  <h5>toml</h5>

  <div slot=content>

```toml
app="testapp"

http=[
 [ "get", "/" ]
]

"ws"
# no other config required
```

  </div>

<arc-tab>

<arc-tab>

<arc-tab label=yaml>

  <h5>yaml</h5>

  <div slot=content>

```yml
---
app: testapp

http:
- get: "/"

ws: ~
# no other config required
```

  </div>

<arc-tab>

<arc-tab-bar>

Running `arc create` generates the following functions:

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
