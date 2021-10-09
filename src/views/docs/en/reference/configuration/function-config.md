---
title: Function config
category: Configuration
description: Lambda function configuration
sections:
  - 'runtime'
  - 'memory'
  - 'timeout'
  - 'concurrency'
  - 'layers'
  - 'policies'
  - 'architecture'
---

Configure individual Lambda function properties (e.g. `src/http/get-index/config.arc`) with the `@aws` pragma and the following properties:

- [`runtime`](#runtime) - `nodejs14.x` (default), `deno`, `python3.7`, `python3.6`, or `ruby.5`, etc.
- [`memory`](#memory) - number, between `128`MB and `3008`MB in 64 MB increments.
- [`timeout`](#timeout) - number, in seconds (max `900`)
- [`concurrency`](#concurrency) - number, `0` to AWS account maximum (if not present, concurrency is unthrottled)
- [`layers`](#layers) - Up to 5 Lambda layer ARNs; **must be in the same region as deployed**
- [`policies`](#policies) - Configure [AWS SAM policy templates](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html)
- [`architecture`](#architecture) - [AWS Architecture](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) for the function: `x86_64` (default) or `arm64`

> Note: any function configurations made globally in your project manifest will be overridden by individual functions. For example, if your `app.arc` includes `memory 128`, and `src/http/get-index/config.arc` includes `memory 3008`, all functions except `get /` will be configured with 128MB of memory, while `get /` will override that global with 3008MB.

### Example `config.arc`

```arc
@aws
runtime python3.7
memory 256
timeout 3
concurrency 1
layers {ARN}
policies {ARN}
architecture arm64
```

Read more about the [Lambda limits](https://docs.aws.amazon.com/lambda/latest/dg/limits.html) and [resource model](https://docs.aws.amazon.com/lambda/latest/dg/resource-model.html).


## `runtime`

Configure Lambda function `runtime`:

- `nodejs14.x` (default)
- `deno`
- `python3.8`
- `ruby2.5`

Also configurable but not supported by Architect Sandbox:

- `java8`
- `go1.x`
- `dotnetcore2.1`

### Example

```arc
@aws
runtime deno
```

## `memory`

Configure Lambda function `memory` between `128` MB to `10240` MB, in `1` MB increments.

Memory size also directly correlates with CPU speed; higher memory levels are available in more capable Lambda clusters

### Example

```arc
@aws
memory 1024
```

## `timeout`

Configure Lambda function `timeout` in seconds to a max of `900`. (`15` minutes.)

The default timeout (if no value supplied) is `5`. (`5` seconds.)

### Example

```arc
@aws
timeout 30
```

## `concurrency`

Configure Lambda function concurrency. If not present concurrency is unthrottled.

#### Examples

Limit execution to one invocation at a time

```arc
@aws
concurrency 1
```

> Tip: `@events` functions with `concurrency 1` create a queue-like primitive

Disable invocation by setting concurrency to zero

```arc
@aws
concurrency 0
```

## `layers`

Configure Lambda function `layers` with max 5 Lambda Layer ARNs.

> Warning: Lambda Layers must be in the same region as they are deployed

### Examples

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

## `policies`

Configure custom Lambda function `policies`, enabling granular and specific privileges and access controls.

The `policies` setting takes one or more IAM policy ARNs or AWS-managed policy names (e.g. `AmazonDynamoDBFullAccess`).

Configuring one or more policies will completely remove all of Architect's default Lambda privileges. To restore Architect's default privileges, include a policy named `architect-default-policies`.

> Note: `architect-default-policies` is an internal Architect framework setting based on the least-privilege permissions specific to your project. It is not a managed / public IAM policy, and will not be found in your AWS console.


### Examples

Lambda only has a single set of permissions (as defined by the AWS-managed `S3CrudPolicy` policy):

```arc
@aws
policies
  S3CrudPolicy
```

Lambda has both an AWS-managed policy (`S3CrudPolicy`) and all default Architect permissions:
```arc
@aws
policies
  S3CrudPolicy
  architect-default-policies
```

Terser single-line version of the above example:
```arc
@aws
policies S3CrudPolicy architect-default-policies
```

---

### Additional resources

- [AWS IAM policy ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns)
- [Community-maintained list of AWS-managed policies](https://github.com/z0ph/MAMIP/tree/master/policies)

## `architecture`

Configure Lambda function [CPU `architecture`](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) to be one of `x86_64` or `arm64`. This setting defaults to `x86_64` if not specified. `arm64` only available in supported AWS regions.

> Note: locally, Architect Sandbox executes the function's runtime with your machine's native architecture.

### Example

```arc
@aws
architecture arm64
```
