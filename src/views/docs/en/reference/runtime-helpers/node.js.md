---
title: Node.js runtime helpers
category: Runtime helpers
description: "Node.js runtime utility libraries: `@architect/functions` `@architect/asap`"
---

Architect provides optional runtime utility libraries designed to make it significantly easier to work with provisioned resources and related assets.

Architect has two primary helper libraries for Node.js:

- [`@architect/functions`](#%40architect%2Ffunctions) - General purpose runtime helpers for various Architect resources, such as `@events`, `@http`, `@tables`, etc.
- [`@architect/asap`](#%40architect%2Fasap) - Helper designed solely for delivering static assets via `@http` endpoints

---

# `@architect/functions`

[View package source on GitHub](https://github.com/architect/functions/)


## Setup

Install the Architect runtime helpers for Node.js:

```bash
npm install @architect/functions
```

Ensure `arc` is available to your Lambda function code:

```javascript
let arc = require('@architect/functions')
```

## Interfaces

- [`arc.events`](#arc.events) Publish / subscribe helpers for `@events` functions
- [`arc.http`](#arc.http) Middleware and request/response normalization and session support for `@http` functions
- [`arc.queues`](#arc.queues) Publish/subscribe helpers for `@queues` functions
- [`arc.services`](#arc.services()) Retrieves the Architect service map, exposing metadata for all services making up the application
- [`arc.static`](#arc.static()) Get a `@static` asset path
- [`arc.tables`](#arc.tables()) Generates a DynamoDB client for `@tables`
- [`arc.ws`](#arc.ws) WebSocket helpers for `@ws` functions

---

## `arc.events`

Publish & subscribe helpers for `@events` functions. Declare events with the [`@events`](/docs/en/reference/project-manifest/events) pragma.


### `arc.events.subscribe()`

Subscribe to events with a handler function. The function will be passed an `event` object, and, if not an `async` function, a callback to be called upon completion.

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

### `arc.events.publish()`

Publish an event to an `@events` function. An object containing two properties is required:
- **`name`** (string) - name of the `@events` function you'd like to publish to
- **`payload`** (object or array) - payload to be published

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

## `arc.http`

`arc.http` provides middleware and request/response normalization for `@http` functions using your choice of `async` functions or Express-style callbacks. Declare HTTP routes with the [`@http`](/docs/en/reference/project-manifest/http) pragma.

> A legacy `arc.http.async` middleware interface will remain available exclusively for `async` functions, although we strongly encourage using the unified `arc.http` interface.


### Requests

`arc.http` provides the following:
- Built-in session support
- Added conveniences, such as automatic parsing of `req.body`
- Support for request formats from both AWS API Gateway `HTTP` and `REST` APIs
- Added properties commonplace in other web servers, such as `req.params` and `req.query` (as opposed to the much more verbose `req.pathParameters` and `req.queryStringParameters`, respectively)
- Backward-compatibility for `REST` API properties in `HTTP` APIs, enabling seamless API upgrades

Handler functions passed to `arc.http` receive a `request` object containing all of the [API Gateway request properties](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) specific to `HTTP` and `REST` APIs. Additionally, the following properties are added or improved for convenience:

- `body` - **object**
  - Automatically parsed if present; `{}` if request has no body
- `method` (alias of `httpMethod`) - **string**
  - HTTP method of the request: `GET`, `POST`, `PATCH`, `PUT`, or `DELETE`
- `params` (alias of `pathParameters`) - **object**
  - URL parameters, if defined in your HTTP function's path (e.g. `product` in `/shop/:product`); `{}` if request has none
  - Example: `{ product: 'chocolate-chip-cookies' }`
- `path` - **string**
  - Root-relative path of the URL being requested
  - Example: `/shop/chocolate-chip-cookies`
- `query` (alias of `queryStringParameters`) - **object**
  - Parsed query string parameters present in the client request; `{}` if request has none
  - Example: `{ someParam: someValue }`
- `session` - **object**
  - Automatically parsed from the request cookie; `{}` if no `session` is found for the requesting client
  - Example: `{ accountID: 'a1b2c3' }`
  - See the [sessions guide for more](/docs/en/guides/frontend/sessions)
- Additional backward-compatible `REST` properties available in `HTTP` APIs via `arc.http`:
  - `resource` (an alias of `req.routeKey`)
  - `path` (an alias of `req.rawPath`)

<!-- Intentionally undocumented: `multiValueQueryStringParameters`: not (yet) activated in Arc Functions -->

> Caveat: Architect Functions does not deal in compatibility with `req.requestContext`; request context semantics are specific to the version of API Gateway in use (`REST` or `HTTP`)

> Learn more about [API Gateway request payloads here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)


### Responses

`arc.http` honors the standard [API Gateway response payload properties](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) (`statusCode`, `headers`, `body`, etc.), in addition to adding the following convenience properties:

- `cacheControl` - **string**
  - Sets the `cache-control` header (or overrides it if already present)
- `compression` - **string** or **boolean**
  - Defaults to Brotli (`br`); sets output compression of non-binary handler responses (e.g. JSON, HTML, etc.)
  - If requesting client does not support default (`br`), it automatically falls back to gzip (`gzip`), and then disables compression
  - If a compression type is manually specified (e.g. `compression: 'br'`) and the requesting client does not support it, compression is automatically disabled for that request
  - To manually disable output compression for non-binary responses, specify `false`
- `cookie` - **string**
  - Sets the `set-cookie` header (or overrides it if already present)
  - Note: this convenience property predates API Gateway HTTP v2.0's `cookies` property; if using that payload format (which is Architect's default), passing `cookies` (an array) is probably better
- `cors` - **boolean**
  - Sets the `access-control-allow-origin` header to `*` (or overrides it if already present)
- `status`, `code` (alias of `statusCode`) - **number**
  - Sets the response HTTP status code
- `session` - **object**
  - Create or overwrite a client session; see the [sessions guide for more](/docs/en/guides/frontend/sessions)
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


### Middleware

Define `arc.http` middleware by passing one or more async or callback functions as parameters.

In a given handler, all middleware functions must be either [async](#async-middleware) or [callback](#callback-middleware) – they cannot be mixed.


#### `async` middleware

Utilize `async` middleware by passing one or more `async` functions as parameters.

`async` functions are provided two positional arguments:
- `request` - **object**
  - [Request object](#requests); mutations to the `request` object **are** passed along to future middleware functions
- `context` - **object**
  - Standard API Gateway context object

Execution flow is as follows:
- To exit the middleware queue early:
  - Return a [valid response payload](#responses), or
  - Return an `Error` (to gracefully error out)
- To invoke the following middleware function:
  - Return the `request` object, or
  - Return nothing, or
  - Reach the end of execution

```javascript
// single function
let arc = require('@architect/functions')

exports.handler = arc.http(async req => {
  return {
    json: { ok: true }
  }
})
```

```javascript
// middleware
let arc = require('@architect/functions')

exports.handler = arc.http(auth, handler)

async function auth (req) {
  if (!req.session.accountID) {
    return { status: 403 }
  }
}

async function handler (req) {
  return {
    json: { ok: true }
  }
}
```


#### `callback` middleware

Utilize `callback` middleware by passing one or more non-`async` functions as parameters.

`callback` functions are provided three positional arguments:
- `request` - **object**
  - [Request object](#requests); mutations to the `request` object **are not** passed along to future middleware functions
- `response` - **function**
  - Callback that accepts either a [valid response payload](#responses) or `Error` in idiomatic errback style
- `next` - **function** (if not the final middleware)
  - Invoke `next` to invoke the following middleware function

Execution flow is as follows:
- To exit the middleware queue early:
  - Invoke the `response` callback with a [valid response payload](#responses), or
  - Invoke the `response` callback with an `Error` (to gracefully error out)
- To invoke the following middleware function:
  - Invoke the `next` callback

```javascript
// single function
let arc = require('@architect/functions')

exports.handler = arc.http(handler)

function handler (req, res) {
  res({
    json: { ok: true }
  })
}
```

```javascript
// middleware
let arc = require('@architect/functions')

exports.handler = arc.http(auth, handler)

function auth (req, res, next) {
  if (!request.session.accountID) {
    res({ status: 401 })
  }
  else next()
}

function handler (req, res) {
  res({
    json: { ok: true }
  })
}
```

---

### `arc.http.session`

Generally we recommend working with sessions via [`arc.http`](#arc.http) by reading them via the `req` object, and writing them via the `session` property.

However, should you need additional power and flexibility, we expose `arc.http.session` methods for manually reading the current session in an `@http` request, and writing it back to a cookie (that must then be sent back to the client via the `set-cookie` header).


#### Methods

- `read(request[, callback]) → [Promise]`
  - Accepts a [request object](#requests)
  - Returns `session` object (or `{}` if none is found)
  - Must be `await`ed if no callback is provided
- `write(session[, callback]) → [Promise]`
  - Returns a `cookie` string to be passed in your `set-cookie` response headers
  - If you do not pass the `cookie` in your response, your session may not be properly set or saved
  - Must be `await`ed if no callback is provided

> Please note that session variable encoding and decoding relies on the `ARC_APP_SECRET` [environment variable](../cli/env#security) being set to something secret and not easily guessable. If you use Architect sessions, please be sure to [set the `ARC_APP_SECRET` environment variable](../../guides/frontend/sessions#strong-session-secret)!

```javascript
let arc = require('@architect/functions')

exports.handler = async function handler (req) {
  // Read the session
  let session = await arc.http.session.read(req)
  // Modify the state
  session.count = (session.count || 0) + 1
  // Save the session state
  let cookie = await arc.http.session.write(session)
  // Set the client cookie
  return {
    statusCode: 200,
    headers: { 'set-cookie': cookie },
  }
}
```

Alternatively, use `arc.http`'s automatic session handling:

```javascript
let arc = require('@architect/functions')

exports.handler = arc.http(async req => {
  // Session already exists on `req`
  let { session } = req
  session.count = (session.count || 0) + 1
  // Write the session and set it on the client like so:
  return { session }
})
```

---

### `arc.queues`

Publish & subscribe helpers for `@queues` functions. Declare queues with the [`@queues`](/docs/en/reference/project-manifest/queues) pragma.

#### `arc.queues.subscribe()`

Subscribe to queues with a handler function. The function will be passed an `event` object, and, if not an `async` function, a callback to be called upon completion.

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

#### `arc.queues.publish()`

Publish an event to an `@queues` function. An object containing two properties is required:
- **`name`** (string) - name of the `@queues` function you'd like to publish to
- **`payload`** (object or array) - payload to be published

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

### `arc.services()`

Cloud resources are generated with names more friendly for machines than people. Other frameworks leave resource discovery up to end users, which leads to ad hoc implementations becoming a frequent bug vector. Architect treats service discovery as a first class concern.

> Amazon Resource Names (ARNs) are available at runtime to all Lambda functions defined in the same Architect project manifest. Things such as DynamoDB tables, SNS topics, SQS queues, API Gateway endpoints, and S3 static bucket ARNs are baked into `@architect/functions` so your runtime program logic interacts with resources using readable, people-friendly names defined in your Architect project manifest.

`arc.services()` retrieves the Architect service map: an object mapping the plugins and out-of-the-box Architect infrastructure that makes up your application.

This object is lazily-loaded and cached, and thus the first call may incur a delay as the service map is populated (use of [`arc.events`](#arc.events), [`arc.queues`](#arc.queues) and [`arc.tables`](#arc.tables) transparently uses this method in the background).

`arc.services()` returns a service map object, with keys equaling any out-of-the-box Architect infrastructure types or plugins used by the Architect application.

An example service map for an application composed of `@static`, `@events` and an `imagebucket` plugin would have the following structure:

```javascript
let arc = require('@architect/functions')

let services = await arc.services()
/*
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

### `arc.static()`

Returns the path of a given static asset, intended for use with static asset fingerprinting (`@static fingerprint true`).

Accepts two parameters:
- `asset` - **string**
  - The root-relative path of the asset you'd like to load
- `options` - **object** that may contain the following properties:
  - `stagePath` - **boolean**
    - `REST` API compatibility option, enables prepending of the API stage

```javascript
let css = arc.static('/index.css')
// '/_static/index-a1b2c3.css'

let js = arc.static('/index.js', { stagePath: true })
// '/staging/_static/index-b2c3d4.js'
```

---

### `arc.tables()`

Creates a DynamoDB data layer, with raw client and other helpers, for your application's `@tables`. The client is an object, containing a nested object for each table. Declare tables with the [`@tables`](/docs/en/reference/project-manifest/tables) pragma.


#### Options

`arc.tables()` accepts an optional object of additional options:

- `awsSdkClient` - **boolean**
  - Opt into instantiating and attaching an AWS SDK-based DynamoDB client to the `tables` client
  - **Important note:** instantiating AWS SDK DynamoDB clients can take a very long time (>1000 ms), and is generally not advised for user hot paths! [Learn more here](https://aws-lite.org/performance).
- `awsjsonMarshall` - **object**
  - Options for overriding default settings for [AWS flavored JSON marshalling](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-util-dynamodb/Interface/marshallOptions/)
- `awsjsonUnmarshall` - **object**
  - Options for overriding default settings for [AWS flavored JSON unmarshalling](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-util-dynamodb/Interface/unmarshallOptions/)


```javascript
let arc = require('@architect/functions')
let client = await arc.tables()
client._client  // aws-lite DynamoDB client
client._db      // undefined
client._doc     // undefined

client = await arc.tables({
  awsSdkClient: true,
  awsjsonMarshall: { convertClassInstanceToMap: true },
  awsjsonUnmarshall: { convertWithoutMapWrapper: false },
})
client._db      // AWS.DynamoDB
client._doc     // AWS.DynamoDB.DocumentClient
// ... the above methods are still available
```


#### Client methods

- `_client() → [Promise]`
  - Instance of [`@aws-lite/dynamodb`](https://aws-lite.org/services/dynamodb)
- `_db(params[, callback]) → [Promise]`
  - `nodejs16.x` (or lower) - instance of [`AWS.DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
  - `nodejs18.x` (or higher) - instance of [`DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/dynamodb.html)
- `_doc(params[, callback]) → [Promise]`
  - `nodejs16.x` (or lower) - instance of [`AWS.DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) if instantiated with `awsSdkClient: true`
  - `nodejs18.x` (or higher) - instance of [`DynamoDBDocument`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html) if instantiated with `awsSdkClient: true`
- `name(tablename)`
  - Helper method that accepts a logical table name string, and returns a physical AWS resource name. Helpful for when you need to go lower level.
    - For example use `client.name('my-table')` to get the human-unfriendly AWS name of the `my-table` `@tables` resource
- `reflect() → [object]`
  - Returns a dictionary of table names with logical ids

```arc
@app
testapp

@tables
widgets
  name *String
```

```javascript
let arc = require('@architect/functions')
let client = await arc.tables()
client._client          // aws-lite DynamoDB client
client.name('widgets')  // 'testapp-staging-widgets'
client.reflect()        // { widgets: 'testapp-staging-widgets' }
```


#### Instance methods

Each table has the following methods:

- `delete(key[, callback]) → [Promise]`
  - Delete a record
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property)
- `get(key[, callback]) → [Promise]`
  - Get a single row by primary key (and secondary index)
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property)
- `put(record[, callback]) → [Promise]`
  - Create or replace a record
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property)
- `query(query[, callback]) → [Promise]`
  - Query a table by passing a full document query object
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property)
- `scan([options][, callback]) → [Promise]`
  - Scan the table until pagination; accepts document filter object
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property)
- `scanAll([options][, callback]) → [Promise]`
  - Scan the entire table with pagination handled automatically; accepts document filter object
  - Larger tables generally equate to greater latency as `scanAll` paginates through all contents
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property)
- `update(record[, callback]) → [Promise]`
  - Upsert a record; accepts document update object
  - [Additional documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property)

> The generated client is facade for `AWS.DynamoDB.DocumentClient`. The `delete` and `get` methods take a single parameter that is passed on to the `params.Key` attribute in the corresponding `DocumentClient` method. The `put` method takes a single parameter that is passed on as the `params.Item` attribute in the `DocumentClient.put` method. The `query`, `scan`, and `update` methods simply pass the `params` argument with the `TableName` parameter prepopulated. [See the official DynamoDB documentation for all available parameters](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html).


#### Examples

Given the following `app.arc` file:

```arc
@app
people-app

@tables
people
  email *String

@tables-indexes
people
  job *String
  name peopleByJob
```

A data access layer will be generated like so:

```javascript
let arc = require('@architect/functions')
let client = await arc.tables()
let people = client.people

// create Chuck and Jana
let chuck = await people.put({
  email: 'chuck@example.com',
  job: 'Web Developer',
  age: 35,
})
let jana = await people.put({
  email: 'jana@example.com',
  job: 'Web Developer',
  age: 64,
})

// increment Jana's age
await people.update({
  Key: { email: jana.email },
  ExpressionAttributeValues: { ':inc': 1 },
  UpdateExpression: 'ADD age :inc'
})

// retrieve Jana's updated record
jana = await people.get({ email: jana.email })

// query for Web Developers using a secondary index
let developers = await people.query({
  IndexName: 'peopleByJob',
  KeyConditionExpression: 'job = :job',
  ExpressionAttributeValues: { ':job': 'Web Developer' },
})

// scan the entire table for people over 64
let retired = await people.scan({
  FilterExpression : 'age >= :sixtyfive',
  ExpressionAttributeValues : {':sixtyfive' : 65},
})

// delete Chuck and Jana
await client._doc.transactWrite({
  TransactItems: [
    { Delete: { TableName: 'people', Key: { email: chuck.email } } },
    { Delete: { TableName: 'people', Key: { email: jana.email } } },
  ]
})
```

---

## `arc.ws`

Interact with WebSocket services. Declare endpoints with the [`@ws`](/docs/en/reference/project-manifest/ws) pragma.


### `arc.ws.send()`

Send a message via WebSocket. An object containing two properties is required:
- **`id`** (string) - API Gateway `connectionId` of the client you'd like to send the message to
- **`payload`** (object or array) - payload to be sent to the WebSocket client (as JSON)

```javascript
let arc = require('@architect/functions')

await arc.ws.send({
  id: connectionId,
  payload: {
    // Invokes @ws greetings, if defined
    action: 'greetings',
    message: 'Hello, friend!',
  }
})
```


### `arc.ws.close()`

Close a WebSocket connection with the provided id:
- **`id`** (string) - API Gateway `connectionId` of the client you'd like to close

```javascript
let arc = require('@architect/functions')

await arc.ws.close({ id: connectionId })
```


### `arc.ws.info()`

A pass-through to the [ApiGatewayManagementApi#getConnection](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayManagementApi.html#getConnection-property) method. Retrieve information about the connection with the provided id:
- **`id`** (string) - API Gateway `connectionId` of the client you'd like get information about

```javascript
let arc = require('@architect/functions')

let info = await arc.ws.info({ id: connectionId })
/*
{
  ConnectedAt: <Date>,
  Identity: {
    SourceIp: <string>,
    UserAgent: <string>,
  },
  LastActiveAt: <Date>,
}
*/
```


### `arc.ws._api()`

Return the internal [`ApiGatewayManagementApi` client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayManagementApi.html) from [`aws-lite`](https://aws-lite.org).

```javascript
let arc = require('@architect/functions')

let wsApi = await arc.ws._api()
```

---

# `@architect/asap`

[View package source on GitHub](https://github.com/architect/asap/)

### Setup

Install the Architect static asset proxy (ASAP) for Node.js:

```bash
npm install @architect/asap
```

### Parameters

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
  - Return null if asset is not found
- `spa` - **boolean** (defaults to `false`)
  - Enable single page app mode, all page requests deliver `/index.html`

```javascript
// basic usage
let asap = require('@architect/asap')
let params = { cacheControl: 'max-age=0' }
exports.handler = asap(params)
```

```javascript
// asap as arc.http middleware
let arc = require('@architect/functions')
let asap = require('@architect/asap')

exports.handler = arc.http(render, asap())

async function render (req) {
  // If user is logged in, show them a custom logged in page
  if (req.path === '/' && req.session.account) {
    return { html: `<body>Hello ${req.session.account.name}!</body>` }
  }
  // Otherwise, load the logged out static page
  return
}
```
