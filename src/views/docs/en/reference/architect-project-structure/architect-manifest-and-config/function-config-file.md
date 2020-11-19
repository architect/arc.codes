---
title: Function config file
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Concurrency
  - Layers
  - Memory
  - Policies
  - Runtime
  - Timeout
---

## Overview

The `.arc-config` file is where you configure individual Lambda function properties. It is an individual configuration manifest file that lives in the same folder as each Lambda it configures. This file is intended to be committed into your project git repository.

- `runtime` - Officially supported: one of `nodejs12.x` (default), `nodejs10.x`, `deno`, `python3.7`, `python3.6`, or `ruby2.5`
  - Also configurable, but not officially supported by Architect: `java8`, `go1.x`, `dotnetcore2.1`
- `memory` - number, between 128 MB and 3008 MB in 64 MB increments
  - Memory size also directly correlates with CPU speed; higher memory levels are available in more capable Lambda clusters
- `timeout` - number, in seconds (max 900)
- `concurrency` - number, 0 to AWS account maximum (if not present, concurrency is unthrottled)
- `layers` - Lambda layer ARNs (must be in the same region as deployed)
- `policies` - Additional Lambda role policy ARNs

> Read more about the [Lambda limits](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) and [resource model](https://docs.aws.amazon.com/lambda/latest/dg/configuration-console.html).

## Concurrency

Concurrency is the number of requests that your function is serving at any given time. When your function is invoked, Lambda allocates an instance of it to process the event. When the function code finishes running, it can handle another request. If the function is invoked again while a request is still being processed, another instance is allocated, which increases the function's concurrency.

> To learn more about layers for your functions head [here](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html)

## Layers

You can configure your Lambda function to pull in additional code and content in the form of layers. A layer is a ZIP archive that contains libraries, a custom runtime, or other dependencies. With layers, you can use libraries in your function without needing to include them in your deployment package.

Layers let you keep your deployment package small, which makes development easier. You can avoid errors that can occur when you install and package dependencies with your function code.

> To learn more about layers for your functions head [here](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)

## Memory

The amount of memory available to the function during execution. Your function memory allocates between 128 MB and 3008 MB in 64 MB increments. 

## Policies

Lambda provides managed policies that grant access to Lambda API actions and, in some cases, access to other services used to develop and manage Lambda resources. Lambda updates the managed policies as needed, to ensure that your users have access to new features when they're released.

## Runtime

Architect supports multiple languages through the use of runtimes. You choose a runtime when you create a function, and you can change runtimes by updating your function's configuration (.arc-config). The underlying execution environment provides additional libraries and environment variables that you can access from your function code.

> Officially supported: one of nodejs12.x (default), nodejs10.x, deno, python3.7, python3.6, or ruby2.5

## Timeout

The amount of time that Lambda allows a function to run before stopping it. The default is 3 seconds. The maximum allowed value is 900 seconds.
