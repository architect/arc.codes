---
title: '@aws runtime'
description: Lambda function configuration
---

Configure Lambda function `runtime`: 

- `nodejs12.x` (default)
- `deno`
- `python3.8`
- `ruby2.5`

Also configurable but not supported by the sandbox: 

- `java8`
- `go1.x` 
- `dotnetcore2.1`

## Example

```arc
@aws
runtime deno
```
