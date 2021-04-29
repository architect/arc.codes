---
title: '@views'
description: Share view code across `@http` functions
---

Configure the location of view code.
Architect copies view code to all HTTP GET handler functions by default.
You can also specify only the routes you want views copied to with the `@views` pragma.

## Syntax

- Routes should be existing `@http` routes.
- Route names follow the same requirements as `@http` routes. [see `@http`](@http)

## Example

This `app.arc` file defines specific `@http` functions to copy `src/views/` to:

<arc-viewer default-tab=arc>
<div slot=contents class=bg-g4>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
myapp

@http
get /
get /kittens
get /dogs
get /raccoons

@views
get /kittens
get /raccoons
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "myapp",
  "http": [
    [ "get", "/" ],
    [ "get", "/kittens" ],
    [ "get", "/dogs" ],
    [ "get", "/raccoons" ]
  ],
  "views": [
    [ "get", "/kittens" ],
    [ "get", "/raccoons" ]
  ]
}
```
</div>
</arc-tab>

<arc-tab label=toml>
<h5>toml</h5>
<div slot=content>

```toml
app="myapp"

http=[
  [ "get", "/" ],
  [ "get", "/kittens" ],
  [ "get", "/dogs" ],
  [ "get", "/raccoons" ]
]

views=[
  [ "get", "/kittens" ],
  [ "get", "/raccoons" ]
]

```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yml
---
app: testapp

http:
- get: "/"
- get: "kittens"
- get: "dogs"
- get: "raccoons"

views:
- get: "kittens"
- get: "raccoons"
```
</div>
</arc-tab>

</div>
</arc-viewer>
