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
- [`@sandbox`](#%40sandbox) - Define [Sandbox][sandbox] preferences
- [`@sandbox-start`](#%40sandbox-start) - Hook into [Sandbox][sandbox]'s startup

## `@create`

Preferences for resource creation with [`arc init`][init].

### `autocreate`

By adding the `@create` pragma to your preferences file and specifying `autocreate true`, you can enable [`arc sandbox`][sandbox], [`arc deploy`][deploy], and other workflows to automatically run [`arc init`][init] to create boilerplate Lambda handlers and static assets if they do not exist.

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

In the above example, new [`@http` functions][http] will use your `path/to/template/http.js` template instead of the Architect default, while creating new [`@events` functions][events] will use the `path/to/template/events.py`. This will work for either `autocreate true` or the [`arc init` command][init].

## `@env`

Configure environment variables for `testing` with Sandbox and deployed `staging` and `production` environments.

Sync environment variables to your project by using the [`arc env` CLI command][env]. If the preferences file does not exist Architect will generate a `preferences.arc` file.

> Note: any time you run [`arc env`][env], your unsynced local environment variables will be overwritten.

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

Architect [Sandbox][sandbox] supports loading environment variables from a `.env` file. The `.env` will override your `preferences.arc` or `prefs.arc`, and environment variables it defines are only loaded for the `testing` environment. If you require locally configured env vars for `staging` or `production` environments, you must use `pref[erence]s.arc`.

Note: as a friendly reminder, key / value pairs in `.env` files are separated by the `=` symbol.

### Example `.env` file

```bash
A_TESTING_ENV_VAR=something-for-testing
ANOTHER_VAR=only-for-testing
```

## `@sandbox`

Define [Sandbox][sandbox] preferences. If you are not using a `.env` file then any environment variables set using the [`arc env` command][env] will be stored in the preferences file. In this scenario it is best _not_ to revision the preferences file in source control.

### `livereload` - Boolean

Enable automatic reload for HTML views when [`@http`][http] Lambda (`get` or `any`), [`@shared`][shared], or [`@views`][views] code changes. Defaults to `false`. `livereload` is helpful when developing view layouts and styling, as open browser sessions will automatically refresh.

```arc
@sandbox
livereload true
```

> ⚠️ `livereload` will execute your [`@http`][http] handler with each change so long as it is a `get` or `any` path. Traditionally, these routes don't create data, but be mindful of how a reload might interact with your app's data layer before enabling.

### `ports` - List

Designate the local ports used by [Sandbox][sandbox] services. [Sandbox][sandbox] will scan for and use available ports unless specified. If a specified port is unavailable, [Sandbox][sandbox] will fail to boot.

```arc
@sandbox
ports
  http 4200
  events 4211
  queues 4222
  tables 4255
```

### `env` - String

Advanced option: override the local environment to use `staging` or `production` [environment variables][env]; if not specified, defaults to [`testing` variables](#%40env). This setting may introduce unexpected side effects, so only use it if you have a specific technical reason.

```arc
@sandbox
env staging
```

### `external-db` - Boolean

Use an external database instead of Sandbox's built-in dynalite DynamoDB simulator. Useful if you'd rather work with a separate tool like [AWS NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html).

```arc
@sandbox
external-db true
```

### `useAWS` - Boolean

Advanced option that instruct [Sandbox][sandbox] to use live AWS infrastructure where deployed, specifically: [`@tables`][tables] / [`@tables-indexes`][indexes] (DynamoDB), [`@events`][events] (EventBridge), and [`@queues`][queues] (SQS). Defaults to `false`. Notes:
- To use this feature, your local AWS credentials file must have valid keys to use this infrastructure (or calls to AWS will fail)
- If you do not specify an environment via [the `env` preference](#env---string), `staging` will be set automatically; you can also use `production`

```arc
@sandbox
useAWS true
```

### `no-hydrate` - Boolean

Disables [hydration][hydrate]. Defaults to `false`.

```arc
@sandbox
no-hydrate true
```

### `seed-data` - String

Specifies a custom file path to [Sandbox database seed data](../cli/sandbox#database-seed-data).

```arc
@sandbox
seed-data scripts/sandbox-database-seed.mjs
```

## `@sandbox-start`

Hook up CLI commands into [Sandbox][sandbox] startup. Helpful for repetitive tasks like seeding a database or starting up additional services for local development. Each command should be a separate unindented line under the `@sandbox-start` pragma.


### Example

```arc
@sandbox-start
node scripts/seed_db.js
echo 'hello'
```

[deploy]: ../cli/deploy
[env]: ../cli/env
[hydrate]: ../cli/hydrate
[init]: ../cli/init
[sandbox]: ../cli/sandbox
[events]: ../project-manifest/events
[http]: ../project-manifest/http
[indexes]: ../project-manifest/tables-indexes
[queues]: ../project-manifest/queues
[shared]: ../project-manifest/shared
[tables]: ../project-manifest/tables
[views]: ../project-manifest/views
