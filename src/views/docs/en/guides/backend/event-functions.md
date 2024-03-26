---
title: Event functions
description: Run cloud functions in the background
sections:
  - Overview
  - Getting started
  - Events
  - Deploy
  - Examples
---

## Overview

Asynchronously invoke background tasks in your application with event functions.

Event functions give your app a publish-subscribe (pub / sub) message bus, enabling you to farm out complex or less time-sensitive tasks to a dedicated asynchronous event function. (Synchronous HTTP requests are handled by HTTP functions.)

Event functions are fast, lightweight, stateless, isolated, highly durable, and require no configuration.

**Sections**
[Getting Started](#getting-started)
[Events](#events)
[Deploy](#deploy)
[Examples](#examples)

## Getting started

Events are defined in the `app.arc` manifest file under the `@events` pragma:

```arc
@app
testapp

@events
account-signup
account-check-email
```

### `@events` syntax

- Lower + upper case alphanumeric string
- Maximum of 240 characters
- Dashes, periods, and underscores are allowed
- Must begin with a letter


### Provisioning new event functions

To provision a new event function, in the root of your project, open your app's Architect project manifest file (usually `app.arc`):

1. Find your project's `@events` pragma
  - If you don't already have one, add to a new line: `@events`
2. On a new line, enter the event name you wish to create
  - For example: `account-verify-email`
3. Start the local dev environment to generate some boilerplate event function handlers: `npm start`
  - New function handlers will now appear in `src/events/` (e.g. `src/events/account-signup` & `src/events/account-verify-email`)
4. Commit and push your changes to your repo

Here's what a basic Architect project manifest looks like with the above two event functions specified:
Running `arc deploy` will setup the following AWS resources:

```arc
@app
your-app-name

@events
account-verify-email
```

Running `arc deploy` will setup the following AWS resources:

- `AWS::Lambda::Function`
- `AWS::SNS::Topic`
- `AWS::Lambda::Permission`

Additionally `AWS::SSM::Parameter` resources are created for every SNS Topic which can be inspected at runtime:

- **`/[StackName]/events/[EventName]`** with a value of the generated SNS Topic ARN

> All runtime functions have the environment variables `ARC_APP_NAME` and `ARC_STACK_NAME` which is the currently deployed CloudFormation stack name; this can be used by [`aws-lite`](https://aws-lite.org), `aws-sdk`, and `@architect/functions` to look up these values in SSM

---

## Events

### Event Subscribers

Running `arc init` with the `app.arc` file above will generate the following local source code:

- `/src/events/account-signup`
- `/src/events/account-check-email`

These are event handlers subscribed to the event name defined in `app.arc`.

> Events are supported by `arc sandbox`

All runtime Lambda functions share an IAM Role that allows them to publish events to any SNS Topic in the currently deployed CloudFormation stack.

### Event publishers

Publish an event payload to an SNS Topic.

Node

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let name = 'account-signup'
  let payload = {body: req.body}
  await arc.events.publish({name, payload})
  return {statusCode: 201}
}
```

Ruby

```ruby
require 'architect-functions'

def handler
  Arc::Events.publish name: 'account-signup', payload: {ok:true}
  {statusCode: 201}
end
```

Python

```python
import arc.events

def handler(request, context):
  arc.events.publish(name='account-signup', payload={'ok':True})
  return {'statusCode': 201}
```

---
## Deploy

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy dirty` to overwrite deployed staging lambda functions
- `arc deploy production` to run a full CloudFormation production deployment

---

## Examples

### Publish events from any other function

Once deployed you can invoke `@event` handlers from any other function defined under the same `@app` namespace:

```javascript
var arc = require('@achitect/functions')

arc.events.publish({
  name: 'hit-counter',
  payload: {hits: 1},
}, console.log)
```

### Subscribe functions to events

An example of a `hit-counter` event handler:

```javascript
var arc = require('@architect/functions')

function count(payload, callback) {
  console.log(JSON.stringify(payload, null, 2))
  // maybe save count to the db here
  callback()
}

exports.handler = arc.events.subscribe(count)
```
