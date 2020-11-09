---
title: Architect project structure
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Creating new resources & files
  - Special files & folders
---

## Overview

The Architect manifest file is the core of your apps functionality. All projects have a lightweight `app.arc` (or `arc.yaml`, or `arc.json`) manifest file in the root. This project manifest file defines the application primitives used to generate your apps infrastructure.

The `app.arc` manifest format makes it quick to spin up new functions into your app. Resources like HTTP Functions are defined within pragmas that can be ordered arbitrarily. Comments are preceded by a `#`.

```bash
# This is going to be great!
@app
testapp

@http
get /api
post /api
```
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

## Creating new resources & files

Here we'll provision an extensive Architect project with the following app.arc file:

```bash
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

Running arc init creates the following code:

```bash
/
├── src
│   ├── events
│   │   └── an-important-background-task/
│   └── http
│       ├── get-index/
│       └── get-things/
└── app.arc
```
If you add further pragmas, it is safe to run (and re-run) arc init to generate further code.

## Special files & folders

ADD ME!
<!-- `view` folder/ `shared` folder -->

