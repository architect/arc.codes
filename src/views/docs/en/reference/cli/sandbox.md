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

> Additionally, `@scheduled` and `@tables-streams` Lambdas can be emulated via the [@architect/plugin-lambda-invoker](https://www.npmjs.com/package/@architect/plugin-lambda-invoker) plugin


## Usage

```bash
arc sandbox [--port|--host|--disable-symlinks|--no-hydrate|--verbose]
```

## Flags

- `-p`, `--port` - Manually specify HTTP port
  - Defaults to `3333`
- `-h`, `--host` - Specify the host interface for Sandbox to listen on
  - Defaults to `0.0.0.0` (all available interfaces on your machine)
  - To accept local connections only, specify `localhost`
- `-v`, `--verbose` - Enable verbose logging
- `-d`, `--debug` - Enable debug logging
- `-q`, `--quiet` - Disable (most) logging
- `--disable-symlinks` - Disable symlinking `src/shared` into all functions and use file copying instead


## CLI variables

The following variables can be set on the command line when running `arc sandbox`. Other variables will be ignored by Sandbox.

- `ARC_API_TYPE` - Set the API Gateway API type
  - Can be one of `http` (aliased to `httpv2`), `httpv1`, `rest`
  - Defaults to `http`
- `ARC_ENV` - `testing|staging|production`
  - Defaults to `testing`
- `ARC_HOST` - Specify the host interface for Sandbox to listen on
  - Defaults to `0.0.0.0` (all available interfaces on your machine)
  - To accept local connections only, specify `localhost`
- `ARC_LOCAL`- If present and used in conjunction with `ARC_ENV=staging|production`, emulates live `staging` or `production` environment
  - Uses your [local preferences `@env`](../configuration/local-preferences#%40env) environment variables for the appropriate stage
  - Connects Sandbox to live AWS events and DynamoDB infrastructure
  - Requires valid AWS credentials with the same profile name as defined in your [project manifest](../project-manifest/aws#profile)
- Specify ports:
  - `ARC_PORT` - Manually specify HTTP port
    - Defaults to `3333`
  - `ARC_EVENTS_PORT`- Manually specify event bus port
    - Defaults to `4444`
  - `ARC_TABLES_PORT`- Manually specify local DynamoDB port
    - Defaults to `5555`
  - `ARC_INTERNAL_PORT`- Manually specify internal Sandbox + AWS services port
    - Defaults to `2222`
- `ARC_DB_EXTERNAL` - (Boolean) Use an external DynamoDB tool (such as [AWS NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html))
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

- `livereload` - Enable live automatic reload for `@http` `get` and `any` functions that deliver HTML. When a filesystem change is detected in the handler or in [shared or views code](../../guides/developer-experience/sharing-code), open browser sessions will automatically refresh.
  - Defaults to `false`
- `env`<sup>*</sup> - Override the local environment setting to use `staging` or `production` so that Sandbox uses that stage's environment variables as set in [local preferences `@env`](../configuration/local-preferences#%40env) or in the project's `.env` file.
  - Can be one of `testing` (default), `staging`, or `production`
- `useAWS`<sup>*</sup> - Use live AWS infrastructure from Sandbox. Specifically, `@tables`, `@tables-indexes`, `@events`, and `@queues`.
  - Uses the `staging` environment by default, but `env` can be set to `production`.
  - Defaults to `false`
- `no-hydrate` - Disable [function hydration](./hydrate) on Sandbox start.
  - Defaults to `false`
- `seed-data` - Specify a custom file path for seed data to populate `@tables` with on startup
  - Defaults to `./sandbox-seed.json`, `./sandbox-seed.js`
- `external-db` - (Boolean) Use an external DynamoDB tool (such as [AWS NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html))

```arc
@sandbox
livereload true
env production
useAws true
no-hydrate true
```

\* These advanced options should be used with care since they will allow local development code to interact with live AWS resources.


### `@sandbox-start`

Additionally, Sandbox can run shell commands on startup by setting [`@sandbox-start`](../configuration/local-preferences#%40sandbox-start) in [local preferences](../configuration/local-preferences) like so:

```arc
@sandbox-start
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

Sandbox creates an in-memory instance of [dynalite](https://github.com/mhart/dynalite) with `@tables` and `@tables-indexes` found in the `app.arc` file. `@tables-streams` is not currently supported by dynalite.

When Sandbox is terminated, any data written is cleared from memory.

You can set a custom port by using an environment variable: `ARC_TABLES_PORT=5555`.


### Database seed data

You can automatically seed data to Sandbox upon startup by adding a `sandbox-seed.js` or `sandbox-seed.json` file to the root of your project. (You can also specify a custom path with the `seed-data` preference.)

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
```

The above example would add the two rows above to the `things` database each time Sandbox is started.

> Note: This feature is only enabled if the environment is `testing`, so as to prevent the accidental (over)writing of data to a live database.


### Live database example

Connect Sandbox to the DynamoDB staging database on AWS:

```bash
ARC_ENV=staging ARC_LOCAL=1 npx arc sandbox
```
