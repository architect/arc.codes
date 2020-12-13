---
title: '@env'
description: Sandbox environment variables
---

> Architect preferences (`preferences.arc`, or `prefs.arc`) defines settings for local Architect workflows. This file is intended to be added to `.gitignore`.

Configure environment variables for `arc sandbox` at runtime. Achitect's three built-in environments are supported: `testing`, `staging`, and `production`.

Sync environment variables to your project by using the [`arc env` CLI command](/reference/cli/env). (If you don't already have a preferences file, the CLI command will generate a `preferences.arc` file for you.)

> Note: any time you run `arc env`, your unsynced local environment variables will be overwritten.

## Example

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
