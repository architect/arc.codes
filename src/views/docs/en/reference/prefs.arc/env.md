---
title: '@env'
category: prefs.arc
description: Sandbox environment variables
---

> Architect preferences (`preferences.arc`, or `prefs.arc`) defines settings for local workflows. This file is intended to be added to `.gitignore`.

Configure environment variables for `testing` with `arc sandbox` and deployed `staging` and `production` environments.

Sync environment variables to your project by using the [`arc env` CLI command](/reference/cli/env). If the preferences file does not exist Architect will generate `preferences.arc` file.

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
