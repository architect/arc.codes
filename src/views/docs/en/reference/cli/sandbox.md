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

### Flags

- `[--port, -p]` Manually specify HTTP port (default `3333`)
- `[--verbose, -v]` Enable verbose logging
- `[--disable-symlinks]` Disable symlinking `src/shared` and copy instead
- `[--no-hydrate]` Disables hydration

### Local preferences

Sandbox will take into account Architect [local preferences](../configuration/local-preferences).

#### `@sandbox`

The following can be set as a part of the [`@sandbox`](../configuration/local-preferences#sandbox) pragma.

- `env`<sup>*</sup> - Override the local environment setting to use `staging` or `production` so that Sandbox uses that stage's environment variables as set in local preferences `@env` or in the project's `.env` file.
  - Can be one of `testing` (default), `staging`, or `production`
- `useAws`<sup>*</sup> - Use live AWS infrastructure from Sandbox. Specifically, `@tables`, `@tables-indexes`, `@events`, and `@queues`. Uses the `staging` environment by default, but `env` can be set to `production`.
  - Defaults to `false`
- `no-hydrate` - Disable [function hydration](./hydrate) on Sandbox start.
  - Defaults to `false`

```arc
@sandbox
env production
useAws true
no-hydrate true
```

\* These advanced options should be used with care since they will allow local development code to interact with live AWS resources.

#### `@sandbox-startup`

Additionally, Sandbox can run shell commands on startup by setting [`@sandbox-startup`](../configuration/local-preferences#sandbox-startup) in [local preferences](../configuration/local-preferences).

```arc
@sandbox-startup
node scripts/seed_db.js
echo 'hello'
```

### Environment variables

- `NODE_ENV` - `testing|staging|production`
  - Defaults to `testing`
- `ARC_API_TYPE` - Set the API Gateway API type
  - Can be one of `http` (aliased to `httpv2`), `httpv1`, `rest`
  - Defaults to `http`
- `PORT` - Manually specify HTTP port
  - Defaults to `3333`
- `ARC_LOCAL`- If present and used in conjunction with `NODE_ENV=staging|production`, emulates live `staging` or `production` environment
  - Uses your local preferences `@staging` or `@production` environment variables
  - Connects Sandbox to live AWS events and DynamoDB infrastructure
  - Requires valid AWS credentials with the same profile name as defined in your [project manifest](../project-manifest/aws#profile)
- `ARC_QUIET` - If present, disable (most) logging


### Local Database

Sandbox creates an in-memory instance of [dynalite](https://github.com/mhart/dynalite) with `@tables` and `@tables-indexes` found in the `app.arc` file. `@tables-streams` is not currently supported by dynalite.

When Sandbox is terminated, any data written is cleared from memory.

You can set a custom port by using an environment variable: `ARC_TABLES_PORT=5555`.

#### Live database example

Connect Sandbox to the DynamoDB staging database on AWS:

```bash
NODE_ENV=staging ARC_LOCAL=1 npx arc sandbox
```
