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

### Environment variables

- `NODE_ENV` default `testing`
- `ARC_API_TYPE` - Set the API Gateway API type
  - Can be one of `http` (aliased to `httpv2`), `httpv1`, `rest`
  - Defaults to `http`
- `ARC_QUIET` - If present, disable (most) logging
- `PORT` - Manually specify HTTP port
  - Defaults to `3333`
- `ARC_LOCAL`- If present and used in conjunction with `NODE_ENV=staging|production`, emulates live `staging` or `production` environment
  - Uses your local `preferences.arc` file's `@staging` or `@production` environment variables
  - Connects Sandbox to live AWS events and DynamoDB infra
  - Requires valid AWS credentials with the same profile name as defined in your project manifest


### Local Database

Sandbox creates an in-memory instance of [dynalite](https://github.com/mhart/dynalite) with `@tables` and `@tables-indexes` found in the `app.arc` file. `@tables-streams` is not currently supported by dynalite. When Sandbox is terminated, any data written is cleared from memory. You can set a custom port by using an environment variable, `ARC_TABLES_PORT=5555`

### Connect sandbox to the staging database

```bash
NODE_ENV=staging ARC_LOCAL=1 npx arc sandbox
```
