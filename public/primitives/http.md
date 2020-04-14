# HTTP functions

## Create powerful web apps composed of fast HTTP functions

Each `@http` function defined in your Architect project manifest, results in the creation of a corresponding HTTP route and AWS Lambda functions (wired to that HTTP route in API Gateway). These HTTP functions receive and respond to regular HTTP (and HTTPS) requests.

---

### Topics

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
get /posts/:postID
post /login
post /logout
post /posts
patch /posts/:postID
delete /posts/:postID
```

> Note how clear it is what this app does simply by reviewing its `.arc` file!

Running `arc init` with the project manifest above will generate the following local source code in these folders:

- `/src/http/get-index`
- `/src/http/get-about`
- `/src/http/get-posts-000postID`
- `/src/http/post-login`
- `/src/http/post-logout`
- `/src/http/post-posts`
- `/src/http/patch-posts-000postID`
- `/src/http/delete-posts-000postID`

> Learn more about [Architect project structure and layout here](/quickstart/layout), and learn how to [change your functions' runtimes here](/reference/arc-config/runtime)

By default, HTTP functions are dependency-free:

<section class="code-examples">

Node
```javascript
export.handler = async function http(request, context) {
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

</section>

To provision live infrastructure from your local project, running `arc deploy` will set up the following AWS resource types to handle HTTP events:

- `AWS::Lambda::Function`
- `AWS::Serverless::Api`

> Digging deeper: Architect does a lot of additional lifting to provision the many supporting resources needed to create a single HTTP function! <a href="/api/1/package?arc=%40app%0Atestapp%0A%40static%0A%40http%0Aget%20%2F%0A"
  target="blank">Here's an example of a single HTTP function's CloudFormation.</a>

---

## <span id=req>Request payload</span>

The request payload has the following keys:

- **`httpMethod`** - **String**
  - One of `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`
- **`path`** - **String**
  - The absolute path of the request
- **`resource`** - **String**
  - The absolute path of the request, with resources substituted for actual path parts (e.g. `/{foo}/bar`)
- **`pathParameters`** - **Object**
  - Any URL params, if defined in your HTTP Function's path (e.g. `foo` in `GET /:foo/bar`)
- **`queryStringParameters`** - **Object**
  - Any query params if present in the client request
- **`headers`** - **Object**
  - All client request headers
- **`body`** - **String (base64)**
  - The request body in a base64-encoded buffer. You'll need to parse `request.body` before you can use it, but Architect provides  tools to do this - see <a href=#parsing-request-bodies><b>parsing request bodies</b></a>.
- **`isBase64Encoded`** - **Boolean**
  - Indicates whether `body` is base64-encoded binary payload (will always be true if `body` has not `null`)

> Note: if you are an Architect 5 user upgrading to Architect 6, please refer to the [upgrade guide for information on `request` payload changes](/guides/upgrade#request-breaking-changes)

---

## <span id=parsing-request-bodies>Parsing request bodies</span>

To use `request.body` you'll need to parse it first. You have multiple options, based on your preferred style:

### Parse it with `arc.http.helpers.bodyParser()`

Architect Functions provides a simple body parser helper; this helper takes a request object, and returns a parsed body object.

```javascript
let arc = require('@architect/functions')

exports.handler = async function handler(request) {
  let body = arc.http.helpers.bodyParser(request)
  let name = body.email
  return {
    statusCode: 200,
    body: `<h1>Hi ${name}</h1>`
  }
}
```


### Request body in `await` style functions

If you're using `await` style functions, send the request through Architect Functions [`arc.http.async`](/reference/functions/http/node/async) which will create `request.body` then pass the request on to your lambda function. You don't need to specify anything asides from the lambda function to parse the body - `arc.http.async` adds `request.body` for you.

```javascript
const route = async function handler(request) {
  let name = request.body.email
  return {
    statusCode: 200,
    body: `<h1>Hi ${name}</h1>`
  }
}

exports.handler = arc.http.async(route)
```

### Parsing request bodies in `callback` style functions

If you're using callback functions, you can use [`arc.http()`](/reference/functions/http/node/classic). Add an Express-style middleware:

```javascript
let arc = require('@architect/functions')

function parseBody(request, res, next) {
  request.body = arc.http.helpers.bodyParser(request)
  next()
}

function route(request, res) {
  let name = request.body.email
  res({
    statusCode: 200,
    html:  `<h1>Hi ${name}</h1>`
  })
}

exports.handler = arc.http(parseBody, route)
```

### The `context` argument

`context` is an optional argument containing [metadata about the lambda request](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html).

## <span id=res>Response payload</span>

Responses are returned by your `handler` function in an object, and support the following parameters:

- `statusCode` - **Number**
  - Sets the [HTTP status code](https://http.cat)
- `headers` - **Object**
  - All response headers
- `body` - **String**
  - Contains request body, either as a plain string (no encoding or serialization required) or, if binary, base64-encoded buffer
  - Note: The maximum `body` payload size is 6MB
- `isBase64Encoded` - **Boolean**
  - Indicates whether `body` is base64-encoded binary payload
  - Required to be set to `true` if emitting a binary payload

> Note: if you are an Architect 5 user upgrading to Architect 6, please refer to the [upgrade guide for information on `response` payload changes](/guides/upgrade#response-breaking-changes)

> Read more about the <a target=blank href=https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format>response payload on the AWS docs</a>


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

### Incoming `request` object

`request` is being handled by the HTTP Function `GET /salutations/:greeting`:

```javascript
// Client requested yourapp.com/salutations/hello-world?testing=123
{
  httpMethod: 'GET',
  path: '/salutations/hello-world',
  resource: '/salutations/{greeting}',
  headers: {
    host: 'yourapp.com',
    connection: 'keep-alive',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    dnt: '1',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    Cookie: '_idx=LbyL0kPK2xOLfdm_WnESzlsG.8kStzevVXstnEkosp0k5PK2xOz3e820NtoEx1b3VXnEC8'
  },
  queryStringParameters: {testing: '123'},
  pathParameters: {greeting: 'hello-world'},
  body: null,
  isBase64Encoded: false
}
```


### Requisite `Hello world!`

<section class="code-examples">

Node

```javascript
// src/http/get-index/index.js
exports.handler = async function http(req) {
  return {
    headers: {'content-type': 'text/html; charset=utf-8;'},
    body: `<blink>Hello world from Node!</blink>`
  }
}
```

Ruby:

```ruby
# src/http/get-index/index.rb
def handler(request, context)
  html = '<b>Hello world from Ruby!</b>'
  {headers: {'content-type': 'text/html; charset=utf-8;'}, body: html}
end
```

Python:

```python
# src/http/get-index/index.py
def handler(req):
  body = 'Hello world from Python!'
  return {headers: {'content-type': 'text/html; charset=utf-8;'}, 'body': body}
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
     'location: '/'
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
