---
title: '<code>@views</code>'
category: app.arc
description: Share view code across `@http` functions
---

Configure the location of view code.
Architect copies view code to all HTTP GET handler functions by default.
You can also specify only the routes you want views copied to with the `@views` pragma.
For a full example, see [Sharing Code](../../guides/developer-experience/sharing-code).

## Syntax

- Routes should be existing `@http` routes.
- Route names follow the same requirements as `@http` routes. [see `@http`](http)

## Example

This `app.arc` file defines specific `@http` functions to copy `src/views/` to:

<arc-viewer default-tab=arc>
<div slot=contents>

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

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
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

## Specific function opt-out

A function can be [configured with a `config.arc`](../configuration/function-config#%40arc) to not have `@views` code automatically hydrated.
