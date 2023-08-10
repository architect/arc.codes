---
title: Implementing CORS
category: Frontend
---

Cross-origin resource sharing (CORS) is a mechanism that that uses additional HTTP headers to tell browsers to give a web application running at one origin access resources from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos.

With CORS implemented, you can now make full use of your `app.arc` application within your existing static sites or client-side applications.

This is a great way to ease into using cloud functions, or adding backend functionality to an otherwise static site.

```javascript
// /public/index.mjs

async function main() {

  let res = await fetch(`${location.pathname}/api`)
  let result = await res.json()
  console.log('response from /api', result)
}

// whee
main()
```

The API route `src/http/get-api` is CORS enabled with one flag:

```javascript
// src/http/get-api/index.js
let arc = require('@architect/functions')

exports.handler = arc.http(handler)

async function handler (req) {
  return {
    cors: true,
    json: { msg: 'hello world' }
  }
}
```

## Restricting Domains

You can restrict domains within your Lambda function code.

Continuing from the `/api` endpoint, your API might operate differently based on the request's domain of origin:

```javascript
// Example permitted domains

var permittedDomains = [
  'http://localhost:3000',
  'https://example.com'
]

exports.handler = async function http(req) {
  // Things that should only be done for permitted
  // requests. Get data, etc.
  let status = permittedDomains.includes(req.headers.origin)? 200 : 403
  let msg = status === 200? `hello world` : `you don’t have permission to access`
  return {
    status,
    body: JSON.stringify({msg}),
  }
}
```
