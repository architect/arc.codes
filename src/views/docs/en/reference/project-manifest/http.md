---
title: '<code>@http</code>'
category: app.arc
description: Define HTTP routes
---

Define HTTP routes in API Gateway with Lambda handler functions.

## Syntax

Each route is made up of two parts: HTTP verb and a route path.

- HTTP Verb
  - `delete`
  - `get`
  - `head`
  - `options`
  - `patch`
  - `post`
  - `put`
  - `any`<sup>1</sup>

- Route Path
  - Lower + upper case alphanumeric string
  - Advised maximum of 100 characters for paths
  - Dashes, periods, and underscores are allowed
  - Must begin with a letter
  - URL parameters are defined with a leading colon (`:`)
  - A trailing asterisk (`*`) denotes a "catchall" (and can only be used as the final character)

Routes can use more verbose configuration to allow for [custom source paths](../../guides/developer-experience/custom-source-paths) in your project. Provide a `method` and `src` for each route:

- `method` - HTTP verb
- `src` - path to the function source

1. While not an HTTP verb, functions declared with `any` will be called for any valid HTTP method directed at that route.

## Example

These configuration examples show how to define `@http` routes:

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
get /pages
get /pages/:dateID
get /contact
post /contact
get /widgets/* # catch all unmatched routes
# verbose custom source:
/weather
  method get
  src custom/source
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
    ["get", "/"],
    ["get", "/pages"],
    ["get", "/pages/:dateID"],
    ["get", "/contact"],
    ["post", "/contact"],
    ["get", "/widgets/*"],
    {
      "/weather": {
        "method": "get",
        "src": "custom/source",
      }
    },
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
app: myapp
http:
- get: "/"
- get: "/pages"
- get: "/pages/:dateID"
- get: "/contact"
- post: "/contact"
- get: "/widgets/*"
# verbose custom source:
- "/weather":
    method: get
    src: "custom/source"
```
</div>
</arc-tab>

</div>
</arc-viewer>

Running `arc create` generates the following handlers:

```bash
/
├── custom/
│   └── source/
├── src/http/
│   ├── get-index/
│   ├── get-pages/
│   ├── get-pages-000dateID/
│   ├── get-contact/
│   ├── get-widgets-catchall/
│   └── post-contact/
├── app.arc
└── package.json
```

> ⚠️  Handlers generated from routes with URL parameters i.e. `/pages/:dateID`, substitute `:` for `000`.
> This is a deliberate convention to ensure valid directory names that correspond with your defined parameterized route.
