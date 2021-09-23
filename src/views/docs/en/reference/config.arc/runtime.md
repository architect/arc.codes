---
title: '@aws runtime'
category: config.arc
description: Lambda function configuration
---

Configure Lambda function `runtime`:

- `nodejs14.x` (default)
- `deno`
- `python3.8`
- `ruby2.5`

Also configurable but not supported by Architect Sandbox:

- `java8`
- `go1.x`
- `dotnetcore2.1`

## Example

```arc
@aws
runtime deno
```
