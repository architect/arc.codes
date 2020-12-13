---
title: '@aws layers'
description: Lambda function configuration
---

Configure Lambda function `layers` with max 5 Lambda Layer ARNs.

> Warning: Lambda Layers must be in the same region as they are deployed

## Examples

Add one layer:

```arc
@aws
layers arn:aws:lambda:us-east-1:764866452798:layer:ghostscript:1
```

Or multiple layers:

```arc
@aws
layers
  arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:4
  arn:aws:lambda:us-east-1:145266761615:layer:pandoc:1
```

> Tip: find [awesome layers](https://github.com/mthenw/awesome-layers) 
