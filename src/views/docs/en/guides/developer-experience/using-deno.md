---
title: Using Deno
category: Developer Experience
description: Deno runtime support
---

The Architect team has a strong interest in [Deno](https://deno.land/) as a runtime.

## Current support

Deno is not currently an officially supported AWS Lambda runtime, but Architect can add a [Lambda _layer_](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html#gettingstarted-concepts-layer) to provide the Deno executable on AWS infrastructure.  
Additionally, [Sandbox](../../reference/cli/sandbox) will use `deno` to invoke functions while developing locally.

> ⚠️  Lambda layers can increase response times when the function is cold. This approach to enabling Deno is not ideal for user interaction.

### Project configuration

Set the Deno runtime in your [project (`app.arc`)](../../reference/project-manifest/aws) or [function (`config.arc`)](../../reference/configuration/function-config) configuration:

```arc
@aws
runtime deno
```

> 🦕  To enable Sandbox support for Deno, make sure you [install Deno locally](https://deno.land/#installation).  

Architect and Sandbox will still run with Node.js, but will orchestrate `deno` processes when running your functions.

### Deno runtime version

The current provided layer is Deno v1.19.1.

> 🧑‍🔬  The Arc team is actively working on providing up-to-date and configurable Deno layers.
