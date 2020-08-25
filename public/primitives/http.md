# HTTP functions

## Create powerful web apps composed of fast HTTP functions

Each `@http` function defined in your Architect project manifest, results in the creation of a corresponding HTTP route and AWS Lambda functions (wired to that HTTP route in API Gateway). These HTTP functions receive and respond to regular HTTP (and HTTPS) requests.

This page covers the following topics:

- <a href=#provisioning><b>Provisioning HTTP functions</b></a>
- <a href=#reqres><b>Request and response payloads</b></a>
- <a href=#sec><b>Security</b></a>
- <a href=#examples><b>Examples</b></a>

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

> Note how clear it is what this app does simply by reviewing its `app.arc` file!

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

## <span id=reqres>Request and response payloads</span>

- Architect `7.x` uses API Gateway [HttpApis](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)
- Architect `<= 6.x` use API Gateway RestApis

> If you are an Architect 6 or less please refer to the [upgrade guide](/guides/upgrade#request-breaking-changes)

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
  "version":"2.0",
  "routeKey":"GET /hello-world/{greeting}",
  "rawPath":"/hello-world/friend",
  "rawQueryString":"testing=123",
  "headers": {
    "accept":"text/html",
    "accept-encoding":"gzip, deflate, br",
    "dnt":"1","host":"wonder-bkx-staging.begin.app",
    "upgrade-insecure-requests":"1",
    "user-agent":"Mozilla/5.0",
   },
   "queryStringParameters": {
     "testing":"123"
   },
  "requestContext": {
     "accountId":"111111111",
     "apiId":"xxxxxxxxxx",
     "domainName":"wonder-xxx.begin.app",
     "domainPrefix":"wonder-xxx",
     "http": { 
       "method":"GET",
       "path":"/hello-world/friend",
       "protocol":"HTTP/1.1",
       "sourceIp":"000.00.00.000",
       "userAgent":"Mozilla/5.0"
      ,
      "requestId":"xxxxxxxxxxxxxxxx",
      "routeKey":"GET /hello-world/{greeting}",
      "stage":"$default",
      "time":"25/Aug/2020:18:30:35 +0000",
      "timeEpoch":1598380235601
    }
  },
  "pathParameters": {
    "greeting":"friend"
  },
  "isBase64Encoded":false
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
  {statusCode: 200, headers: {'content-type': 'text/html; charset=utf-8;'}, body: html}
end
```

Python:

```python
# src/http/get-index/index.py
def handler(req):
  body = 'Hello world from Python!'
  return {'statusCode': 200, headers: {'content-type': 'text/html; charset=utf-8;'}, 'body': body}
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
