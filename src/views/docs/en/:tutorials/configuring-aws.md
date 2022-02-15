---
title: Configuring AWS
category: Tutorials
description: Set up your Architect project for AWS
sections:
  - "Get AWS IAM credentials"
  - "Minimum viable permissions"
  - "Configure AWS CLI"
  - "Working with multiple profiles"
  - "Credentials file vs. environment variables"
  - "Deploy buckets"
  - "Runtime Environments"
---

## Get AWS IAM credentials

You'll need an Amazon Web Services account and credentials set up on your development machine and / or CI systems. If you yet set it up, here's a useful guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

In the context of a deployment tool, Architect requires account credentials with IAM `AdministratorAccess` privileges. In turn, Architect will create and attach least-privilege IAM roles to runtime resources within your application, ensuring strict security boundaries by default.

> ℹ️ While it is possible to limit Architect's deployment credentials to specific IAM and CloudFormation privileges, such an exercise would only be performative. Credentials capable of creating IAM roles can grant and attach new roles with `AdministratorAccess`.

On \*nix systems AWS Credentials are listed in:

```bash
~/.aws/credentials
```

Or on Windows systems:

```bash
C:\Users\USER_NAME\.aws\credentials
```

If that file doesn't exist, create it, and add the following:

```bash
[default]
aws_access_key_id=xxx
aws_secret_access_key=xxx
```

> If you prefer, you can also use: *Control Panel » System » Advanced System Settings » Environment Variables*.

## Minimum viable permissions
...

## Configure AWS CLI

The [AWS Command Line Interface](https://docs.aws.amazon.com/cli/) is the main interface for interacting with all parts of AWS using your computer's terminal. Architect uses the AWS CLI to package and deploy your app via CloudFormation. Follow this guide to [installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) for your preferred environment.

## Working with multiple profiles

It is possible to configure more than one AWS profile. This example credentials file lists 3 profiles:

```bash
[default]
aws_access_key_id=xxx
aws_secret_access_key=xxx

[work]
aws_access_key_id=xxx
aws_secret_access_key=xxx

[personal]
aws_access_key_id=xxx
aws_secret_access_key=xxx
```

## Credentials file vs. environment variables

While it is recommended to explicitly declare your application's AWS profile and region, you may also want to use a default profile and region on your machine with the following environment variables:

- `AWS_PROFILE`
- `AWS_REGION`

To set these variables on Linux, macOS, or UNIX, use `export` in your shell's configuration (e.g. `~/.zshrc` or `~/.bashrc`):

```bash
export AWS_PROFILE=work
export AWS_REGION=us-west-1
```

Or for Windows, add this to your PowerShell `$profile`:

```powershell
$env:AWS_PROFILE='work'
$env:AWS_REGION='us-west-1'
```

## Deploy buckets
...

## Runtime environments

Architect supports the following runtime versions:

- **Node.js**: `>= 14.x` using `npm`
  - Unless otherwise specified in your project manifest, Node.js is the default runtime for new functions
- **Python**: `3.9`, `3.8`, `3.7`, or `3.6` using `pip3`
- **Ruby**: `2.7` using `bundle`
- **Deno**: `1.6.x` ([under development](../reference/runtime-helpers/deno))

> ⚠️ Working locally with the Sandbox requires target runtimes to be available in your `$PATH`.

Additionally, all other standard AWS-managed runtimes are supported in Architect applications (but may not be supported in [Sandbox](../reference/cli/sandbox)), including:

- **Go**: `1.x`
- **.NET**: `3.1`
- **Java**: `11`, and `8`

Architect also supports _any custom runtime_ in using either [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) or [Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html).

Change a project's default runtime by specifying [an explicit environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) or an alias in `app.arc` with [the `@aws` pragma](../reference/project-manifest/aws).

### Examples

```arc
# version pins the default runtime to Python 3.8
@aws
runtime python3.8
```

```arc
# always run the latest supported version of Python
@aws
runtime python
```

> ℹ️ This setting can be overridden on a per-function basis with [`config.arc`](../reference/configuration/function-config).
