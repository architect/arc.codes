---
title: Mission
description: 160 (or fewer) character description of this document!
---

## Mission

Architect is on a mission to make building web apps free from infrastructure complexity and vendor cruft. Our goal is to focus on the core business logic required to create value, ship only the code that matters, iterate faster and still enjoy unprecedented availability guarantees.

## Infra as code

Architect defines a high level manifest file, in multiple open formats, and views cloud infrastructure as a build artifact.

- Focus on defining app architecture with clear language in plain text
- Generate code to work locally and totally offline
- Deploy and extend with standard CloudFormation templates
- The format, parser, and tooling are also all completely open to extension

> The Architect manifest is entirely portable between cloud vendors however no ports to clouds other than AWS have been made as of today

## Formats supported

Architect supports a native text file format `app.arc` in addition to popular formats: `arc.json`, `arc.yaml` and `arc.toml` when teams prefer those dialects. 

The `app.arc` format follows a few simple rules:

- Whitespace is significant 
- Comments start with `#`
- Pragmas start with `@` and organize cloud resources and their configuration

`app.arc` files define the following pragmas:

- `@app` defines the application namespace
- `@aws` defines AWS specific configuration
- `@events` defines SNS event handlers
- `@http` defines HTTP handlers for API Gateway
- `@indexes` defines global secondary indexes on DynamoDB tables
- `@macros` define macros to extend the generated CloudFormation
- `@queues` defines SQS event handlers
- `@scheduled` defines EventBridge functions that run on a schedule
- `@static` defines S3 buckets for static assets
- `@tables` defines DynamoDB database tables and trigger functions for them
- `@ws` defines API Gateway WebSocket handlers

An `app.arc` file example:

```bash
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

Running `arc init` in the same directory as the `app.arc` file above generates the following function code:

```
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

The `app.arc` format is terse, easy to read, and quickly learnable to author. The expressions in a `app.arc` file unlock the formerly complex tasks of cloud infrastructure provisioning, deployment, and orchestration.
