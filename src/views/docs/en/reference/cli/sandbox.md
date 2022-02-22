---
title: arc sandbox
category: CLI
description: Local development sandbox.
---

Architect projects work locally and offline. Sandbox emulates most app resources defined in `app.arc`:

- `@http`
- `@static`
- `@ws`
- `@events`
- `@queues`
- `@tables` and `@tables-indexes`

> At this time Sandbox does not emulate `@scheduled`

## Usage

```bash
arc sandbox [--port|--disable-symlinks|--no-hydrate|--verbose]
```

## Flags

- `[--port, -p]` Manually specify HTTP port (default `3333`)
- `[--verbose, -v]` Enable verbose logging
- `[--disable-symlinks]` Disable symlinking `src/shared` and copy instead
- `[--no-hydrate]` Disables hydration

## CLI variables

The following variables can be set on the command line when running `arc sandbox`. Other variables will be ignored by Sandbox.

- `NODE_ENV` - `testing|staging|production`
  - Defaults to `testing`
- `ARC_API_TYPE` - Set the API Gateway API type
  - Can be one of `http` (aliased to `httpv2`), `httpv1`, `rest`
  - Defaults to `http`
- `PORT` - Manually specify HTTP port
  - Defaults to `3333`
- `ARC_LOCAL`- If present and used in conjunction with `NODE_ENV=staging|production`, emulates live `staging` or `production` environment
  - Uses your [local preferences `@env`](../configuration/local-preferences#%40env) environment variables for the appropriate stage
  - Connects Sandbox to live AWS events and DynamoDB infrastructure
  - Requires valid AWS credentials with the same profile name as defined in your [project manifest](../project-manifest/aws#profile)
- `ARC_QUIET` - If present, disable (most) logging

### Example

Run Sandbox in quiet mode on a different port:

```bash
ARC_QUIET=1 PORT=8888 npx arc sandbox
```

## Local preferences

Several Architect [local preferences](../configuration/local-preferences) can be leveraged to change how Sandbox works while developing locally.

### `@sandbox`

The following can be set as a part of the [`@sandbox`](../configuration/local-preferences#%40sandbox) pragma.

- `livereload` - Enable automatic reload for `@http` `get` and `any` functions. When a filesystem change is detected in the handler, `@shared`, or `@views` code, the function will be reloaded in open browser sessions.
  - Defaults to `false`
- `env`<sup>*</sup> - Override the local environment setting to use `staging` or `production` so that Sandbox uses that stage's environment variables as set in [local preferences `@env`](../configuration/local-preferences#%40env) or in the project's `.env` file.
  - Can be one of `testing` (default), `staging`, or `production`
- `useAws`<sup>*</sup> - Use live AWS infrastructure from Sandbox. Specifically, `@tables`, `@tables-indexes`, `@events`, and `@queues`.
  - Uses the `staging` environment by default, but `env` can be set to `production`.
  - Defaults to `false`
- `no-hydrate` - Disable [function hydration](./hydrate) on Sandbox start.
  - Defaults to `false`

```arc
@sandbox
livereload true
env production
useAws true
no-hydrate true
```

\* These advanced options should be used with care since they will allow local development code to interact with live AWS resources.

### `@sandbox-startup`

Additionally, Sandbox can run shell commands on startup by setting [`@sandbox-startup`](../configuration/local-preferences#%40sandbox-startup) in [local preferences](../configuration/local-preferences).

```arc
@sandbox-startup
node scripts/seed_db.js
echo 'hello'
```

### `@create`

Upon starting, Sandbox can automatically scaffold resources (via [`arc init`](./init)) found in the [application's manifest](../../get-started/project-manifest) that do not yet exist. Options are set with [`@create` in local preferences](../configuration/local-preferences#%40create).

- `autocreate` - Set to `true` to enable automatic creation of boilerplate Lambda handlers and static assets if they do not exist.
- `templates` - Specify templates for automatic resource scaffolding.
  - `<pragma name> path/to/template.ext`
  - Does not enable `autocreate`

```arc
@create
autocreate true
templates
  http path/to/template/http.js
  events path/to/template/events.py
```

### `@env`

Architect Sandbox will load variables for Sandbox's current environment (`testing`, `staging`, or `production`) from a [local preferences file with `@env`](../configuration/local-preferences#%40env). If a project contains a `.env` file, Architect will load those variables _instead_.

Variables from local preference files and `.env` will **not** be merged. Further details, including the variable load-strategy are [outlined below](#environment-variables).

## Environment variables

Sandbox automatically loads environment variables for availability at runtime (`process.env.MY_VAR` in Node.js). Environment variables can be set in a few locations. It's important to understand how each source is prioritized when developing locally.

### Load strategy

Sandbox will prioritize...

1. a project's `.env` file (if it exists),
2. then project-level Architect preferences,
3. and finally global Architect preferences. 

Variables across these sources are **not** merged.

Using a [local preferences file with `@env`](../configuration/local-preferences#%40env) offers the most flexibility since variables can be specified per environment: `testing`, `staging`, and `production`.

### Example scenario

If `.env` is found, Sandbox will not load any variables from any Arc preferences. Given the following case with 3 environment variable sources:

```bash
# ./.env
URL="https://arc.codes"
```

```arc
# ./prefs.arc
@env
testing
  URL www.architect.fake
```

```arc
# ~/.preferences.arc
@env
testing
  URL ftp://arc.ftp
  ADMIN_PASS zero cool
```

The following is true in a Node.js function run with Sandbox:

```js
process.env.URL === 'https://arc.codes' // true
process.env.ADMIN_PASS // undefined
```

## Local database

Sandbox creates an in-memory instance of [dynalite](https://github.com/mhart/dynalite) with `@tables` and `@tables-indexes` found in the `app.arc` file. `@tables-streams` is not currently supported by dynalite.

When Sandbox is terminated, any data written is cleared from memory.

You can set a custom port by using an environment variable: `ARC_TABLES_PORT=5555`.

### Live database example

Connect Sandbox to the DynamoDB staging database on AWS:

```bash
NODE_ENV=staging ARC_LOCAL=1 npx arc sandbox
```
