---
title: Project Layout
description: Explaining the layout of an Architect project
sections:
  - Project Layout
  - Manifest format overview
  - Example
---

## Project Layout

Architect projects have either of these three versions of a manifest file in the root that sets up your infrastructure as code. 

- `app.arc`
- `arc.yaml`
- `arc.json` 

This captures the infrastructure requirements beside the code it will run in your revision control. Architect favors *convention over configuration* and projects have the following significant folder structure:

```bash
.
├── public
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

The app.arc manifest format is intentionally simple to author and straightforward to read.

Resources are defined within pragmas and pragmas can be ordered arbitrarily. Comments are preceded by a #:

**The `app.arc` manifest can be broadly split into three sections:**

### Global system config

These sections are for global system level env configuration. The most important being the `@app` namespace which is used to prefix all generated resources.

- [`@app`](/en/reference/arc-pragmas/@app) **[Required]** The application namespace
- [`@domain`](/en/reference/arc-pragmas/@domain) Assign a domain name to your app (ACM, API Gateway, and Route 53)
- [`@aws`](/en/reference/arc-pragmas/@aws) AWS config

### Lambda Function config

These sections deal with Lambda functions and their event sources. By convention Architect promotes one event source per function. 

- [`@http`](/en/reference/arc-pragmas/@http) HTTP routes (API Gateway)
- [`@events`](/en/reference/arc-pragmas/@events) Event pub/sub (SNS)
- [`@queues`](/en/reference/arc-pragmas/@queues)  queues and handlers for them (SQS)
- [`@scheduled`](/en/reference/arc-pragmas/@scheduled) Invoke functions specified times (CloudWatch Events)
- [`@ws`](/en/reference/arc-pragmas/@ws) Web Socket functions (API Gateway)

### Persistence config

These sections deal with config of various persistence resources.

- [`@static`](/en/reference/arc-pragmas/@static) Buckets for hosting static assets (S3)
- [`@tables`](/en/reference/arc-pragmas/@tables Database tables and trigger functions (DynamoDB)
- [`@indexes`](/en/reference/arc-pragmas/@indexes) Table global secondary indexes (DynamoDB)

> 👉🏽 `app.arc` comments out anything after hash symbol `#`. 

## Example

Provision a project with the following `app.arc` file:

```bash
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

