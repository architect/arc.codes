# Architect project manifest format

Architect favors <em>convention over configuration</em>. Projects have a lightweight `app.arc` (or `.arc`, [`arc.yaml`, or `arc.json`](#yaml-json)) manifest file in the root.

This project manifest defines the application primitives used to generate your infrastructure.

---

### Topics

<a href=#manifest-format-overview><b>Manifest format overview</b></a>

<a href=#yaml-json><b>Opt into `arc.yaml` or `arc.json` manifests</b></a>

---



## Manifest format overview

The `app.arc` manifest format is intentionally simple to author and straightforward to read.

Resources are defined within pragmas, pragmas can be ordered arbitrarily, and comments are preceded by a `#`:

```arc
# This is going to be great!
@app
testapp

@http
get /api
post /api
```

The `app.arc` manifest can be broadly split into three conceptual classifications of configuration:


### 1. Global / system

These pragmas are for global and cloud-vendor configuration, the most important of which being the `@app` namespace (which is used to prefix and identify all generated resources).

- [`@app`](/reference/arc/app) - **[Required]** The application namespace
- [`@aws`](/reference/arc/aws) - AWS-specific config (also includes global runtime setting)


### 2. Functions

These pragmas deal with cloud functions (i.e. Lambdas); function pragmas are always reflective of a single event source (i.e. `@http` functions are invoked by HTTP events; `@events` functions are invoked by events to the event bus).

- [`@http`](/reference/arc/http) - HTTP routes (API Gateway)
- [`@events`](/reference/arc/events) - Event pub/sub (SNS)
- [`@queues`](/reference/arc/queues) - Queues & queue handlers (SQS)
- [`@scheduled`](/reference/arc/scheduled) - Invoke functions on specified schedules (CloudWatch Events)
- [`@ws`](/reference/arc/ws) - WebSocket functions (API Gateway)


### 3. Persistence

These pragmas specify various persistence resources.

- [`@static`](/reference/arc/static) - Buckets for hosting static assets (S3)
- [`@tables`](/reference/arc/tables) - Database tables & trigger functions (DynamoDB)
- [`@indexes`](/reference/arc/indexes) - Table global secondary indexes (DynamoDB)


## Example

Here we'll provision an extensive Architect project with the following `app.arc` file:

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

Running `arc init` creates the following code:

```bash
/
├── src
│   ├── events
│   │   └── hello/
│   └── http
│       ├── get-index/
│       └── get-things/
└── app.arc
```

If you add further pragmas, it is safe to run (and re-run) `arc init` to generate further code.

---

## <span id=yaml-json>Opt into `arc.yaml` or `arc.json` manifests</span>

Developers that prefer JSON or YAML can opt into using either syntax in `arc.json` or `arc.yaml`, respectively (instead of `app.arc or .arc`).


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
