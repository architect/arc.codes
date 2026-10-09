---
title: '<code>@proxy</code>'
category: app.arc
description: Define a forwarding URL
---

Defines a URL for API Gateway to forward all requests by default. Override with routes in `@http`.

## Syntax

- Stage value of either *testing*, *staging* or *production*
- URL to proxy to

## Example

The following configuration file defines a `@proxy` for production that will handle requests for routes not defined in the `@http` section.

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
myapp

@http
get /v2/*
post /v2/*

@proxy
testing http://localhost:4000
staging https://qa.example.biz
production https://example.biz
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
    ["get", "/v2/*"],
    ["post", "/v2/*"]
  ],
  "proxy": {
    "testing": "http://localhost:4000",
    "staging": "https://qa.example.biz",
    "production": "https://example.biz"
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
app: myapp
http:
- get: "/v2/*"
- post: "/v2/*"

proxy:
  testing: http://localhost:4000
  staging: https://qa.example.biz
  production: https://example.biz
```
</div>
</arc-tab>

</div>
</arc-viewer>

With the above Architect file, your new app will respond to all get and post requests to `/v2/*`, and forward along requests to `/v1` to your existing API.
