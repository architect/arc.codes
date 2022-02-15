---
title: HTTP functions
category: Frontend
description: HTTP Functions are the building blocks of the modern web app
sections:
  - Overview
  - Getting started
  - Requests
  - Responses
  - Anti-caching headers
  - Examples
---

## Overview

### Create full-featured web applications composed of fast, tiny HTTP functions

HTTP Functions are the building blocks of the modern web app. They are actually AWS Lambdas which are small functions that trigger when their endpoint is hit. You can think of lambdas as the equivalent of 'routes' in traditional web apps. AWS Lambdas are accessed via API Gateway, but Architect (`app.arc`) abstracts API Gateway and Lambda configuration + provisioning to give us **HTTP Functions**. HTTP Functions are fast, lightweight, stateless, isolated, highly durable, and require no configuration.

Each `@http` function defined in your Architect project manifest(app.arc), results in the creation of a corresponding HTTP route and AWS Lambda function (wired to that HTTP route in [API Gateway](https://aws.amazon.com/api-gateway/)). You can think of HTTP Function as its own tiny app with a single responsibility: handling all business logic related to its corresponding HTTP route.

HTTP Functions do not require dependencies, and feature a minimal but powerful low-level API that can be optionally extended (and further simplified) with our runtime library (@architect/functions).

Within your project, each HTTP Function can contain and utilize an arbitrary quantity of modules, packages, shared code, and other files – so long as the total uncompressed size of that HTTP Function's folder is ≤5MB; this helps keep your HTTP Functions (and thus your app) super fast.

### HTTP handler API

The HTTP handler API follows a simple [request](#requests) / [response](#responses) pattern. Let's look at an example of a basic HTTP Function:

```javascript
// src/http/get-index/index.js
let body = `
<!doctype html>
<html lang=en>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
`

exports.handler = async function http(request) {
  return {
    headers: {'Content-Type': 'text/html; charset=utf8'},
    body
  }
}
```
No sweat, right?



**Sections:**
- [Provisioning an HTTP Function](#getting-started)
- [Requests](#requests)
- [Responses](#responses)
- [Anti-caching headers](#anti-caching-headers)
- [Security](#security)
- [Examples](#examples)

---

## Getting started

### Provisioning new HTTP Functions

HTTP functions are defined under the `@http` pragma, with one route per line. A route in Architect is defined as: an HTTP verb (`get`, `post`, etc) and a path separated by a space (e.g. get /foo/bar).

To provision a new HTTP Function, in the root of your project, open your app's Architect project manifest file (`app.arc`):

1. Find your project's `@http` pragma
    - If you don't already have one, just add @http
2. On a new line, enter the route (an HTTP method followed by a path) you wish to create
    - For example: get /foo, or put /bar
3. Start the local dev environment to generate some boilerplate HTTP Function handlers: `arc init`
    - New function handlers will now appear in `src/http/` (e.g. `src/http/get-foo` & `src/http/put-bar`)
4. Commit and push your changes to your repo

Here's what a basic Architect project manifest looks like with the above two HTTP Functions specified:

```arc
@app
your-app-name

@http
get /foo
put /bar
```
After specifying new HTTP Functions in your Architect project manifest and pushing your changes to your repo, new infrastructure is provisioned to make the route(s) publicly available. By default, HTTP functions are also dependency-free.

### The basics

Each HTTP Function maps to a logical HTTP route. For example:

- `get /` is serviced by the HTTP Function in your project at `src/http/get-index`
- `get /about` is serviced by `src/http/get-about`
- `post /form` is serviced by `src/http/post-form`

All HTTP Functions begin with `/`, and can include letters, numbers, and slashes, underscores, dashes, and periods, with an advised (but not enforced) maximum of 100 characters.

Importantly and uniquely, you can also use URL parameters to build dynamic paths – more on that below.

> ✨  Tip: It's possible to have multiple HTTP methods respond from the same path. For example: `get /contact-us` and `post /contact-us` is totally valid, as you'd expect.

### Greedy root

By default, your app's root is greedy – which means that unless specified, all paths and HTTP methods will invoke it. Any HTTP Functions you define manually will be prioritized over the root. For example:

- With only `get /`specified: submitting a `POST` request to `/foo` will invoke `src/http/get-index`
- With both `get /` and `post /foo` specified: submitting the same request will invoke `src/http/post-foo`

The greedy root also means you can run large amounts of your application's logic from a single `get /` HTTP Function. However, we don't advise it! One of the key advantages to building with cloud functions is their inherent isolation: many smaller functions means greater ease in debugging and faster deploys.

### Using URL parameters to create dynamic paths

It's possible to build dynamic paths using Express-style URL parameters, like: `get /shop/:product`

URL parameters are passed to your route via the `req.pathParameters` object. [Learn more about HTTP requests here](#requests).

<!-- TODO: Come up with better example. -->

That's all there is to it! Now let's take a closer look at the capabilities of HTTP Functions, and how they work.

> Learn more about [Architect project structure](/en/guides/get-started/project-layout) and layout here, and learn how to change your functions' [runtimes here](/en/reference/architect-manifest-and-config/function-config-file).

## Requests

The `handler` function invoked by a client request receives a `request` object containing the following parameters:

- `httpMethod` - String
   - One of `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`
- `path` - String
  - The absolute path of the request
- `pathParameters` - null or Object
  - Any URL params, if defined in your HTTP Function's path (e.g. foo in GET /:foo/bar)
- `queryStringParameters` - null or Object
  - Any query params if present in the client request
- `headers` - Object
  - All client request headers
- `body` - null or String (base64-encoded)
   - Contains unparsed, base64-encoded request body
   - We suggest parsing with our body parser helper
- `isBase64Encoded` - Boolean
   - Indicates whether `body` is base64-encoded binary payload

### Example

Here's an example of an incoming `request` object, being handled by the HTTP Function `GET /salutations/:greeting`:

```javascript
// Client requested https://begin.com/hello-world?testing=123
{
  httpMethod: 'GET',
  path: '/salutations/hello-world',
  headers: {
    host: 'begin.com',
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

### Parsing bodies

To use request.body you'll need to parse it first. Architect Functions provides a simple body parser helper; this helper takes a request object, and returns a parsed body object. All bodies are unparsed, base64-encoded strings. Parse it with `arc.http.helpers.bodyParser()`. Here's an example:

```javascript
// Request is form URL-encoded string: 'greeting=howdy'

let arc = require('@architect/functions')
let parseBody = arc.http.helpers.bodyParser

exports.handler = async function http(request) {
  console.log(request.body)     // 'Z3JlZXRpbmc9aG93ZHk='
  let body = parseBody(request) // Pass the entire request object
  let greeting = body.greeting  // 'howdy'
  return {
    headers: {'Content-Type': 'text/html; charset=utf8'},
    body: greeting
  }
}
```

## Responses

Responses are returned by your `handler` function in an object, and use the following parameters:

- `statusCode` - Number
  - Sets the HTTP status code; defaults to `200`
- `headers` - Object
  - All response headers
- `body` - String
  - Contains response body, either as a plain string (no encoding or serialization required) or, if binary, a base64-encoded buffer
  - Note: The maximum `body` payload size is 6MB
- `isBase64Encoded` - Boolean
  - Indicates whether `body` is base64-encoded binary payload; defaults to `false`
  - Required to be set to `true` if emitting a binary payload

### Example

Here's a simple example response for an API endpoint:

```javascript
// Responding to a successful POST

return {
  statusCode: 201,
  headers: {'Content-Type': 'application/json; charset=utf8'},
  body: JSON.stringify({ok: true}),
}
```

## Anti-caching headers

Many remote networks rely on overly aggressive reverse-proxy caches to conserve bandwidth; the absence of the `Cache-Control` header is often (mis)construed by such networks as tacit permission to aggressively cache responses that often should not be cached. **This external, network-level behavior can have serious ramifications for your app.**

Because of the highly adverse effects network-level caching can on your application, we strongly suggest that most HTTP Function responses include anti-caching headers – especially when returning `HTML` and `JSON` responses. For example:

```javascript
return {
  headers: {
    'content-type': 'text/html; charset=utf8',
    'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
  },
  body: `This definitely won't be cached.`
}
```

## Security

By default, all HTTP functions (as well as all other functions) generated with Architect have one generated [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege) with the least privilege possible to operate. This means HTTP functions can only access other resources defined in the same Architect project.

Wider account access can be explicitly granted with custom resource policies, [defined in a `config.arc` file](/en/reference/architect-manifest-and-config/function-config-file) placed in the HTTP function directory.

## Examples

ADD ME!
