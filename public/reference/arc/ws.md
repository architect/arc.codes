# `@ws`

## `@ws` section defines WebSocket handlers


### Example

This `app.arc` file defines both HTTP and WebSocket endpoints:

```arc
@app
testapp

@ws
# no other config required

@http
get /
```

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

---
