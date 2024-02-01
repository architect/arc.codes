---
title: Queue functions
description: Run cloud functions in the background!
sections:
  - Overview
  - Getting started
  - Events
  - Examples
---

## Overview

The `@queues` pragma define Amazon Simple Queue Service [(Amazon SQS)](https://aws.amazon.com/sqs/) topics and the corresponding Lambda handlers for them. You can subscribe a Lambda function to an SQS Queue and then asynchronously publish JSON payloads to it. SQS automatically polls to receive messages. The programming model is identical to SNS but offers different service guarantees and configuration options. In particular, SNS will retry failed invocations twice whereas SQS will retry for 4 days (by default).

Read the official [AWS docs on Lambda retry behavior](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)

**Sections**
[Getting Started](#getting-started)
[Queues](#queues)
[Examples](#examples)

## Getting started

### Work Locally

Queues are defined in the `app.arc` manifest file under the `@queues` pragma:

This `app.arc` file defines two `@queues`:

```arc
@app
testapp

@queues
convert-image
publish-log
```

Which generates the corresponding code:

```bash
├── queues
│   ├── convert-image/
│   └── publish-log/
├── app.arc
└── package.json
```

### Syntax

- Lower + upper case alphanumeric string
- Maximum of 240 characters
- Dashes, periods, and underscores are allowed
- Must begin with a letter

---

## Queues

### Queue Subscribers

Running `arc init` with the `app.arc` file above will generate the following local source code:

- `/src/queues/convert-image`
- `/src/queues/publish-log`

These are queue handlers subscribed to the queue name defined in `app.arc`.

> Queues are supported by `arc sandbox`

### Provision

Running `arc deploy` will setup the following AWS resources:

- `AWS::Lambda::Function`
- `AWS::SQS::Queue`
- `AWS::Lambda::EventSourceMapping`

Additionally `AWS::SSM::Parameter` resources are created for every SQS Queue which can be inspected at runtime:

- **`/[StackName]/events/[QueueName]`** with a value of the generated SQS Queue URL

> All runtime functions have the environment variables `ARC_APP_NAME` and `ARC_STACK_NAME` which is the currently deployed CloudFormation stack name; this can be used by [`aws-lite`](https://aws-lite.org), `aws-sdk`, and `@architect/functions` to look up these values in SSM

### Deploy

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy dirty` to overwrite deployed staging lambda functions
- `arc deploy production` to run a full CloudFormation production deployment


---

## Examples

### Publish

All runtime Lambda functions share an IAM Role that allows them to publish events to any SQS Queue in the currently deployed CloudFormation stack.

### Publish an event payload to an SQS Queue URL

Node

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let name = 'account-signup'
  let payload = {body: req.body}
  await arc.queues.publish({name, payload})
  return {statusCode: 201}
}
```

Ruby

```ruby
require 'architect-functions'

def handler
  Arc::Queues.publish name: 'account-signup', payload: {ok:true}
  {statusCode: 201}
end
```

Python

```python
import arc.queues

def handler(request, context):
  arc.queues.publish(name='account-signup', payload={'ok':True})
  return {'statusCode': 201}
```
