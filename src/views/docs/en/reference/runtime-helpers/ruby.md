---
title: Ruby runtime helpers
category: Runtime helpers
description: Ruby runtime support
---

[Helpers for working with the Architect generated runtime resources.](https://github.com/architect/functions-ruby)

## Install

```bash
cd path/to/lambda
bundle init
bundle install --path vendor/bundle
bundle add architect-functions
```

## API

```ruby
# example lambda function
require 'json'
require 'architect/functions'

def handler
  {body: JSON.generate(Arc.reflect)}
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

