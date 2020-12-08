---
title: arc.http.proxy
description: proxy the public/ folder at the root of your app
sections:
  - Overview
  - Bucket
  - SPA
  - Folder
  - Reading static assets
---

## Overview

`arc.http.proxy` is the primary interface for reading static assets out of S3. 

This means your single page application and API can share the same domain name, session support and database access *without CORS* and *without 3rd party proxies*.

## Bucket

ADD ME!

## SPA

Given the following `app.arc` file:

```bash
@app
spa

@http
get /

@static
staging my-staging-bucket-name
production my-production-bucket-name
```

And to proxy all requests to S3:

```javascript
// add this to `src/http/get-index/index.js
let arc = require('@architect/functions')

exports.handler = arc.proxy.public({spa:true})
```

Setting `{spa:false}` will fall back to normal 404 behavior. If `/public/404.html` is defined that file will be used.

## Folder

ADD ME!


## Reading static assets

Read a file from the `app.arc` defined static buckets:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let index = await arc.proxy.read('index.tsx')
  let html = transpiler(index)
  return html
}
```
