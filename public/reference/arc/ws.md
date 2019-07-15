# `@ws`

## `@ws` section defines Web Socket handlers


### Example

This `.arc` file defines both HTTP and Web Socket endpoints:

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
'-.arc
```

---
