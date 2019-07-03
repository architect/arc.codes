# HTTP Functions

## Create powerful web apps composed of fast HTTP functions

Architect apps are composed of high level primitives. For each `@http` defined route Architect will create one HTTP function. HTTP functions are deployed as AWS Lambda functions wired with API Gateway to recieve and respond to regular http (and https) requests. 

---

- <a href=#local><b>🚜 Work locally</b></a> 
- <a href=#provision><b>🌾 Provision AWS Resources</b></a> 
- <a href=#req><b>🛫 Request</b></a>
- <a href=#res><b>🛬 Response</b></a>
- <a href=#examples><b>🎁 Examples</b></a>

---


<h2 id=local>🚜 Work locally</h2>

HTTP functions are defined under `@http` very plainly with one route per line, where a route is defined as an http verb and a path seperated by a space.

An example blogging app `.arc` file:

```arc
@app
testapp

@http
get /
get /about
get /posts/:postID
post /login
post /logout
post /posts
patch /posts/:postID
delete /posts/:postID
```

> It is very clear what this app can do just by reading the `.arc` file

By default, HTTP functions are dependency-free:

Node
```javascript
export.handler = async function http(request) {
  return {statusCode: 200}
}
```

Ruby
```ruby
def handler(request)
  {statusCode: 200}
end
``` 

Python
```python
def handler(request):
  return {'statusCode': 200}
```

Running `arc init` with the arcfile above will generate the following local source code:

- `/src/http/get-index`
- `/src/http/get-about`
- `/src/http/get-posts-000postID`
- `/src/http/post-login`
- `/src/http/post-logout`
- `/src/http/post-posts`
- `/src/http/patch-posts-000postID`
- `/src/http/delete-posts-000postID`

> ⛱  HTTP functions are supported locally with `arc sandbox`

---

### Generated AWS Infra

Running `arc deploy` will setup the following AWS resource types:

- `AWS::Lambda::Function`
- `AWS::Serverless::Api`

---

## Request

The request payload has the following keys:

- `resource` Resource path
- `path` Path parameter
- `httpMethod` Incoming request HTTP method name
- `headers` String containing incoming request headers
- `multiValueHeaders` List of strings containing incoming request headers
- `queryStringParameters` query string parameters 
- `multiValueQueryStringParameters` List of query string parameters
- `pathParameters`  path parameters
- `stageVariables` Applicable stage variables
- `requestContext` Request context, including authorizer-returned key-value pairs
- `body` A JSON string of the request payload
- `isBase64Encoded` A boolean flag to indicate if the applicable request payload is Base64-encode

## Response

Responses can have the following keys:

- `isBase64Encoded` only required if `true` (combined with base64 encoded `body`)
- `statusCode` any http status code (for reference: https://http.cat)
- `headers` key/value map of response headers
- `multiValueHeaders` response of multivalue headers `{header:[]}`
- `body` response body string

Read more about the default [response](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format)

---

### Examples

A simple hello world HTML response:

```javascript
// src/http/get-index/index.js
exports.handler = async function http(req) {
  return {
    headers: {'content-type': 'text/html'},
    body: `<b>hello world</b>` 
  }
}
```

A redirect writing to the `session`:

```javascript
// src/http/post-login/index.js
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let loggedIn = req.body.email === 'admin' && req.body.password === 'admin'
  let cookie = await arc.http.session.write({loggedIn})
  return {
    headers: {
     'set-cookie': cookie
     'location: '/'
    },
    statusCode: 302,
  }
}
```

An example `500` response:

```javascript
// src/http/get-some-broken-page/index.js
exports.handler = async function http(req) {
  return {
    headers: {'content-type': 'text/html'},
    statusCode: 500,
    body: 'internal serverless error'
  }
}
```

An example JSON API endpoint:

```javascript
// src/http/get-cats/index.js
exports.handler = async function http(req) {
  return {
    statusCode: 201,
    body: JSON.stringify({cats: ['sutr0']})
  }
}
```
