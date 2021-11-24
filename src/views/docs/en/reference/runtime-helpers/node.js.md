---
title: Node.js runtime helpers
category: Runtime helpers
description: Node.js runtime support
---

Architect runtime helpers are optional, and designed to make it significantly easier to work with AWS CloudFormation provisioned resources and related assets.

CloudFormation resources are generated with names more friendly for machines than people. Other frameworks leave resource discovery up to end users, which leads to ad hoc implementations becoming a frequent bug vector. Architect treats runtime discovery as a first class concern.

> Amazon Resource Names (ARNs) are available at runtime to all Lambda functions defined in the same Architect project manifest. Things such as DynamoDB tables, SNS topics, SQS queues, API Gateway endpoints, and S3 static bucket ARNs are baked into `@architect/functions` so your runtime program logic interacts with resources using readable, people-friendly names defined in your Architect project manifest.

Architect has two primary runtime helpers for Node.js:

- [`@architect/functions`](#%40architect%2Ffunctions) - General purpose runtime helpers for various Architect resources, such as `@http`, `@tables`, etc.
- [`@architect/asap`](#%40architect%2Fasap) - Helper designed solely for delivering static assets via `@http` endpoints

---

## `@architect/functions`

### Setup

Install the Architect runtime helpers for Node.js:

```bash
npm install @architect/functions
```

Ensure `arc` is available to your Lambda function code:

```javascript
let arc = require('@architect/functions')
```


### API

- [`arc.events`](#arc.events) Publish / subscribe helpers for `@events` functions
- [`arc.http`](#arc.http) Middleware and request/response normalization for `@http` functions using callbacks
- [`arc.http.async`](#arc.http.async) Middleware and request/response normalization for `@http` functions using `async/await`
- [`arc.http.express`](#arc.http.express) Express support for `@http` functions
- [`arc.http.session`](#arc.http.session) Sessions for `@http` functions
- [`arc.queues`](#arc.queues) Publish/subscribe helpers for `@queues` functions
- [`arc.services`](#arc.services) Retrieves the Architect service map, exposing metadata for all services making up the application
- [`arc.static`](#arc.static) Get a `@static` asset path
- [`arc.tables`](#arc.tables) Generates a DynamoDB client for `@tables`
- [`arc.ws`](#arc.ws) WebSocket helpers for `@ws` functions


### `arc.events`

Publish & subscribe helpers for `@events` functions.


#### `arc.events.subscribe`

Subscribe to events with a handler function. The function will be passed an `event` object, and, if not an `async` function, a callback to be called upon completion.


##### Examples

```javascript
// async
let arc = require('@architect/functions')

exports.handler = arc.events.subscribe(handler)

async function handler (event) {
  console.log(event)
  return
}
```

```javascript
// continuation passing
let arc = require('@architect/functions')

exports.handler = arc.events.subscribe(handler)

function handler (event, callback) {
  console.log(event)
  callback()
}
```


#### `arc.events.publish`

Publish an event to an `@events` function. An object containing two properties is required:
- **`name`** (string) - name of the `@events` function you'd like to publish to
- **`payload`** (object or array) - payload to be published


##### Examples

```javascript
// async
let arc = require('@architect/functions')

await arc.events.publish({
  name: 'hit-counter',
  payload: { hits: 1 },
})
```
```javascript
// continuation passing
let arc = require('@architect/functions')

arc.events.publish({
  name: 'hit-counter',
  payload: { hits: 1 },
}, (err) => console.log)
```

---

### `arc.http`

`arc.http` provides middleware and request/response normalization for `@http` functions using Express-style callbacks.


#### Requests

`arc.http` (and `arc.http.async`) provide the following:
- Support for request formats from both AWS API Gateway `HTTP` and `REST` APIs
- Backward-compatibility for `REST` API properties in `HTTP` APIs, enabling seamless API upgrades
- Added conveniences, such as automatic parsing of `req.body`
- Added properties commonplace in other web servers, such as `req.params` (as opposed to the much more verbose `req.queryStringParameters`)

Handler functions passed to `arc.http[.async]` receive a `request` object containing all of the [API Gateway request properties](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) specific to `HTTP` and `REST` APIs. Additionally, the following properties are added or improved for convenience:


- `body` - **object**
  - Automatically parsed if present; `{}` if request has no body
- `method` (alias of `httpMethod`) - **string**
  - HTTP method of the request: `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`
- `params` (alias of `pathParameters`) - **object**
  - Any URL params, if defined in your HTTP function's path (e.g. `product` in `/shop/:product`); `{}` if request has no path parameters
  - Example: `{ product: 'chocolate-chip-cookies' }`
- `path` - **string**
  - Root-relative path of the URL being requested
  - Example: `/shop/chocolate-chip-cookies`
- `query` (alias of `queryStringParameters`) - **object**
  - Any query params if present in the client request; `{}` if request has no query parameters
  - Example: `{ someParam: someValue }`
- `session` - **object**
  - Automatically parsed from the request cookie; `{}` if no `session` is found for the requesting client
  - Example: `{ accountID: 'a1b2c3' }`
- Additional backward-compatible `REST` properties available in `HTTP` APIs via `arc.http[.async]`:
  - `resource` (an alias of `req.routeKey`)
  - `path` (an alias of `req.rawPath`)

<!-- Intentionally undocumented: `multiValueQueryStringParameters`: not (yet) activated in Arc Functions -->

> Caveat: Architect Functions does not deal in compatibility with `req.requestContext`; request context semantics are specific to the version of API Gateway in use (`REST` or `HTTP`)

> Learn more about [API Gateway request payloads here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)


#### Responses

`arc.http` (and `arc.http.async`) honor the standard [API Gateway response payload properties](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) (`statusCode`, `headers`, `body`, etc.), in addition to adding the following convenience properties:

- `cacheControl` - **string**
  - Sets the `cache-control` header (or overrides it if already present)
- `cookie` - **string**
  - Sets the `set-cookie` header (or overrides it if already present)
- `cors` - **boolean**
  - Sets the `access-control-allow-origin` header to `*` (or overrides it if already present)
- `status`, `code` (alias of `statusCode`) - **number**
  - Sets the response HTTP status code
- `session` - **object**
  - Create or overwrite a client session
- `type` - **string**
  - Sets the `content-type` header (or overrides it if already present)

Additionally, you may also pass the following content properties (instead of manually setting `statusCode`, `headers`, and `body`):

- `css` - **string**
  - Sets the `content-type` header to `text/css; charset=utf8`
- `html` - **string**
  - Sets the `content-type` header to `text/html; charset=utf8`
- `js` - **string**
  - Sets the `content-type` header to `text/javascript; charset=utf8`
- `json` - **object or array**
  - JSON-encodes the object or array and sets the `content-type` header to `application/json; charset=utf8`
- `text` - **string**
  - Sets the `content-type` header to `text/plain; charset=utf8`
- `xml` - **string**
  - Sets the `content-type` header to `text/xml; charset=utf8`

Finally, you may also return a raw JavaScript Error, which will be interpreted as a status `500`, and output the `message` and `stack` in HTML.

> Learn more about [API Gateway response payloads here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)


#### API

Define `arc.http` middleware by passing one or more functions as parameters. A function can exit the middleware queue early by calling back with a [valid HTTP response payload](#responses).

`arc.http` functions are positionally provided three properties:
- `request` - **object**
  - [Request object](#requests); mutations to the `request` object **are not** passed along
- `response` - **function**
  - Callback that accepts either a [response object](#response) or Error
- `next` - **function** (if not the final middleware)
  - Callback to invoke the next `arc.http` middleware function


##### Examples

An example of adding an authorization middleware function for JSON API requests made via XHR.

```javascript
// single function
let arc = require('@architect/functions')

exports.handler = arc.http(handler)

function handler(req, res) {
  res({
    json: { ok: true }
  })
}
```

```javascript
// middleware
let arc = require('@architect/functions')

exports.handler = arc.http(auth, handler)

function auth(req, res, next) {
  if (!request.session.accountID) {
    res({ status: 401 })
  }
  else next()
}

function handler(req, res) {
  res({
    json: { ok: true }
  })
}
```
---

#### `arc.http.async`


#### API

Define `arc.http.async` middleware by passing one or more `async` functions as parameters. A function can exit the middleware queue early by returning a [valid HTTP response payload](#responses)).

`arc.http.async` functions are provided two properties:
- `request` - **object**
  - [Request object](#requests); mutations to the `request` object **are** passed along
- `context` - **object**
  - Standard API Gateway context object

Each middleware function can invoke the following function by returning the `request` object, or by reaching the end of execution.


##### Examples

```javascript
// single function
let arc = require('@architect/functions')

exports.handler = arc.http.async(handler)

async function handler(request) {
  return {
    json: { ok: true }
  }
}
```

```javascript
// middleware
let arc = require('@architect/functions')

exports.handler = arc.http.async(auth, handler)

async function auth(req) {
  if (!req.session.accountID) {
    return { status: 403 }
  }
}

async function handler(req) {
  return {
    json: { ok: true }
  }
}
```

---

#### `arc.http.express`

[Express](https://expressjs.com) migration helper.


##### Examples

```javascript
let arc = require('@architect/functions')
let express = require('express')

let app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/cool', (req, res)=> res.send('very cool'))

exports.handler = arc.http.express(app)
```

---

#### `arc.http.session`

`arc.http.session` provides methods for reading the current session in an `@http` request, and writing it back to a cookie.

These operations are automatically handled for you when using `arc.http[.async]`; only use `arc.http.session` if you prefer handling session reads and writes yourself.

#### API

- `read(request[, callback]) → [Promise]`
  - Accepts a [request object](#requests)
  - Returns `session` object (or `{}` if none is found)
  - Must be `await`ed if no callback is provided
- `write(session[, callback]) → [Promise]`
  - Returns a `cookie` string
  - Must be `await`ed if no callback is provided

> Please note that session variable encoding and decoding relies on the `ARC_APP_SECRET` [environment variable](../cli/env) being set to something secret and not easily guessable. If you use Architect sessions, please be sure to [set the `ARC_APP_SECRET` environment variable](../cli/env)!


##### Examples

```javascript
let arc = require('@architect/functions')

exports.handler = async function handler (req) {
  // read the session
  let session = await arc.http.session.read(req)

  // save the session and get back a cookie
  let cookie = await arc.http.session.write({ count: 1 })

  // set the client's cookie
  return {
    statusCode: 200,
    headers: { 'set-cookie': cookie },
  }
}
```

---

### `arc.queues`

Publish & subscribe helpers for `@queues` functions.


#### `arc.queues.subscribe`

Subscribe to queues with a handler function. The function will be passed an `event` object, and, if not an `async` function, a callback to be called upon completion.


##### Examples

```javascript
// async
let arc = require('@architect/functions')

exports.handler = arc.queues.subscribe(handler)

async function handler (event) {
  console.log(event)
  return
}
```

```javascript
// continuation passing
let arc = require('@architect/functions')

exports.handler = arc.queues.subscribe(handler)

function handler (event, callback) {
  console.log(event)
  callback()
}
```


#### `arc.queues.publish`

Publish an event to an `@queues` function. An object containing two properties is required:
- **`name`** (string) - name of the `@queues` function you'd like to publish to
- **`payload`** (object or array) - payload to be published


##### Examples

```javascript
// async
let arc = require('@architect/functions')

await arc.queues.publish({
  name: 'hit-counter',
  payload: { hits: 1 },
})
```
```javascript
// continuation passing
let arc = require('@architect/functions')

arc.queues.publish({
  name: 'hit-counter',
  payload: { hits: 1 },
}, (err) => console.log)
```

---

### `arc.services`

Retrieves the Architect service map: an object mapping the plugins and out-of-the-box Architect infrastructure that makes up the application.

This object is lazily-loaded and cached, and thus the first call may incur a delay as the service map is populated (use of [`arc.events`](#arc.events), [`arc.queues`](#arc.queues) and [`arc.tables`](#arc.tables) transparently uses this method in the background).

`arc.services` returns a service map object, with keys equaling any out-of-the-box Architect infrastructure types or plugins used by the Architect application. An example service map for an application composed of `@static`, `@events` and an `imagebucket` plugin would have the following structure:

```javascript
let arc = require('@architect/functions')

let services = await arc.services()
console.log(services)
/* logs out:
{
  // a plugin named 'imagebucket' exposing some service discovery variables
  imagebucket: {
    accessKey: 'someAccessKey',
    name: 'arc-plugin-s3-image-bucket-example-image-buket',
    secretKey: 'someSecretKey'
  },
  // built-in @static service discovery variables
  static: {
    bucket: 'arcplugins3imagebucketexamplestaging-staticbucket-g8rsuk82ancj',
    fingerprint: 'false'
  },
  // built-in @events service discovery variables
  events: {
    myevent: 'https://some-sns-url.amazon.us-east-2.com'
  }
}
*/
```

---

### `arc.static`

Returns the path of a given static asset, intended for use with static asset fingerprinting (`@static fingerprint true`).


#### API

Accepts two parameters:
- `asset` - **string**
  - The root-relative path of the asset you'd like to load
- `options` - **object** that may contain the following properties:
  - `stagePath` - **boolean**
    - `REST` API compatibility option, enables prepending of the API stage


##### Examples

```javascript
let css = arc.static('/index.css')
// '/_static/index-a1b2c3.css'

let js = arc.static('/index.js', { stagePath: true })
// '/staging/_static/index-b2c3d4.js'
```

---

### `arc.tables`

Creates a DynamoDB client for your application's `@tables`. The client is an object, containing a nested object for each table; each table has the following methods:

- `get(key[, callback]) → [Promise]`
  - Get a single row by primary key (and secondary index)
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property)
- `query(query[, callback]) → [Promise]`
  - Query a table by passing a full document query object
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property)
- `scan([options][, callback]) → [Promise]`
  - Scan the entire table; accepts document filter object
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property)
- `put(record[, callback]) → [Promise]`
  - Create or replace a record
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property)
- `delete(key[, callback]) → [Promise]`
  - Delete a record
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property)
- `update(record[, callback]) → [Promise]`
  - Upsert a record; accepts document update object
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property)
- `name(tablename)`
  - Helper function that accepts a table name string, and returns an AWS resource name when you need to go lower level
    - For example use `data.name('my-table')` to get the human-unfriendly AWS name of the `my-table` `@table` resource
    - Previously called `data._name`, which is now deprecated
- `_db(thing[, callback]) → [Promise]`
  - An instance of [`AWS.DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- `_doc(thing[, callback]) → [Promise]`
  - An instance of [`AWS.DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

> The generated client is facade for <code>AWS.DynamoDB.DocumentClient</code>. The `delete` and `get` methods take a single parameter that is passed on to the `params.Key` attribute in the corresponding <code>DocumentClient</code> method. The `put` method takes a single parameter that is passed on as the `params.Item` attribute in the <code>DocumentClient.put</code> method. The `query`, `scan`, and `update` methods simply pass the `params` argument with the `TableName` parameter prepopulated. [See the official DynamoDB documentation for all available parameters](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html).


##### Examples

Given the following `app.arc` file:

```arc
@app
testapp

@tables
notes
  personID *String
  noteID **String
```

You'd generate a data access layer like so:

```javascript
let arc = require('@architect/functions')
let data = await arc.tables()
/*
{
  data.notes.get,
  data.notes.query,
  data.notes.scan,
  data.notes.put,
  data.notes.delete,
  data.notes.update,
  data.notes.name,
  data.notes._db,
  data.notes._doc,
}
*/
```

---

### `arc.ws`

Send a message via WebSocket ([`@ws`](/docs/en/reference/project-manifest/ws)). An object containing two properties is required:
- **`id`** (string) - API Gateway `connectionId` of the client you'd like to send the message to
- **`payload`** (object or array) - payload to be sent (as JSON)

#### Examples

```javascript
let arc = require('@architect/functions')

await arc.ws.send({
  id: connectionId,
  payload: { message: 'hai 🐶' }
})
```

---

## `@architect/asap`

### Setup

Install the Architect static asset proxy (ASAP) for Node.js:

```bash
npm install @architect/asap
```

### API

ASAP takes an optional configuration object with the following properties and returns an `async` Lambda handler:

- `alias` - **object**
  - Map of paths or files to alias to different paths
  - Example: `{ '/an-asset.jpg': '/a-different-filename.jpg' }`
- `assets` - **object**
  - Map of fingerprinted static assets; defaults to using the Arc-generated `static.json`
  - Example: `{ 'some-file.gif': 'some-file-a1b2c3.gif' }`
- `bucket` - **object** containing the following properties:
  - `staging` - **string** (required)
    - Staging environment bucket name
  - `production` - **string** (required)
    - Production environment bucket name
  - `folder` - **string** (optional)
    - Folder path to treat as the root of all requests
- `cacheControl` - **string**
  - Sets the cache-control header, overriding ASAP's default, content-aware cache-control header
- `headers` - **object**
  - Set response headers
  - Example: `{ 'some-header': 'ok=true' }`
- `passthru` - **boolean** (defaults to `false`)
  - Return null if asset is not found (defaults to false)
- `spa` - **boolean** (defaults to `false`)
  - Enable single page app mode, all page requests deliver `/index.html`


##### Examples

```javascript
// basic usage
let asap = require('@architect/asap')
let params = { cacheControl: 'max-age=0' }
exports.handler = asap(params)
```

```javascript
// asap as arc.http.async middleware
let arc = require('@architect/functions')
let asap = require('@architect/asap')

exports.handler = arc.http.async(render, asap())

async function render (req) {
  // If user is logged in, show them a custom logged in page
  if (req.path === '/' && req.session.account) {
    return { html: `<body>Hello ${req.session.account.name}!</body>` }
  }
  // Otherwise, load the logged out static page
  return
}
```
