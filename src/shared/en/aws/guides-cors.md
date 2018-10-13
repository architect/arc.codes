# Implement CORS

> CORS is required if your application reaches across domains to request resources

Let's first create a `.arc` app with a very simple JSON API endpoint:

```arc
@app
testapp

@http
get /
get /api
```


The home route `src/http/get-index` loads some basic HTML content:

```javascript
exports.handler = async function http(req) {
  return {
    type: 'text/html',
    body: ''
  }
}
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

This is a great way to ease into using cloud functions, or adding some "server-side" functionality to an otherwise static site.
