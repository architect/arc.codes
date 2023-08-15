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
  - 'storage'
---

Configure individual Lambda function properties (e.g. `src/http/get-index/config.arc`).

## `@arc`

Use the `@arc` pragma to disable Architect features for a specific function:

- `env` - boolean, `true` (default) or `false` to skip loading local environment variables.
- `shared` - boolean, `true` (default) or `false` to skip hydrating project code from `@shared`.
- `views` - boolean, `true` (default) or `false` to skip hydrating project code from `@views`.

### Example `config.arc`

```arc
# src/function/dir/config.arc
@arc
env false
shared false
views false
```

## `@aws`

Configure the deployed function with [the `@aws` pragma](../project-manifest/aws) and the following properties:

- [`runtime`](#runtime) - string, Lambda runtime or alias: `nodejs16.x` (default), `python3.7`, `dotnetcore3.1`, `node`, `py`, `.net`, etc.
- [`memory`](#memory) - number, between `128` and `3008` MB in 64 MB increments.
- [`timeout`](#timeout) - number, in seconds (max `900`)
- [`concurrency`](#concurrency) - number, `0` to AWS account maximum (if not present, concurrency is unthrottled)
- [`provisionedConcurrency`](#provisionedconcurrency) - number, `1` to AWS account maximum (disabled by default)
- [`layers`](#layers) - Up to 5 Lambda layer ARNs; **must be in the same region as deployed**
- [`policies`](#policies) - Configure [AWS SAM policy templates](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html)
- [`architecture`](#architecture) - [AWS Architecture](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) for the function: `x86_64` (default) or `arm64`
- [`storage`](#storage) - number, between `512` (default) and `10240` MB. The function's ephemeral storage (`/tmp` file system).
- [`fifo`](#fifo) - boolean, `true` (default) or `false` to use `standard` SQS type

> Note: any function configurations made globally in your project manifest will be overridden by individual functions. For example, if your `app.arc` includes `memory 128`, and `src/http/get-index/config.arc` includes `memory 3008`, all functions except `get /` will be configured with 128MB of memory, while `get /` will override that global with 3008MB.

Read more about the [Lambda limits](https://docs.aws.amazon.com/lambda/latest/dg/limits.html) and [resource model](https://docs.aws.amazon.com/lambda/latest/dg/resource-model.html).

### Example `config.arc`

```arc
# src/function/dir/config.arc
@aws
runtime ruby
memory 256
timeout 3
concurrency 1
layers {ARN}
policies {ARN}
architecture arm64
```

### `runtime`

Configure Lambda function `runtime`:

- Like `nodejs16.x` (default), `nodejs14.x`, `python3.9`, `ruby2.7`
- Unsupported by Sandbox locally: `dotnetcore3.1`, `go1.x`, `java11`
- Or a runtime alias: `nodejs`, `python`, `ruby`, `.net`, `go`,  `java`
  - Aliases always use the default version of the matched runtime: `ruby` => `ruby2.7`.

See [@aws](../project-manifest/aws) and official [Lambda documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) for further reference.

```arc
@aws
runtime ruby
```

### `memory`

Configure Lambda function `memory` between `128` MB to `10240` MB, in `1` MB increments.

Memory size also directly correlates with CPU speed; higher memory levels are available in more capable Lambda clusters

```arc
@aws
memory 1024
```

### `timeout`

Configure Lambda function `timeout` in seconds to a max of `900`. (`15` minutes.)

The default timeout (if no value supplied) is `5`. (`5` seconds.)

```arc
@aws
timeout 30
```

### `concurrency`

Configure Lambda function concurrency. If not present concurrency is unthrottled.

Limit execution to one invocation at a time:

```arc
@aws
concurrency 1
```

> Tip: `@events` functions with `concurrency 1` create a queue-like primitive

Disable invocation by setting concurrency to zero:

```arc
@aws
concurrency 0
```

### `provisionedConcurrency`

Configure a Lambda's provisioned concurrency, which ensures the concurrency specified will always respond without coldstart. By default, Architect never sets provisioned concurrency, as it costs money whether actively in use or not.

> Note: be warned that this is one of the only features that starts costing money the moment it is enabled. Be especially careful when enabling this feature globally for your project, as it has the potential to run up your costs rather quickly. Please refer to [Lambda's provisioned concurrency pricing guide](https://aws.amazon.com/lambda/pricing/#Provisioned_Concurrency_Pricing).

Set a provisioned concurrency of 10 warm containers for your Lambda:

```arc
@aws
provisionedConcurrency 10
```

Pair with `concurrency` to guarantee a Lambda with 10 warm containers that never exceeds 100 concurrent requests:

```arc
@aws
concurrency 100
provisionedConcurrency 10
```

### `layers`

Configure Lambda function `layers` with max 5 Lambda Layer ARNs.

> Warning: Lambda Layers must be in the same region as they are deployed

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

### `policies`

Configure custom Lambda function `policies`, enabling granular and specific privileges and access controls.

The `policies` setting takes one or more IAM policy ARNs or AWS-managed policy names (e.g. `AmazonDynamoDBFullAccess`).

Configuring one or more policies will completely remove all of Architect's default Lambda privileges. To restore Architect's default privileges, include a policy named `architect-default-policies`.

> Note: `architect-default-policies` is an internal Architect framework setting based on the least-privilege permissions specific to your project. It is not a managed / public IAM policy, and will not be found in your AWS console.

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

#### Additional resources

- [AWS IAM policy ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-arns)
- [Community-maintained list of AWS-managed policies](https://github.com/z0ph/MAMIP/tree/master/policies)

### `architecture`

Configure Lambda function [CPU `architecture`](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html) to be one of `x86_64` or `arm64`. This setting defaults to `x86_64` if not specified. `arm64` only available in supported AWS regions.

> Note: locally, Architect Sandbox executes the function's runtime with your machine's native architecture.

```arc
@aws
architecture arm64
```

### `storage`

Configure Lambda function temporary file system size between `512` MB and `10240` MB, in `1` MB increments. Defaults to `512` MB.

Ephemeral storage lives at `/tmp` in an AWS Lambda and will not persist between deployments. Amazon describes this disk space as a "scratch resource." Read more in [the AWS announcement post](https://aws.amazon.com/blogs/aws/aws-lambda-now-supports-up-to-10-gb-ephemeral-storage/).

```arc
@aws
storage 5000
```

### `fifo`

Configure SQS queue type to `fifo` (`true`, default) or `standard` (`false`).

```arc
@aws
fifo false
```
