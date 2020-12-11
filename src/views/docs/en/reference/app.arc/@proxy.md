---
title: '@proxy'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@proxy` defines a url to forward requests to

## Syntax

- Stage value of either *staging* or *production*
- URL to proxy to

## Example

The following configuration file defines a `@proxy` for production that will handle requests for routes not defined in the `@http` section.

<arc-tab-bar>

<arc-tab label="arc">

  <h5>arc</h5>

  <div slot="content">

```arc
@app
myapp

@http
get /v2/*
post /v2/*

@proxy
production https://apiurl
```
  </div>

</arc-tab>

<arc-tab label="json">

  <h5>json</h5>

  <div slot="content">

```json
{
  "app": "myapp",
  "http": [
    ["get", "/v2/*"],
    ["post", "/v2/*"]
  ],
  "proxy": {
    "production": "https://apiurl"
  }
}
```

  </div>

</arc-tab>

<arc-tab label="toml">

  <h5>toml</h5>

  <div slot="content">

```toml
app="myapp"

http=[
  ["get", "/v2/*"],
  ["post", "/v2/*"]
]

[proxy]
production="https://apiurl"
```

  </div>

</arc-tab>

<arc-tab label="yaml">

  <h5>yaml</h5>

  <div slot="content">

```yaml
app: myapp
http:
- get: "/v2/*"
- post: "/v2/*"

proxy:
  production: "https://apiurl"
```

  </div>

</arc-tab>

<arc-tab-bar>

With the above Architect file, your new app will respond to all get and post requests to `/v2/*`, and forward along requests to `/v1` to your existing API.
