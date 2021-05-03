---
title: '@aws timeout'
description: Lambda function configuration
---

Configure Lambda function `timeout` in seconds to a max of `900`. (`15` minutes.)

The default timeout (if no value supplied) is `5`. (`5` seconds.)

## Example

```arc
@aws
timeout 30
```
