---
title: Project Layout
category: Get started
description: Explaining the layout of an Architect project
sections:
  - Project Layout
  - Manifest format overview
  - Example
---

Architect favors *convention over configuration* and projects have the following significant folder structure:

```bash
.
├── public .......... # Static assets (js, css, svg, images, etc.)
├── src
│   ├── shared ...... # code shared by ALL Lambda functions
│   ├── views ....... # code shared by HTTP GET Lambda functions
│   ├── http ........ # HTTP Lambda functions
│   ├── events ...... # Event Lambda functions
│   ├── queues ...... # Queue Lambda functions
│   ├── scheduled ... # Scheduled Lambda functions
│   ├── tables ...... # Table Trigger Lambda functions
│   └── ws .......... # Web Socket Lambda functions
└── app.arc
```

> All folders are **OPTIONAL**. Architect ignores any other folders.

---

## Manifest format overview

Architect projects have either of these three versions of a manifest file in the root that sets up your infrastructure as code. This captures the infrastructure requirements beside the code it will run in your revision control. 

- `app.arc`
- `arc.yaml`
- `arc.json`

The app.arc manifest format is intentionally simple to author and straightforward to read.

Resources are defined within pragmas and pragmas can be ordered arbitrarily. Comments are preceded by a `#`.

**The `app.arc` manifest can be broadly split into three sections:**

### Global system config

These sections are for global system level env configuration. The most important being the `@app` namespace which is used to prefix all generated resources.

- [`@app`](/docs/en/reference/arc-pragmas/@app) **[Required]** The application namespace
- [`@domain`](/docs/en/reference/arc-pragmas/@domain) Assign a domain name to your app (ACM, API Gateway, and Route 53)
- [`@aws`](/docs/en/reference/arc-pragmas/@aws) AWS config

### Lambda Function config

These sections deal with Lambda functions and their event sources. By convention Architect promotes one event source per function.

- [`@http`](/docs/en/reference/arc-pragmas/@http) HTTP routes (API Gateway)
- [`@events`](/docs/en/reference/arc-pragmas/@events) Event pub/sub (SNS)
- [`@queues`](/docs/en/reference/arc-pragmas/@queues)  queues and handlers for them (SQS)
- [`@scheduled`](/docs/en/reference/arc-pragmas/@scheduled) Invoke functions specified times (CloudWatch Events)
- [`@ws`](/docs/en/reference/arc-pragmas/@ws) Web Socket functions (API Gateway)

### Persistence config

These sections deal with config of various persistence resources.

- [`@static`](/docs/en/reference/arc-pragmas/@static) Buckets for hosting static assets (S3)
- [`@tables`](/docs/en/reference/arc-pragmas/@tables) Database tables and trigger functions (DynamoDB)
- [`@indexes`](/docs/en/reference/arc-pragmas/@indexes) Table global secondary indexes (DynamoDB)

> 👉🏽 `app.arc` comments out anything after hash symbol `#`.

## Example

Provision a project with the following `app.arc` file:

```arc
# this is going to be great!
@app
testapp

@events
hello

@http
get /
get /posts # the posts go here
```

Running `npx create` creates the following code:

```bash
.
├── src
│   ├── events
│   │   └── hello/
│   └── http
│       ├── get-index/index.js
│       └── get-posts/index.js
└── app.arc
```

The generated code was also immediately deployed to the built-in `staging` environment. Subsequent edits to the local code are deployed by running `npx deploy`.

Happy with staging? Ship a release to production by running `npx deploy production`.

Time to celebrate! ✨


## Infrastructure as code

Architect is an [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) (IaC) framework. Architect defines a high level manifest file, in multiple open formats, and otherwise views cloud infrastructure as a build artifact.

### Formats supported

Architect supports a native text file format `app.arc` in addition to popular formats: `package.json`, `arc.json`, `arc.yaml` and `arc.toml`. Teams can choose the dialect that works best for them. 

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
