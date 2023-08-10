---
title: Ruby runtime helpers [deprecated]
category: Runtime helpers
description: Ruby runtime support
---

## ⚠️ Architect's Ruby runtime utility library is now deprecated

Architect continues to support Ruby Lambda, but no longer actively maintains a Ruby utility library. For more information, please see our [runtime support doc](/docs/en/get-started/runtime-support).

The information presented below is for reference only.

---


[View package source on GitHub](https://github.com/architect/functions-ruby/)

## Install

```bash
cd path/to/lambda
bundle init
bundle config set --local path 'vendor/bundle'
bundle add architect-functions
```

See important notes about [deployment configuration for Bundler](../../guides/developer-experience/dependency-management#deployment-configuration).

## API

```ruby
# example lambda function
require 'bundler/setup'
require 'architect/functions'
require 'json'

def handler
  { body: JSON.generate(Arc.reflect) }
end
```

### `Arc`

*`Arc.reflect`* returns a hash of the current AWS resources.

Example output:

```json
{
  "events": {
    "ping": "arn:aws:sns:us-east-1:555:TestStaging-PingTopic-11111111111"
  },
  "queues": {
    "continuum": "https://sqs.us-east-1.amazonaws.com/555/TestStaging-ContinuumQueue-8888888888"
  },
  "static": {
    "bucket": "teststaging-staticbucket-11111111",
    "fingerprint": "false"
  },
  "tables": {
    "noises": "TestStaging-NoisesTable-111111111"
  },
  "ws": {
    "https": "https://xxx.execute-api.us-east-1.amazonaws.com/production/@connections",
    "wss": "wss://xxx.execute-api.us-east-1.amazonaws.com/production"
  }
}
```

### `Arc::HTTP::Session`

- `read(request)` read the current session cookie
- `write(session)` write to the current session; returns a cookie string

### `Arc::Events`

- `publish({name, payload})` to an SNS Topic

### `Arc::Queues`

- `publish({name, payload})` to an SQS Queue

### `Arc::WS`

- `send({id, payload})` a message to a Web Socket

### `Arc::Tables`

- `name(table)` return the CloudFormation name for the given table name
