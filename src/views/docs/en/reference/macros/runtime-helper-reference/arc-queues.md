---
title: arc.queues
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Publish
  - Subscribe
---

## Overview

`arc.queues` allow you to invoke `@queue` handlers from any other function defined under the same @app namespace. 

Queue functions are special Lambda functions that enable a message queue using AWS SQS. Architect has helpful methods for working with JSON payloads, service discovery, and make responses compatible with Lambda function signatures.

Functions defined by `@queue` in the `app.arc` file correspond to an SQS queue and a Lambda function handler. There are two methods you can use `publish()` and `subscribe()`. In order to use it, you must `npm install @architect/functions` to the function folder and require it at the top. 

A queue function will poll for messages on the queue when it is invoked. 

```bash
cd src/http/post-event
npm init -y
npm install @architect/functions
```


## Publish

`arc.queues.publish(params, callback)`
Publishes params.payload to the SQS Queue (queue) with name params.name. The params.name parameter should match the queue defined under @queues. Building on the example we described above, to trigger the concert-tickets queue handler, we would set params.name to be concert-tickets.

This allows you to publish to queues from any function within your application (@app app.arc file namespace) to be handled by the queue handler.

When running in local/testing mode, will publish the event to the sandbox.


## Subscribe

`arc.queues.subscribe(params, callback)`

Used to define a lambda function that will act as a queue handler. Queue handlers are defined in your application's .arc file under the @queues pragma. The function code for the accompanying handler to each queued item should use arc.queues.subscribe to wrap the handler. For example, given the following app.arc file snippet:

```md
@queues
concert-tickets
```
... the following file will be initialized representing the event handler for the concert-tickets queue, wherein you need to use arc.queues.subscribe:

```js
// file: src/queues/concert-tickets/index.js
let arc = require('@architect/functions')
module.exports = arc.queues.subscribe(function(payload, callback) {
  console.log(payload)
  callback()
})
```
