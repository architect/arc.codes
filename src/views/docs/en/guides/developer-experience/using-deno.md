---
title: Using Deno
category: Developer Experience
description: Deno runtime support
---

The Architect team has a strong interest in [Deno](https://deno.land/) 🦕 as a runtime.

## Current support

[Sandbox](../../reference/cli/sandbox) will use `deno` to invoke functions locally, but Deno is not currently an officially supported AWS Lambda runtime. It is possible to use a [Lambda _layer_](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html#gettingstarted-concepts-layer) to provide the Deno executable, but response times may suffer.

### Sandbox configuration

Set the Deno runtime in your [project (`app.arc`)](../../reference/project-manifest/aws) or [function (`config.arc`)](../configuration/function-config): config

```arc
@aws
runtime deno
```

> 🥇  Make sure you [install Deno locally](https://deno.land/#installation). Architect and Sandbox will still run with Node.js, but will orchestrate `deno` processes when running your functions.

### Lambda Deno layers

Use Deno for deployed functions by specifying one of [these ARNs](https://github.com/beginner-corp/begin-deno-runtime) in your project or function [`layers` config](../../reference/configuration/function-config#layers):

```arc
@aws
runtime deno
layers
  arn:aws:lambda:us-east-1:455488262213:layer:DenoRuntime:37
```

## Runtime helper

Track [runtime helper](https://github.com/architect/functions-deno) progress.
