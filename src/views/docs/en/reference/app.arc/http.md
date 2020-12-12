---
title: '@http'
description: Pragma for defining http routes
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@http` section defines HTTP routes

## Syntax

Each route is defined by two parts: `verb` & `route`

- Valid HTTP Verb
  - `get`
  - `post`
  - `put`
  - `patch`
  - `delete`

- Route
  - Dashes and underscores are not allowed
  - Must begin with a letter
  - URL parameters are defined with a leading colon (`:`)

### Additional bits

- Advised maximum of 100 characters

## Example

These configuration examples show how to define http routes:


<h5>arc</h5>

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

<h5>json</h5>

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

<h5>toml</h5>

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

<h5>yaml</h5>

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

> Note: Handlers generated from routes with a URL parameters i.e. `/pages/:dateID`, substitue `:` for `000`. This is a deliberate convention to make ensure valid directory names.
