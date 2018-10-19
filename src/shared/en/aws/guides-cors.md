# Implement CORS

> 🦅 CORS is required if your application reaches across domains to request resources

Let's first create a `.arc` app with a very simple JSON API endpoint:

```arc
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

The js route returns a clientside esmodule:

```javascript
// src/http/get-index/index.js
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

It is possible to write a very elaborate `read` function. Give `sucrase` a try for transpiling jsx, tsx and flow. `Babel` and `Rollup` work within AWS Lambda too. These tools can run within acceptable time, and content can be cached between warm executions making a very fast dynamic asset build chain.

For this example, we'll start with the following clientside source:

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
exports.handler = async function http(req) {
  return {
    cors: true,
    type: 'application/json',
    body: JSON.stringify({msg: 'hello world'})
  }
}
```

> 🌟 Source for this example at https://github.com/arc-repos/arc-example-cors

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

With CORS implemented, you can now make full use of your `arc` application within your existing static sites or client-side applications.

This is a great way to ease into using cloud functions, or adding backend functionality to an otherwise static site.
