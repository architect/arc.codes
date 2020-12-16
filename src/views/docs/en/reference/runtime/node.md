---
title: Node
description: Node runtime helpers
---

Architect runtime helpers are optional but they do make working with CloudFormation provisioned resources much nicer. CloudFormation resources are generated and as such have names more friendly for machines than people. Other frameworks leave resource discovery up to userland which leads to ad hoc implementations becoming a frequent bug vector. Architect treats runtime discovery as a first class concern. Amazon Resource Names (ARNs) are available to be discovered at runtime through SSM parameters. Things such as DynamoDB tables, SNS topics, SQS queues, API Gateway endpoints, and S3 static bucket ARNs are baked into `@architect/functions` so your runtime program logic interacts with resources using people friendly and readable names defined in the `app.arc` file.

## Setup 

Install the Architect runtime helpers for Node:

```bash 
npm install @architect/functions
```

Ensure `arc` is available to your Lambda function code:

```javascript
let arc = require('@architect/functions')
```

## API

- `arc.static` Get a `@static` asset path 
- `arc.http.async` Middleware for `@http`
- `arc.http.session` Sessions for `@http` 
- `arc.tables` Generates a DynamoDB client for `@tables`
- `arc.events` Publish/subscribe helpers for SNS `@events`
- `arc.queues` Publish/subscribe helpers for SQS `@queues`

---

#### `arc.static`

Get a static asset path:

```javascript
let css = arc.static('/index.css')
```

#### `arc.http.async`

Middleware with `async` functions is defined on `arc.http.async` with middleware functions as parameters. The returned function adheres to the expected AWS Lambda function signature. A function can exit the middleware queue early by returning an HTTP response.

```javascript
let arc = require('@architect/functions')

exports.handler = arc.http.async(auth, handler)

async function auth(request) {
  if (!request.session.account) {
    return { status: 403 }
  }
}

async function handler(request) {
  return {
    json: { ok: true }
  }
}
```

##### Request

The incoming request object is the standard API Gateway request with a few enhancements:

- `request.body` is automatically parsed
- adds `request.session` 
- adds `request.method`, `req.params` and `req.query` aliases

##### Response

Architect honors the standard API Gateway response payload parameters:

- `headers`
- `body`
- `statusCode`
- `isBase64Encoded`

And adds cleaner convenience params:

- `code` alias for `statusCode`
- `status` also an alias for `statusCode`
- `session` write a value to the session
- `type` sets the `Content-Type` header

And additional aliases for common `Content-Type` headers:

- `cacheControl` sets the `Cache-Control` header
- `cors` sets the `Access-Control-Allow-Origin` header to `*`
- `html` sets the `Content-Type` header to `text/html; charset=utf8`
- `json` sets the `Content-Type` header to `text/html; charset=utf8`
- `css` sets the `Content-Type` header to `text/css; charset=utf8`
- `js` sets the `Content-Type` header to `text/javascript; charset=utf8`
- `text` sets the `Content-Type` header to `text/plain; charset=utf8`
- `xml` sets the `Content-Type` header to `text/xml; charset=utf8`

#### `arc.http.session`

Read the current session in an `@http` request and write it back to a cookie

```javascript
async function handler (req) {
  // read the session
  let session = arc.http.session.read(req)
  // save the session into a cookie string
  let cookie = await arc.http.session.write({ count: 1 })
  // write the cookie to the browser
  return { 
    statusCode: 200,
    headers: { 'set-cookie': cookie },
  }
}
```

#### `arc.tables`

Create a DynamoDB client for `@tables`.

Given the following `app.arc` file:

```arc
@app
testapp

@tables
notes
  personID *String
  noteID **String
```

Generate a data access layer:

```javascript
let arc = require('@architect/functions')
let data = await arc.tables()
```

For the example above the generated API is:

- `data.notes.get`
- `data.notes.query`
- `data.notes.scan`
- `data.notes.put`
- `data.notes.delete`
- `data.notes.update`

> Tip: these methods are just wrappers for [`AWS.DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html with `TableName` prepopulated 

The generated data layer also allows direct access to DynamoDB through a few methods:

- `data._db` which returns an instance of [`AWS.DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- `data._doc` returns an instance of [`AWS.DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- `data._name` helper function that returns a `@table` resource name when you need to go lower level

#### `arc.events`

Subscribe to an SNS topic

```javascript
let arc = require('@architect/functions')

exports.handler = arc.events.subscribe(handler)

async function handler (event) {
  console.log(event)
}
```

Publish to an SNS topic

```javascript
let arc = require('@architect/functions')

await arc.events.publish({
  name: 'hit-counter',
  payload: {hits: 1},
})
```

#### `arc.queues`

Subscribe to an SQS topic

```javascript
let arc = require('@architect/functions')

exports.handler = arc.queues.subscribe(handler)

async function handler (event) {
  console.log(event)
}
```

Publish to an SNS topic

```javascript
let arc = require('@architect/functions')

await arc.queues.publish({
  name: 'hit-counter',
  payload: {hits: 1},
})
```
