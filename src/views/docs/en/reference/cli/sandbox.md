---
title: sandbox
description: Documentation for Sandbox Local Development Environment
sections:
  - Usage
  - Flags
  - Init scripts
---

## Overview

Architect dev server: run full Architect projects locally & offline in a sandbox. Sandbox is a HTTP server and an in-memory database that runs your Architect project locally and offline. It emulates most of the application services defined in the `.arc` file. Beyond HTTP traffic, Sandbox can also emulate serverless WebSockets, SNS events, and SQS queues.
Starts a local web server and in-memory database for previewing code defined by `.arc`.

[Source code is available on GitHub](https://github.com/architect/sandbox/)

## Command Line Usage and Flags

Sandbox can be called directly from the command line, `arc sandbox`, or a JavaScript API. This makes it a great environment to preview work and invoke functions during automated testing.

Sandbox starts by parsing the `app.arc` file, hydrating function dependencies, starting a database, and if available, running startup scripts and loading environment variables. 

```bash
arc sandbox
```

### Ports

Sandbox starts an HTTP server listening to Port:3333 by default.

- Change port with an environment variable:

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

### Supported Architect Primitives

Sandbox currently handles the following function primitives and services: 

```
@http
@static
@events
@queues
@ws
@tables
@indexes
```

## API

### `sandbox.cli({ver}, callback)`

Invokes [`sandbox.start()`][start] to start a sandbox instance, passing the parameter object in. Then sets up a filesystem watcher for changes to:

1.) Files within shared folders (`src/shared/, src/views/`, etc.), in which case it will re-[hydrate][hydrate] all functions with the new files, and
2.) The Architect project manifest file, in which case it will re-start the HTTP server by calling into [`http()`][http].

Prints the specified `ver` on init, or falls back to the version string defined in this project's `package.json`.

### `sandbox.db.start(callback)`

Starts a singleton [local in-memory DynamoDB server](https://www.npmjs.com/package/dynalite), automatically creating any tables or indexes defined in the project manifest's [`@tables`][tables] pragma. Also creates a local session table.

Returns an object with a `close([callback])` method that gracefully shuts the server down.

Invokes `callback` once the DB is up and listening.

### `sandbox.events.start(callback)`

If Architect project manifest defines [`@queues`][queues] or [`@events`][events], sets up inter-process communication between your events and queues via a tiny web server.

Returns an object with a `close([callback])` method that gracefully shuts the server down.

Invokes `callback` once the server is up and listening.

### `sandbox.http.start(callback)`

If Architect project manifest defines [`@http`][http] or [`@websocket`][WebSocket] routes, starts the necessary servers and sets up routes as defined in the project manifest.

Invokes `callback` once the server is up and listening.

### `sandbox.http.close([callback])`

Closes any servers started via [`sandbox.http.start()`][start].

### `sandbox.start({port, options, quiet}, callback)`

Initializes the sandbox; first checks that ports are available to consume, prints a banner, loading basic environment variables and necessary AWS credentials, and sets up any local databases via [`sandbox.db.start()`][db], events or queues via [`sandbox.events.start()`][events-start], HTTP handlers via [`sandbox.http.start()`][http-start].

Invokes `callback` once everything is ready, passing `null` as the first parameter and `sandbox.end` as the second parameter.

Return a `promise` if `callback` is falsy.

### `sandbox.end([callback])`

Shuts down the sandbox, closing down all running servers and services. Returns a `promise` if `callback` is falsy.

## Init scripts

Sandbox can run scripts in a `scripts` folder in the root of the project. They can be named `sandbox-startup.js`,`sandbox-startup.py`, and `sandbox-startup.rb`, depending on your runtime. Startup scripts are useful for performing initial environment tasks such as populating a test database. The only requirement is to export an asynchronous function.

Example: 

```js
// scripts/sanbox-startup.js
let data = require('@begin/data')
// startUpScript is executed when Sandbox starts
// and adds the following data to the local in-memory db.
async function startUpScript() {
  let table = 'greetings'
  let greetings = [
    { table, key: 'Māori', greeting: `Kia ora` },
    { table, key: 'Swahili', greeting: `Hujambo` },
    { table, key: 'Japanese', greeting: `Kon'nichiwa` } ]
  await data.set(greetings)
}
module.exports = startUpScript
```

