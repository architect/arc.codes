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

- `arc.static` Get static asset path
- `arc.http.async` Middleware
- `arc.http.session` Sessions
- `arc.tables` Generates a DynamoDB client for the current `app.arc`
- `arc.events` Publish/subscribe helpers for SNS
- `arc.queues` Publish/subscribe helpers for SQS

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

- body is automatically parsed
- `session` is available
-

##### Response

Architect honors the standard API Gateway response payload parameters:

- headers
- body
- statusCode
- isBase64Encoded

And adds these convenience aliases to cleanup function code:

- cors
- code
- type
- status
- cacheControl
- html
- json
- css
- js
- text
- xml

#### `arc.http.session`

Sessions with 

#### `arc.tables`
Read and write to DynamoDB with 
<div id="arc.events"></div>
## SNS pub/sub with `arc.events`

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
