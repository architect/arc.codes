---
title: '@sandbox'
description: Sandbox environment variables
---

> Architect preferences (`preferences.arc`, or `prefs.arc`) defines settings for local Architect workflows. This file is intended to be added to `.gitignore`.

Define `arc sandbox` preferences.

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
