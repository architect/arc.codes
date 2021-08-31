---
title: arc sandbox
description: Local development sandbox.
---

Architect projects work locally and offline. It emulates most app resources defined in `app.arc`:

- `@http`
- `@static`
- `@ws`
- `@events`
- `@queues`
- `@tables` and `@indexes`

> At this time `arc sandbox` does not emulate `@scheduled`

## Usage

```bash
arc sandbox [--port|--verbose|--disable-symlinks|--no-hydrate]
```

### Flags

- `-p`, `--port`, `port` Manually specify HTTP port (default `3333`)
- `-v`, `--verbose`, `verbose` Enable verbose logging
- `--disable-symlinks` Disable symlinking `src/shared` and copy instead
- `--no-hydrate` Disables hydration

### Environment variables

- `NODE_ENV` default `testing`
- `ARC_API_TYPE` - Set the API Gateway API type
  - Can be one of `http` (aliased to `httpv2`), `httpv1`, `rest`
  - Defaults to `http`
- `ARC_QUIET` - If present, disable (most) logging
- `PORT` - Manually specify HTTP port
  - Defaults to `3333`
- `ARC_EVENTS_PORT`- Manually specify event bus port
  - Defaults to `3334`
- `ARC_TABLES_PORT`- Manually specify local DynamoDB port
  - Defaults to `3335`
- `ARC_LOCAL`- If present and used in conjunction with `NODE_ENV=staging|production`, emulates live `staging` or `production` environment
  - Uses your local `.arc-env` file's `@staging` or `@production` environment variables
  - Connects Sandbox to live AWS events and DynamoDB infra
  - Requires valid AWS credentials with the same profile name as defined in your project manifest


### Local Database

Sandbox creates an in-memory instance of [dynalite](https://github.com/mhart/dynalite) with `@tables` and `@indexes` found in the `app.arc` file. When Sandbox is terminated, any data written is cleared from memory. The default endpoint is `http://localhost:5000`. You can set a custom port by using an environment variable, `ARC_TABLES_PORT=5555`

### Connect sandbox to the staging database

```bash
NODE_ENV=staging ARC_LOCAL=1 arc sandbox
```

### File watching

The sandbox restarts when the following files or directories are modified:

- `app.arc`
- `@views` source folder
- `@shared` source folder
- `@static` source folder if fingerprinting is enabled
