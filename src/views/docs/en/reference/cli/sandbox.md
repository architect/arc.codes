---
title: arc sandbox
description: Local development sandbox.
---

Architect dev server: run full Architect projects locally & offline in a sandbox. Sandbox is a HTTP server and an in-memory database that runs your Architect project locally and offline. It emulates most of the application services defined in the `.arc` file. Beyond HTTP traffic, Sandbox can also emulate serverless WebSockets, SNS events, and SQS queues.
Starts a local web server and in-memory database for previewing code defined by `.arc`.


## Usage

```bash
arc sandbox [options]
```

## Environment flags


### Change the port

```bash
PORT=8888 arc sandbox
```

- Change port with flag [-p, --port, port]:

```bash
arc sandbox -p 8888
```

### Environment Variables

`process.env.NODE_ENV : "testing"` is set by default upon start up. You can also pass in your own from the command line before calling Sandbox. 

For example if you want to connect Sandbox to your staging database, run the following from your terminal: 

```bash
NODE_ENV=staging ARC_LOCAL=1 arc sandbox
```
During service discovery, Architect will use your DynamoDB staging tables as a data source, while still using the local HTTP server to invoke your local Lambda functions.

### Quiet Mode

Quiet mode will silence output in the terminal. Sandbox performs a boolean check on `process.env.QUIET`. 

```bash
QUIET=1 arc sandbox
```
By default, Sandbox is run in verbose mode. You can explicitly use [-v, --verbose, verbose] to run verbose mode in your test runners.


### Local Database

Sandbox creates an in-memory instance of [dynalite](https://github.com/mhart/dynalite) with `@tables` and `@indexes` found in the `app.arc` file. When Sandbox is terminated, any data written is cleared from memory. The default endpoint is `http://localhost:5000`. You can set a custom port by using an environment variable, `ARC_TABLES_PORT=5555`

### File Watching and Dependency Hydration

While Sandbox is running, it will watch:

- `app.arc` file changes
- `src/views` and `src/shared` file changes
- contents of your `@static` folder, if fingerprinting is enabled. 

