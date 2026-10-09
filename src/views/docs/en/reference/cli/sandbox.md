---
title: arc sandbox
category: CLI
description: Local development sandbox.
sections:
  - Usage
  - Flags
  - Environment Variables
  - Keyboard Shortcuts
  - Local preferences
  - Environment variables
  - Local database
---

Start a local development server that emulates AWS infrastructure for your Architect application. Sandbox provides a complete local development environment that includes:

- HTTP server for your [`@http` routes][http]
- WebSocket server for [`@ws` routes][ws]
- Dynalite in-memory database for [`@tables`][tables] and [`@tables-indexes`][indexes]
- Local event bus for [`@events`][events] and [`@queues`][queues]
- Static asset serving for [`@static`][static] assets
- File watching and live reloading

> Additionally, `@scheduled` and `@tables-streams` Lambdas can be emulated via the [@architect/plugin-lambda-invoker](https://www.npmjs.com/package/@architect/plugin-lambda-invoker) plugin

## Usage

```bash
arc sandbox [flags]
```

## Flags

- `-p`, `--port`: Port the HTTP server will listen on (default is `3333`)
- `-h`, `--host`: Host the server will bind to (default is `0.0.0.0`)
- `--disable-symlinks`: Do not use symbolic links for [shared code][sharing]; use file copying instead (slower)
- `--disable-delete-vendor`: Do not delete `node_modules` or `vendor` directories upon startup
- `-q`, `--quiet`: Minimize console output during operation
- `-v`, `--verbose`: Print more detailed output during operation
- `-d`, `--debug`: Print even more detailed information for debugging

## Environment Variables

The following variables can be set on the command line when running `arc sandbox`:

- `ARC_HTTP_PORT`, `PORT` - Set the HTTP server port (same as `--port`)
- `ARC_EVENTS_PORT` - Set the events/queues service port (default `4444`)
- `ARC_TABLES_PORT` - Set the DynamoDB emulator port (default `5555`)
- `ARC_HOST` - Set the host the server will bind to
- `ARC_QUIET`, `QUIET` - Minimize console output (same as `--quiet`)
- `ARC_ENV` - `testing|staging|production`
  - Defaults to `testing`
- `ARC_LOCAL`- If present and used in conjunction with `ARC_ENV=staging|production`, emulates live `staging` or `production` environment
  - Uses your [local preferences `@env`](../configuration/local-preferences#%40env) environment variables for the appropriate stage
  - Connects Sandbox to live AWS events and DynamoDB infrastructure
  - Requires valid AWS credentials with the same profile name as defined in your [project manifest](../project-manifest/aws#profile)
- `ARC_INTERNAL_PORT`- Manually specify internal Sandbox + AWS services port
  - Defaults to `2222`
- `ARC_DB_EXTERNAL` - (Boolean) Use an external DynamoDB tool (such as [AWS NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html))

### Example

Run Sandbox in quiet mode on a different port:

```bash
ARC_QUIET=1 PORT=8888 npx arc sandbox
```

## Keyboard Shortcuts

Sandbox registers keyboard shortcuts to help with local development (note: they are all capital letters!):

- `S` - Hydrate only `src/shared`
- `V` - Hydrate only `src/views`
- `H` - Hydrate both `src/shared` and `src/views`
- `Ctrl+C` - Gracefully shut down the sandbox

## Local preferences

Several Architect [local preferences][prefs] can be leveraged to change how Sandbox works while developing locally.

### Sandbox preferences

Check out the [`@sandbox` preferences](../configuration/local-preferences#%40sandbox) reference for more information.

> ⚠️ These preferences should be used with care as they can allow your local development sandbox to use live deployed infrastructure and data.

```arc
@sandbox
livereload true
env production
useAws true
no-hydrate true
```

### Sandbox startup scripts

Sandbox can run shell commands on startup by setting [`@sandbox-start`](../configuration/local-preferences#%40sandbox-start) in [local preferences][prefs] like so:

```arc
@sandbox-start
node scripts/seed_db.js
echo 'hello'
```

### `@create`

Upon starting, Sandbox can automatically scaffold resources (via [`init`](init)) found in the [application's manifest](../../get-started/project-manifest) that do not yet exist. Options are set with [`@create` in local preferences](../configuration/local-preferences#%40create).

```arc
@create
autocreate true
templates
  http path/to/template/http.js
  events path/to/template/events.py
```

### `@env`

Architect Sandbox will load variables for Sandbox's current environment (`testing`, `staging`, or `production`) from a [local preferences file with `@env`](../configuration/local-preferences#%40env). If a project contains a `.env` file, Architect will load those variables _instead_, and only for the `testing` environment.

Variables from local preference files and `.env` will **not** be merged. Further details, including the variable load-strategy are [outlined below](#environment-variables).

## Environment variables

Sandbox automatically loads environment variables for availability at runtime (`process.env.MY_VAR` in Node.js). Environment variables can be set in a few locations. It's important to understand how each source is prioritized when developing locally.

### Load strategy

Sandbox will prioritize...

1. A project's `.env` file (if it exists),
2. then project-level Architect preferences,
3. and finally global Architect preferences.

Variables across these sources are **not** merged.

Using a [local preferences file with `@env`](../configuration/local-preferences#%40env) offers the most flexibility since variables can be specified per environment: `testing`, `staging`, and `production`.

### Example scenario

If `.env` is found, Sandbox will only use the variables for the `testing` environment, and not load any variables from any Arc preferences files. Given the following case with 3 environment variable sources:

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

```javascript
process.env.URL === 'https://arc.codes' // true
process.env.ADMIN_PASS // undefined
```

## Local database

Sandbox creates an in-memory instance of [dynalite](https://github.com/architect/dynalite) with [`@tables`][tables] and [`@tables-indexes`][indexes] found in the `app.arc` file. `@tables-streams` is not currently supported by dynalite.

When Sandbox is terminated, any data written is cleared from memory.

You can set a custom port by using an environment variable: `ARC_TABLES_PORT=5555`.

### Database seed data

You can automatically seed data to Sandbox upon startup by adding a `sandbox-seed.[c|m]js` or `sandbox-seed.json` file to the root of your project. (You can also specify a custom path with [the `seed-data` preference](../configuration/local-preferences#seed-data---string).)

Your seed data should be an object whose properties correspond to `@tables` names, and have arrays of rows to seed. For example:

```arc
@tables
things
  id *String
  sort **String
```

```javascript
// sandbox-seed.js
module.exports = {
  things: [
    {
      id: 'foo',
      sort: 'bar',
      arbitrary: 'data',
    },
    {
      id: 'fiz',
      sort: 'buz',
      arbitrary: 'info',
    }
  ]
}
// sandbox-seed.mjs
export default {
  things: [
    {
      id: 'foo',
      sort: 'bar',
      arbitrary: 'data',
    }
  ]
}
```

The above example would add the two rows above to the `things` database each time Sandbox is started.

> Note: This feature is only enabled if the environment is `testing`, so as to prevent the accidental (over)writing of data to a live database.

### Live database example

Connect Sandbox to the DynamoDB staging database on AWS:

```bash
ARC_ENV=staging ARC_LOCAL=1 npx arc sandbox
```

[http]: ../project-manifest/http
[ws]: ../project-manifest/ws
[tables]: ../project-manifest/tables
[indexes]: ../project-manifest/tables-indexes
[events]: ../project-manifest/events
[queues]: ../project-manifest/queues
[static]: ../project-manifest/static
[sharing]: ../../guides/developer-experience/sharing-code
[prefs]: ../configuration/local-preferences
