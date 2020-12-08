---
title: arc.events
description: Helper functions for event functions
sections:
  - Overview
  - Publish
  - Subscribe
---

## Overview

Event functions are special Lambda functions that enable a pub/sub message bus using AWS SNS. Architect has helpful methods for working with JSON payloads, service discovery, and make responses compatible with Lambda function signatures.

Functions defined by `@event` in the `app.arc` file correspond to an SNS topic and a Lambda function handler. There are two methods you can use `publish()` and `subscribe()`. In order to use it, you must `npm install @architect/functions` to the function folder and require it at the top. 

A common pattern is creating a POST endpoint with an HTTP function that publishes JSON to the event function. This allows for events to be captured from the client that can branch separate asynchronous tasks like signing up for a newsletter or saving telemetry data.

```bash
cd src/http/post-event
npm init -y
npm install @architect/functions
```

## Publish

You can publish a JSON payload to an `@event` function with a name and payload. If no callback is provided, it will return a promise

```js
// src/http/post-event 
// example publish method
let arc = require('@architect/functions')

await arc.events.publish({
  name: 'event-name',
  payload: { "json": "payload"}
})
```


## Subscribe

Architect also has a helper method for subscribing a function to an event. If no callback is provided, it will return a promise.  

Used to define a lambda function that will act as an event handler. Event handlers are defined in your application's Architect project manifest file under the @events pragma. The function code for the accompanying handler to each event should use arc.events.subscribe to wrap the handler.


```js
// src/events/verify-email
// example subscribe method
let arc = require('@architect/functions')

async function accountVerifyEmail(event) {
  let { email } = event
  // ... do some email-related things here
  return
}

exports.handler = arc.events.subscribe(accountVerifyEmail)
```

