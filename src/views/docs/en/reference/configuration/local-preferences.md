---
title: Local preferences
category: Configuration
description: Sandbox local preferences
sections:
  - '@create'
  - '@env'
  - '@sandbox'
  - '@sandbox-start'
---

> Architect preferences (`preferences.arc`, or `prefs.arc`) defines settings for local Architect workflows. This file is intended to be added to `.gitignore`.

- [`@create`](#%40create) - Preferences for resource creation with `arc init`
- [`@env`](#%40env) - Configure environment variables
- [`@sandbox`](#%40sandbox) - Define Sandbox preferences
- [`@sandbox-start`](#%40sandbox-start) - Hook into Sandbox's startup

## `@create`

Preferences for resource creation with `arc init`.

### `autocreate`

By adding the `@create` pragma to your preferences file and specifying `autocreate true`, you can enable `arc sandbox`, `arc deploy`, and other workflows to automatically run `arc init` to create boilerplate Lambda handlers and static assets if they do not exist.

```arc
@create
autocreate true
```

### `templates`

Define custom boilerplate Lambda handlers on a per-pragma basis with `templates`:

```arc
@create
templates
  http path/to/template/http.js
  events path/to/template/events.py
```

In the above example, new `@http` functions will use your `path/to/template/http.js` template instead of the Architect default, while creating new `@events` functions will use the `path/to/template/events.py`. This will work for either `autocreate true` or the `arc init` command.

## `@env`

Configure environment variables for `testing` with Sandbox and deployed `staging` and `production` environments.

Sync environment variables to your project by using the [`arc env` CLI command](../cli/env). If the preferences file does not exist Architect will generate `preferences.arc` file.

> Note: any time you run `arc env`, your unsynced local environment variables will be overwritten.

### Example

```arc
@env
testing
  A_TESTING_ENV_VAR something-for-testing
  ANOTHER_VAR only-for-testing

staging
  A_STAGING_ENV_VAR something-for-staging

production
  A_PRODUCTION_ENV_VAR something-for-production
```

### `.env` file support

Architect Sandbox supports loading environment variables from a `.env` file. The `.env` will override your `preferences.arc` or `prefs.arc`, and environment variables it defines are only loaded for the `testing` environment. If you require locally configured env vars for `staging` or `production` environments, you must use `pref[erence]s.arc`.

Note: as a friendly reminder, key / value pairs in `.env` files are separated by the `=` symbol.

### Example `.env` file

```bash
A_TESTING_ENV_VAR=something-for-testing
ANOTHER_VAR=only-for-testing
```


## `@sandbox`

Define [Sandbox](../cli/sandbox) preferences. If you are not using a `.env` file then any environment variables set using the [`arc env` CLI](../cli/env) will be stored in the preferences file. In this scenario it is best _not_ to revision the preferences file in source control.

### `livereload` - Boolean

Enable automatic reload for HTML views when `@http` Lambda (`get` or `any`), `@shared`, or `@views` code changes. `livereload` is helpful when developing view layouts and styling.

```arc
@sandbox
livereload true
```

Note: `livereload` will execute your `@http` handler with each change so long as it is a `get` or `any` path. Traditionally, these routes don't create data, but be mindful of how a reload might interact with your app's data layer before enabling.

### `ports` - List

Designate the local ports used by Sandbox services. Sandbox will scan for and use available ports unless specified. If a specified port is unavailable, Sandbox will fail to boot.

```arc
@sandbox
ports
  http 4200
  events 4211
  queues 4222
  tables 4255
```

### `env` - String

Advanced option: set the `ARC_ENV` stage to `staging` or `production` and use the env vars for that stage (see the `@env` pragma above); if not specified, defaults to `testing`. This setting may introduce unexpected side effects, so only use it if you have a specific technical reason.

```arc
@sandbox
env staging
```

### `useAWS` - Boolean

Advanced option that uses live AWS infrastructure where deployed, specifically: `@tables` / `@tables-indexes` (DynamoDB), `@events` (EventBridge), and `@queues` (SQS). Notes:
- To use this feature, your local AWS credentials file must have valid keys to use this infrastructure (or calls to AWS will fail)
- If you do not specify an environment, `staging` will be set automatically; you can also use `production`

```arc
@sandbox
useAWS true
```

### `no-hydrate` - Boolean

Disables hydration

```arc
@sandbox
no-hydrate true
```

## `@sandbox-start`

Hook up CLI commands into [Sandbox](../cli/sandbox) startup. Helpful for repetitive tasks like seeding a database or starting up additional services for local development. Each command should be a separate unindented line under the `@sandbox-start` pragma.


### Example

```arc
@sandbox-start
node scripts/seed_db.js
echo 'hello'
```

> Note: the older alias `@sandbox-startup` still works, but will be deprecated in a future release. Please use `@sandbox-start`
