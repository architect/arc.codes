---
title: '@sandbox'
category: prefs.arc
description: Sandbox environment variables
---

> Architect preferences (`preferences.arc`, or `prefs.arc`) defines settings for local Architect workflows.

Define [`arc sandbox`](../cli/sandbox) preferences. If you are not using a [`.env` file](.env) then any environment variables set using the [`arc env` CLI](../cli/env) will be stored in the preferences file. In this scenario it is best _not_ to revision the preferences file in source control.

### `env` - String

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

### `no-hydrate` - Boolean

Disables hydration

```arc
@sandbox
no-hydrate true
```
