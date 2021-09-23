---
title: '@http'
category: app.arc
description: Define HTTP routes
---

Define HTTP routes in API Gateway with Lambda handler functions.

## Syntax

Each route is made up of by two parts: `verb` & `path`

- HTTP Verb
  - `get`
  - `post`
  - `put`
  - `patch`
  - `delete`

- Path
  - Dashes and underscores are not allowed
  - Must begin with a letter
  - URL parameters are defined with a leading colon (`:`)

### Additional bits

- Advised maximum of 100 characters

## Example

These configuration examples show how to define `@http` routes:

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
get /pages
get /pages/:dateID
get /contact
post /contact
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
    ["get", "/"].
    ["get", "/pages"],
    ["get", "/pages/:dateID"],
    ["get", "/contact"],
    ["post", "/contact"]
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
  ["get", "/"],
  ["get", "/pages"],
  ["get", "/pages/:dateID"],
  ["get", "/contact"],
  ["post", "/contact"]
]
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
```
</div>
</arc-tab>

</div>
</arc-viewer>

Which generates the following scaffolding:

```bash
/
├── http
│   ├── get-index/
│   ├── get-pages/
│   ├── get-pages-000dateID/
│   ├── get-contact/
│   └── post-contact/
├── app.arc
└── package.json
```

> ⚠️  Handlers generated from routes with URL parameters i.e. `/pages/:dateID`, substitute `:` for `000`.
>
> This is a deliberate convention to ensure valid directory names that correspond with your defined parameterized route.
