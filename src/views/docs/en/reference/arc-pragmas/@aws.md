---
title: '@aws'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@aws` is a vendor-specific space for declaring your AWS region & profile

## Syntax
- Accepts values for the following keys:
  - **`region`**: [AWS region ID](https://docs.aws.amazon.com/general/latest/gr/rande.html) of the region you'll deploy this project to
    - If not specified, defaults to `us-west-2`
  - **`profile`**: name of the profile you prefer to use with this project, as defined in your local [AWS profile](/quickstart)
    - Can also be specified in `AWS_PROFILE` environment variable
    - Required to deploy to AWS
  - `runtime`: Lambda runtime, can be one of:
    - `nodejs12.x`, `nodejs10.x`, `deno`, `python3.8`, `python3.7`, `python3.6`, `go1.x`, `ruby2.7`, `ruby2.5`, `dotnetcore3.1`, `dotnetcore2.1`, `java11`, `java8`
  - **`bucket`**: bucket (in same region) for CloudFormation deployment artifacts
    - If not specified, a secure deployment bucket will be auto-created for your app
  - `apigateway`: API Gateway API type, can be one of:
    - **`http` (default)** - `HTTP` API + Lambda payload format version 2.0
      - `httpv2` – aliased to `http`
    - **`httpv1`** - `HTTP` API + Lambda payload format version 1.0
    - **`rest`** - `REST` API + original API Gateway payload format

<!-- TODO: For more on working with AWS, please see: [Multiple AWS Accounts](/guides/multiple-aws-accounts). -->

Alternatively, if you want a less granular approach, you can declare your preferred region and profile in your `.bashrc` ([more information here](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html)).

If you have AWS exports in your `.bashrc` and `@aws` specified in your `app.arc` project, the `@aws` section will win.

## Example

For example, to deploy to the northern California AWS AZ with your AWS `work` profile's credentials, use:

```bash
@aws
region us-west-1
profile work
```

<!-- ### Custom Runtimes with AWS Lambda Layers
If you want to use a custom runtime with Lambda Layers you need to set `runtime` to `provided` and set the following key:
  - `layer`: [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) for the [Custom Lambda Runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html)

For example, to deploy to Oregon AWS AZ with your AWS `default` profile's credentials and using a custom Node.js 10 runtime, use:

```arc
@aws
region us-west-2
profile default
runtime provided
layer arn:aws:lambda:us-west-2:800406105498:layer:nsolid-node-10:6
``` -->
