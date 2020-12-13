---
title: Node
description: Node runtime helpers
---

Architect runtime helpers are optional but they do make working with CloudFormation provisioned resources much nicer. CloudFormation resources are generated and as such have names more friendly for machines than people. Resource discovery is baked into `@architect/functions` so program logic interacting named resources is always just as they are named in the current `app.arc` file.

Install the Architect runtime helpers for Node:

```bash 
npm install @architect/functions
```

## API

> Node `@http` handlers have extra functionality for frontend use cases: static assets, middleware, and session support.

Ensure `arc` is available to your Lambda function code:

```javascript
let arc = require('@architect/functions')
```

### Frontend

- `arc.static` Get static asset path
- `arc.http.async` Middleware
- `arc.http.session` Sessions

### Backend

- `arc.tables` Generates a DynamoDB client for the current `app.arc`
- `arc.events` Publish/subscribe helpers for SNS
- `arc.queues` Publish/subscribe helpers for SQS

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
