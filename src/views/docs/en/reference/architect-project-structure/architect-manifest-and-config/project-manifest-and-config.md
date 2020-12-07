---
title: Project manifest &amp; config
description: Opt into arc.yaml or arc.json manifests
sections:
  - app.arc
  - JSON
  - YAML
  - TOML
---

## Opt into arc.yaml or arc.json manifests

Developers that prefer JSON or YAML can opt into using either syntax in arc.json or arc.yaml, respectively (instead of app.arc).

## app.arc example

```arc
# This is going to be great!

@app
testapp

@aws
profile fooco
region us-west-1
bucket your-private-deploy-bucket

@static
fingerprint true

@ws
@http
get /
get /things # the things go here
post /form
delete /api/:item

@events
an-important-background-task

@queues
our-event-bus

@scheduled
backups

@tables
accounts
  accountID *String
  created **String

@indexes
accounts
  username *String
```

## JSON example

```json
{
  "app": "testapp",
  "description": "Example arc-to-json",
  "aws": {
    "region": "us-west-1",
    "profile": "fooco"
  },
  "static": {
    "fingerprint": true
  },
  "http": [
    {"get": "/"},
    {"get": "/things"},
    {"post": "/form"},
    {"delete": "/api/:item"},
  ],
  "events": [
    "an-important-background-task"
  ],
  "queues": [
    "our-event-bus"
  ],
  "scheduled": {
    "backups": "rate(1 day)"
  },
  "tables": [
    {
      "accounts": {
        "accountID": "*String",
        "created": "**String"
      }
    }
  ],
  "indexes": [
    {
      "accounts": {
        "username": "*String"
      }
    }
  ]
}
```

## YAML example

```yaml
---
# comments ooh ahh
app: testapp
description: Example arc-to-json
aws:
  region: us-west-1
  profile: personal
static:
  fingerprint: true
# static: {} also valid
http:
- get: /
- get: /things
- post: /form
- delete: /api/:item
events:
- an-important-background-task
queues:
- our-event-bus
scheduled:
- backups
tables:
- accounts:
    accountidID: "*String"
    created: "**String"
indexes:
- accounts:
    username: "*String"
```

## TOML

ADD ME!

