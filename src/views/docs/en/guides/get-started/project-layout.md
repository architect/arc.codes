---
title: Project layout
category: Get started
description: The layout and default structure of an Architect project
---

Architect projects have the following significant folder structure by default:

```bash
.
├── public .......... # Static assets (js, css, svg, images, etc.)
├── src
│   ├── shared ...... # Code shared by all Lambda functions
│   ├── views ....... # Code shared by HTTP GET Lambda functions
│   ├── macros ...... # Modify the generated CloudFormation
│   ├── http ........ # @http Lambda functions
│   ├── events ...... # @event Lambda functions
│   ├── queues ...... # @queue Lambda functions
│   ├── scheduled ... # @scheduled Lambda functions
│   ├── tables ...... # @table stream Lambda functions
│   └── ws .......... # @ws Lambda functions
└── app.arc
```

> All folders are **OPTIONAL**. Architect ignores any additional folders. All source paths can be reconfigured to suit unique project needs.

---

## Manifest file format overview

Architect projects have a manifest file in the root of the project that represents the Infrastructure as Code. This manifest file captures the infra requirements beside the code it will run in revision control to ensure every deployment is completely deterministic.

Architect supports the following manifest files:

- `.arc`
- `app.arc`
- `arc.yaml`
- `arc.yml`
- `package.json`
- `arc.json`
- `arc.toml`

> The maintainers are considering `arc.xml`; if this is something you want let us know!

## More on `app.arc`

The `app.arc` format follows a few simple rules:

- whitespace is significant
- comments start with `#`
- a pragma starts with `@`
- pragmas can be ordered arbitrarily

**The `app.arc` manifest can be broadly split into three sections:**

- Project configuration
- Lambda resource definition
- Persistence resource definition

### Project configuration

These sections are for global system level env configuration. The most important being the `@app` namespace which is used to prefix all generated resources.

- [`@app`](../../reference/project-manifest/app) **[Required]** application namespace
- [`@aws`](../../reference/project-manifest/aws) AWS specific configuration
- [`@views`](../../reference/project-manifest/views) configure path to view source code
- [`@shared`](../../reference/project-manifest/shared) configure path to shared source code
- [`@macros`](../../reference/project-manifest/macros) modify generated CloudFormation

### Lambda resource definition

These sections deal with Lambda functions and their event sources. Architect conventionally promotes one event source per function. Single responsibility functions are faster to deploy, easier to debug and secure to least privilege.

- [`@http`](../../reference/project-manifest/http) HTTP routes (API Gateway)
- [`@events`](../../reference/project-manifest/events) Event pub/sub (SNS)
- [`@queues`](../../reference/project-manifest/queues)  queues and handlers for them (SQS)
- [`@scheduled`](../../reference/project-manifest/scheduled) Invoke functions specified times (CloudWatch Events)
- [`@ws`](../../reference/project-manifest/ws) Web Socket functions (API Gateway)

### Persistence resource definition

These pragmas represent persistence resources.

- [`@static`](../../reference/project-manifest/static) Bucket for hosting static assets (S3)
- [`@tables`](../../reference/project-manifest/tables) Database tables and trigger functions (DynamoDB)
- [`@indexes`](../../reference/project-manifest/indexes) Table global secondary indexes (DynamoDB)

## Example

<arc-viewer default-tab=arc>
<div slot=contents>
<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
# this is going to be great!

@app
hello

@static
fingerprint true

@ws
action
connect
default
disconnect

@http
get /
get /likes
post /likes

@events
hit-counter

@scheduled
daily-affirmation rate(1 day)

@tables
likes
  likeID *String
  stream true

@indexes
likes
  date *String
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot="content">

```json
{
  "app": "hello",
  "static": {
    "fingerprint": true
  },
  "ws": [
    "action",
    "connect",
    "default",
    "disconnect"
  ],
  "http": [
    ["get", "/"],
    ["get", "/likes"],
    ["post", "/likes"]
  ],
  "events": [
    "hit-counter"
  ],
  "scheduled": {
    "daily-affirmation": "rate(1 day)"
  },
  "tables": {
    "likes": {
      "likeID": "*String",
      "stream": true
    }
  },
  "indexes": {
    "likes": {
      "date": "*String"
    }
  }
}
```
</div>
</arc-tab>


<arc-tab label=yaml>
<h5>yaml</h5>
<div slot="content">

```yaml
app: "hello"
static:
  fingerprint: true
ws:
  - action
  - connect
  - default
  - disconnect
http:
  - get: "/"
  - get: "/likes"
  - post: "/likes"
events:
  - hit-counter
scheduled:
  - daily-affirmation: "rate(1 day)"
tables:
  - likes: {likeID: "*String", stream: true}
indexes:
  - likes: {date: "*String"}
```
</div>
</arc-tab>

<arc-tab label=toml>
<h5>toml</h5>
<div slot=content>

```toml
app="hello"

[static]
fingerprint=true

ws=[
  "action",
  "connect",
  "default",
  "disconnect"
]

http=[
  ["get", "/"],
  ["get", "/likes"],
  ["post", "/likes"],
]

events=["hit-counter"]

[scheduled]
daily-affirmation=["rate(1 day)"]

[[tables]]

[tables.likes]
likeiD="*String"
stream=true

[[indexes]]
[indexes.likes]
date="*String"
```
</div>
</arc-tab>

</div>
</arc-viewer>

Running `arc init` in the same directory as the file above generates the following Lambda function code:

```bash
.
├── src
│   ├── http
│   │   ├── get-index/index.js
│   │   ├── get-likes/index.js
│   │   └── post-likes/index.js
│   │
│   ├── events
│   │   └── hit-counter/
│   │
│   ├── scheduled
│   │   └── daily-affirmation/
│   │
│   ├── tables
│   │   └── likes/
│   │
│   └── ws
│       ├── action/
│       ├── connect/
│       ├── default/
│       └── disconnect/
│
└── app.arc
```

The `app.arc` format is terse, easy to read, and quickly learnable to author. The expressions in an `app.arc` file unlock the formerly complex tasks of cloud infrastructure provisioning, deployment, and orchestration.
