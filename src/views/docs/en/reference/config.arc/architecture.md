---
title: '@aws architecture'
category: config.arc
description: Lambda architecture configuration
---

Configure Lambda function [CPU `architecture`](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) to be one of `x86_64` or `arm64`. This setting defaults to `x86_64` if not specified. `arm64` only works if your region supports it.

**Warning** the architect sandbox doesn't not yet have support for ARM architectures so be wary of packages with binary modules.

## Example

```arc
@aws
architecture arm64
```
