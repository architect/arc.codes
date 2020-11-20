---
title: Implementing CORS
description: If your application reaches across domains to request resources, you'll need to use CORS
sections:
  - Overview
  - TBD
---

## Overview

Cross-origin resource sharing (CORS) is a mechanism that that uses additional HTTP headers to tell browsers to give a web application running at one origin access resources from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos.

## Example

Let's first create an `app.arc` app with a very simple JSON API endpoint:

```bash
@app
testapp

@http
get /
get /js/:file
get /api
```

The home route loads some basic HTML content:

```javascript
// src/http/get-index/index.js

exports.handler = async function http(req) {
  let stage = process.env.NODE_ENV
  return {
    type: 'text/html; charset=utf8',
    body: `
      <!doctype html>
      <html>
      <body>
      <h1>yo</h1>
      <script type=module src=/${stage}/js/index.mjs></script>
      </body>
      </html>
    `
  }
}
```

The JS route returns a client-side ES Module:

```javascript
// src/http/get-js/index.js

let fs = require('fs')
let read = file=> fs.readFileSync(`${__dirname}/${file}`).toString()
let allow = ['index.mjs']
let cache = {}

exports.handler = async function http(req) {

  // declare our content-type
  let type = 'text/javascript; charset=utf8'

  try {
    // check for a legit file
    let file = req.params.file
    if (!file || !allow.includes(file))
      throw Error(`${file} not found`)

    // cache if not cached
    if (!cache[file])
      cache[file] = read(file)

    return {
      type,
      status: 200,
      body: cache[file]
    }
  }
  catch(e) {
    return {
      type,
      status: 404,
      body: `console.log("${e.message}")`
    }
  }
}
```

It is possible to write a very elaborate `read` function. Give `sucrase` a try for transpiling jsx, tsx, and flow. `Babel` and `Rollup` work within AWS Lambda too. These tools can run within acceptable time, and content can be cached between warm executions making a very fast dynamic asset build chain.

For this example, we'll start with the following client-side source:

```javascript
// /js/index.mjs

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

exports.handler = async function http(req) {
  return {
    cors: true,
    type: 'application/json',
    body: JSON.stringify({msg: 'hello world'})
  }
}
```

> 🌟 Source for this example at [architect/arc-example-cors](https://github.com/architect/arc-example-cors)


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


## Conclusion

With CORS implemented, you can now make full use of your `app.arc` application within your existing static sites or client-side applications.

This is a great way to ease into using cloud functions, or adding backend functionality to an otherwise static site.

---

