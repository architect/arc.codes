# Architect preferences

> ## `preferences.arc`, `prefs.arc`


## Overview

The Architect preferences file (`preferences.arc`, or `prefs.arc` if you prefer) defines settings for local Architect workflows. You should probably `gitignore` your preferences files.

> Note: `preferences.arc` / `prefs.arc` replaces the now deprecated `.arc-env` file. For the indefinite future, Sandbox will still use the `.arc-env` file if present.


<a name="create"></a>

## `@create` - Resource creation preferences

### `autocreate` - Boolean

By adding the `@create` pragma to your preferences file and specifying `autocreate true`, you can enable Sandbox, Deploy, and other workflows to automatically create boilerplate Lambda handlers and static assets if found to be missing. You can think of this as an automated convenience for running `arc create`. Example:

```arc
@create
autocreate true
```


### `templates`

You can define custom boilerplate Lambda handlers on a per-pragma basis with the `templates` setting like so:

```arc
@create
templates
  http path/to/template/http.js
  events path/to/template/events.py
```

In the above example, new `@http` functions will use your `path/to/template/http.js` template instead of the Architect default, while creating new `@events` functions will use the `path/to/template/events.py`. This will work for either `autocreate true` or the `arc create` command.


<a name="env"></a>

## `@env` - Environment variables

When working locally, your project's environment variables are loaded from your preferences file. Architect's three built-in environments are supported: `testing`, `staging`, and `production`.

Sync environment variables to your project by using the [`arc env` CLI command](/reference/cli/env). (If you don't already have a preferences file, the CLI command will generate a `preferences.arc` file for you.)

You also can test new environment variables by adding them to your preferences file.

> Note: any time you run `arc env`, your unsynced local environment variables will be overwritten.

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


<a name=".env"></a>

## `.env` file - Environment variables

Alternately, if you prefer to use a `.env` file, its presence will override your `preferences.arc` or `prefs.arc` file. If using a `.env` file, its environment variables will be loaded for whichever environment Sandbox is running (`testing`, `staging`, or `production`).

```env
A_TESTING_ENV_VAR=something-for-testing
ANOTHER_VAR=only-for-testing
```


<a name="sandbox"></a>

## `@sandbox` - Sandbox preferences

### `env` - Boolean

Advanced option: set the `ARC_ENV` + `NODE_ENV` stage to `staging` or `production` and use the env vars for that stage (see the `@env` pragma above); if not specified, defaults to `testing`. This setting may introduce unexpected side effects, so only use it if you have a specific technical reason.

```arc
@sandbox
env staging
```


### `useAWS` - Boolean

Advanced option that uses live AWS infrastructure where deployed, specifically: `@tables` / `@indexes` (DynamoDB), `@events` (EventBridge), and `@queues` (SQS). Notes:
- To use this feature, your local AWS credentials file must have valid keys to use this infrastructure (or calls to AWS will fail)
- If you do not specify an environment, `staging` will be set automatically; you can also use `production`

```arc
@sandbox
useAWS true
```


### `startup`

Execute arbitrary commands or scripts on Sandbox startup.

```arc
@sandbox
startup
  echo 'Hi there!'
  npm run test
  node some/arbitrary/script.js
```
