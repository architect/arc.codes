---
title: '@aws concurrency'
description: Lambda function configuration
---

Configure Lambda function concurrency. If not present concurrency is unthrottled.

## Examples

### Limit execution to one invocation at a time

```arc
@aws
concurrency 1
```

> Tip: `@events` functions with `concurrency 1` create a queue-like primitive

### Disable invocation by setting concurrency to zero

```arc
@aws
concurrency 0
```
