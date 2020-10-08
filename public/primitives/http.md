# HTTP functions

## Create powerful web apps composed of fast HTTP functions

Each `@http` function defined in your Architect project manifest, results in the creation of a corresponding HTTP route and AWS Lambda functions (wired to that HTTP route in API Gateway). These HTTP functions receive and respond to regular HTTP (and HTTPS) requests.

This page covers the following topics:

<a href=#provisioning><b>Provisioning HTTP functions</b></a>

<a href=#req><b>Request payload</b></a>

<a href=#res><b>Response payload</b></a>

<a href=#sec><b>Security</b></a>

<a href=#examples><b>Examples</b></a>

---

## <span id=provisioning>Provisioning HTTP functions</span>

HTTP functions are defined under `@http` very plainly, with one route per line. A route in Architect is defined as: an HTTP verb and a path separated by a space (e.g. `get /foo/bar`).

An example blogging app's Architect project manifest:

```arc
@app
testapp

@http
get /
get /about
any /posts/:postID
post /login
post /logout
post /posts
patch /posts/:postID
delete /posts/:postID
options /
head /
get /*
```

> Note how clear it is what this app does simply by reviewing its `app.arc` file!

Running `arc init` with the project manifest above will generate the following local source code in these folders:

- `/src/http/get-index`
- `/src/http/get-about`
- `/src/http/any-posts-000postID`
- `/src/http/post-login`
- `/src/http/post-logout`
- `/src/http/post-posts`
- `/src/http/patch-posts-000postID`
- `/src/http/delete-posts-000postID`
- `/src/http/options-index`
- `/src/http/head-index`
- `/src/http/get-catchall`

> Learn more about [Architect project structure and layout here](/quickstart/layout), and learn how to [change your functions' runtimes here](/reference/arc-config/runtime)

By default, HTTP functions are dependency-free:

<section class="code-examples">

Node
```javascript
exports.handler = async function http(request, context) {
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
def handler(request, context):
  return {'statusCode': 200}
```

</section>

To provision live infrastructure from your local project, running `arc deploy` will set up the following AWS resource types to handle HTTP events:

- `AWS::Lambda::Function`
- `AWS::Serverless::Api`

> Digging deeper: Architect does a lot of additional lifting to provision the many supporting resources needed to create a single HTTP function! <a href="/api/1/package?arc=%40app%0Atestapp%0A%40static%0A%40http%0Aget%20%2F%0A"
  target="blank">Here's an example of a single HTTP function's CloudFormation.</a>

---

## <span id=req>Request payload</span>

- Architect `7.x` uses API Gateway [`HTTP` APIs + Lambda payload format version 2.0](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) by default
- Architect `<=6.x` uses API Gateway `REST` API (roughly equivalent to [Lambda payload format version 1.0](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html))

> If you are an Architect 6 or earlier, please refer to the [upgrade guide](/guides/upgrade)

Requests are passed to your `handler` function in an object, and include the following parameters:

- `version` - **String**
  - Payload version (e.g. `2.0`)
- `routeKey` - **String**
  - Tuple of HTTP method (`GET`, `POST`, `PATCH`, `PUT`, or `DELETE`) and path; URL params are surrounded in braces
  - If path is not captured by a specific function, `routeKey` will be `$default` (and be handled by the `get /` function)
  - Example: `GET /`, `GET /shop/{product}`
- `rawPath` - **String**
  - The absolute path of the request
  - Example: `/`, `/shop/chocolate-chip-cookies`
- `pathParameters` - **not present** or **Object**
  - Any URL params, if defined in your HTTP function's path (e.g. `product` in `/shop/:product`)
  - Example: `{ product: 'chocolate-chip-cookies' }`
- `rawQueryString` - **String**
  - String containing query string params of request, if any
  - Example: `?someParam=someValue`, `''` (if none)
- `queryStringParameters` - **not present** or **Object**
  - Any query params if present in the client request
  - Example: `{ someParam: someValue }`
- `cookies` - **not present** or **Array**
  - Array containing all cookies, if present in client request
  - Example: `[ 'some_cookie_name=some_cookie_value' ]`
- `headers` - **Object**
  - All client request headers
  - Example: `{ 'accept-encoding': 'gzip' }`
- `requestContext` - **Object**
  - Request metadata, including `http` object containing `method` and `path` (should you not want to parse the `routeKey`)
- `body` - **not present** or **String (base64-encoded)**
  - Contains unparsed, base64-encoded request body
  - We suggest parsing with a [body parser helper](#parsing-request-bodies)
- `isBase64Encoded` - **Boolean**
  - Indicates whether `body` is base64-encoded binary payload

For additional examples, please refer to [AWS API Gateway / Lambda payload docs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html).

---

## <span id=parsing-request-bodies>Parsing request bodies</span>

To use `request.body` you'll need to parse it first. You have multiple options, based on your preferred style:


### `arc.http.helpers.bodyParser()` helper

Architect Functions provides a simple body parser; this helper takes a request object, and returns a parsed body object.

```javascript
let arc = require('@architect/functions')

exports.handler = async function handler(request) {
  let body = arc.http.helpers.bodyParser(request)
  let name = body.email
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    body: `<h1>Hi ${name}</h1>`
  }
}
```


### Auto-parsed bodies with `async/await` handlers

If you're using `async/await` style functions, run your function handler through Architect Functions [`arc.http.async`](/reference/functions/http/node/async), which (among other helpful things) will automatically parse the body and pass the parsed version to your function in `request.body`.

```javascript
let arc = require('@architect/functions')

async function handler (request) {
  let name = request.body.email
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    body: `<h1>Hi ${name}</h1>`
  }
}

exports.handler = arc.http.async(handler)
```

### Auto-parsed bodies in `callback` handlers

If you're using callback functions, you can use [`arc.http()`](/reference/functions/http/node/classic), which (among other helpful things) will automatically parse the body and pass the parsed version to your function in `request.body`. Add an Express-style middleware:

```javascript
let arc = require('@architect/functions')

function handler (request, res) {
  let name = request.body.email
  res({
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    body: `<h1>Hi ${name}</h1>`
  })
}

exports.handler = arc.http(handler)
```

### The `context` argument

`context` is an optional final argument in your handler call that contains [metadata about the Lambda request](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html).


## <span id=res>Response payload</span>

- Architect `7.x` uses API Gateway [`HTTP` APIs + Lambda payload format version 2.0](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) by default
- Architect `<=6.x` uses API Gateway `REST` API (roughly equivalent to [Lambda payload format version 1.0](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html))

> If you are an Architect 6 or earlier, please refer to the [upgrade guide](/guides/upgrade)

The default request payload has the following keys:

If you do not include the standard response parameters below, your response will be serialized to JSON, with a status code of `200` and a JSON `content-type` header.

Instead of using that JSON inference convenience, most people structure their responses using the following standard response parameters:

- `statusCode` - **Number** (required)
  - Sets the HTTP status code; usually to `200`
- `headers` - **Object** (optional)
  - All response headers
- `body` - **String** (optional)
  - Contains response body, either as a plain string, or, if binary, a base64-encoded buffer
  - Note: The maximum `body` payload size is 6MB; files being delivered non-dynamically should use the [Begin CDN](/en/getting-started/static-assets)
- `isBase64Encoded` - **Boolean** (optional)
  - Indicates whether `body` is base64-encoded binary payload; defaults to `false`
  - Required to be set to `true` if emitting a binary payload

For additional examples, please refer to [AWS API Gateway / Lambda payload docs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html).

---

### Anti-caching headers

Many remote networks rely on overly aggressive reverse-proxy caches to conserve data transfer; the absence of `Cache-Control` headers is often (mis)construed as tacit permission to aggressively cache responses that often should not be cached.

Because this can have very adverse effects on your application, we strongly suggest that most HTTP Function responses include anti-caching headers – especially when returning `HTML` and `JSON` responses. For example:

```javascript
{
  // The rest of your response here
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
  }
}
```

---

## <span id=sec>Security</span>

By default, all HTTP functions (as well as all other functions) generated with Architect have one generated <a href=https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege target=_blank>IAM role</a> with the least privilege possible to operate. This means HTTP functions can only access other resources defined in the same Architect project.

Wider account access can be explicitly granted with custom resource policies, [defined in a `.arc-config` file](/reference/arc-config/policies) placed in the HTTP function directory.

---

## <span id=examples>Examples</span>

Incoming `request` handled by the HTTP Function `GET /hello-world/:greeting`:

```javascript
// Client requested yourapp.com/hello-world/friend?testing=123
{
  version: '2.0',
  routeKey: 'GET /hello-world/{greeting}',
  rawPath: '/hello-world/friend',
  rawQueryString: 'testing=123',
  headers: {
    accept: 'text/html',
    // ... more headers
  },
  queryStringParameters: {
    testing: '123'
  },
  requestContext: {
    // ... various request context params
  },
  pathParameters: {
    greeting: 'friend'
  },
  isBase64Encoded:false
}
```


### Requisite `Hello world!`

<section class="code-examples">

Node

```javascript
// src/http/get-index/index.js
exports.handler = async function http(req) {
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    body: `<blink>Hello world from Node!</blink>`
  }
}
```

Ruby:

```ruby
# src/http/get-index/index.rb
def handler(request, context)
  html = '<b>Hello world from Ruby!</b>'
  {statusCode: 200, headers: {'content-type': 'text/html; charset=utf-8;'}, body: html}
end
```

Python:

```python
# src/http/get-index/index.py
def handler(request, context):
  body = 'Hello world from Python!'
  return {'statusCode': 200, 'headers': {'content-type': 'text/html; charset=utf-8;'}, 'body': body}
```

</section>


### Redirect writing a session cookie (Node)

```javascript
// src/http/post-login/index.js
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let loggedIn = req.body.email === 'admin' && req.body.password === 'admin'
  let cookie = await arc.http.session.write({loggedIn})
  return {
    headers: {
     'set-cookie': cookie,
     'location': '/'
    },
    statusCode: 302,
  }
}
```


### An error response (Node)

```javascript
// src/http/get-some-broken-page/index.js
exports.handler = async function http(req) {
  return {
    headers: {'content-type': 'text/html; charset=utf-8;'},
    statusCode: 500,
    body: 'internal serverless error'
  }
}
```


### JSON API endpoint (Node)

```javascript
// src/http/get-cats/index.js
exports.handler = async function http(req) {
  return {
    statusCode: 201,
    body: JSON.stringify({cats: ['sutr0']})
  }
}
```

---

## Next: [WebSocket functions](/primitives/ws)

---
