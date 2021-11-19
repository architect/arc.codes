---
title: Detailed AWS setup
category: Get started
description: Setting up, installing, and working with Architect and AWS.
---

> To work locally all you need is [Node](https://nodejs.org), any additional [supported runtimes](#runtime-environments) you plan to use, and the [Architect CLI](#install-architect).

## AWS deployment requirements

1. [Node](https://nodejs.org) for Architect
2. [Python](https://www.python.org) for the AWS CLI
3. Any additional [supported runtimes](#runtime-environments) you plan to use
4. [AWS CLI](#aws-cli)
5. [AWS credentials](#credentials)
6. [Architect CLI](#install-architect)

---

### Runtime Environments

Architect supports the following runtime versions:

- **Node.js**: `14.x` (default) using `npm`
- **Ruby**: `2.7` using `bundle`
- **Python**: `3.9`, `3.8`, `3.7`, and `3.6` using `pip3`
- **Deno**: `1.6.x` ([under development](../reference/runtime-helpers/deno))

> ⚠️  Working locally with the Architect `sandbox` requires target runtimes to be available in your `$PATH`.

Additionally, standard AWS managed runtimes are supported in live infra, but not while working locally with [Sandbox](../reference/cli/sandbox) (at present):

- **Go**: `1.x`
- **.NET**: `3.1`
- **Java**: `11`, and `8`

Architect also supports _any custom runtime_ in live infra using either [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) or [Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html).

Change a project's default runtime by specifying [an explicit environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) or an alias in `app.arc` with [the `@aws` pragma](../reference/project-manifest/aws).

#### Example

```arc
@aws
runtime python3.8
```

> ℹ️  This setting can be overridden on a function-by-function basis with [`config.arc`](../reference/configuration/function-config).

---

### AWS CLI

The [AWS Command Line Interface](https://docs.aws.amazon.com/cli/) is the main interface for interacting with all parts of AWS using your computer's terminal. Architect uses the AWS CLI to package and deploy CloudFormation. Follow this guide to [installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) for your preferred environment.

---

### Credentials

You'll need an Amazon Web Services account and credentials set up on your development machine. If you haven't done it before, here's a useful guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

Architect, as a deployment tool, requires an IAM user account with `AdministratorAccess`. In turn, Architect will create and attach least-privilege IAM roles to runtime resources.  
It is possible to limit Architect credentials to IAM, CloudFormation, etc., but this is effectively granting `AdministratorAccess` since that role would have the ability to create an IAM role with `AdministratorAccess`.

On \*nix systems AWS Credentials are listed in:

```bash
~/.aws/credentials
```

Or on Windows systems:

```bash
C:\Users\USER_NAME\.aws\credentials
```

If that file doesn't exist, create it, and add something like the following (assuming you have multiple AWS accounts):

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

You will also need to set a default profile and region with the environment variables

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

> If you prefer, you can also use: *Control Panel » System » Advanced System Settings » Environment Variables*.

### Install Architect

The following command uses `npm`, the package manager for Node, to install Architect and the AWS SDK globally. This will allow you to use Architect in any directory on your computer.

```bash
npm i -g @architect/architect aws-sdk
```

Or, if you prefer, you can install Architect locally into a project:

```bash
npm init @architect ./testapp
```
