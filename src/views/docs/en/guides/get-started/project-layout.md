---
title: Project Layout
description: 160 (or fewer) character description of this document!
sections:
  - Project Layout
  - Manifest format overview
---

## Project Layout

Architect projects have a `app.arc`, `arc.yaml` or `arc.json` manifest file in the root. This captures the infrastructure requirements beside the code it will run in your revision control. Architect favors <em>convention over configuration</em> and projects have the following significant folder structure:

```bash
.
├── public
├── src
│   ├── shared ...... code shared by ALL Lambda functions
│   ├── views ....... code shared by HTTP GET Lambda functions
│   ├── http ........ HTTP Lambda functions
│   ├── events ...... Event Lambda functions
│   ├── queues ...... Queue Lambda functions
│   ├── scheduled ... Scheduled Lambda functions
│   ├── tables ...... Table Trigger Lambda functions
│   └── ws .......... Web Socket Lambda functions      
└── app.arc
```

All folders are **OPTIONAL**. Architect ignores any other folders.

<hr>

## Manifest format overview

The app.arc manifest format is intentionally simple to author and straightforward to read.

Resources are defined within pragmas, pragmas can be ordered arbitrarily, and comments are preceded by a #:

**The `app.arc` manifest can be broadly split into three sections:**

### Global system config

These sections are for global system level env configuration. The most important being the `@app` namespace which is used to prefix all generated resources.

- [`@app`](/reference/app) **[Required]** The application namespace
- [`@domain`](/reference/domain) Assign a domain name to your app (ACM, API Gateway, and Route 53)
- [`@aws`](/reference/aws) AWS config

### Lambda Function config

These sections deal with Lambda functions and their event sources. By convention Architect promotes one event source per function. 

- [`@http`](/reference/http) HTTP routes (API Gateway)
- [`@events`](/reference/events) Event pub/sub (SNS)
- [`@queues`](/reference/queues)  queues and handlers for them (SQS)
- [`@scheduled`](/reference/scheduled) Invoke functions specified times (CloudWatch Events)
- [`@ws`](/reference/ws) Web Socket functions (API Gateway)

### Persistence config

These sections deal with config of various persistence resources.

- [`@static`](/reference/static) Buckets for hosting static assets (S3)
- [`@tables`](/reference/tables) Database tables and trigger functions (DynamoDB)
- [`@indexes`](/reference/indexes) Table global secondary indexes (DynamoDB)

> 👉🏽 `app.arc` comments out anything after hash symbol `#`. 

### Example

Provision a project with the following `app.arc` file:

```
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

