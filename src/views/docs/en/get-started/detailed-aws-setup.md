---
title: Detailed AWS setup
category: Get started
description: Setting up, installing, and working with Architect and AWS.
---

> To work locally all you need is [Node](https://nodejs.org), any additional [supported runtimes](#runtime-environments) you plan to use, and the [Architect CLI](#install-architect).

## AWS deployment requirements

1. [Node.js](https://nodejs.org) for Architect
2. [Python](https://www.python.org) for the AWS CLI
3. Any additional [supported runtimes](#runtime-environments) you plan to use in your application
4. [AWS CLI](#aws-cli)
5. [AWS credentials](#credentials)
6. [AWS SDK](#aws-sdk)
7. [Architect CLI](#install-architect)

---

### Runtime environments

Architect supports the following runtime versions:

- **Node.js**: `>= 14.x` using `npm`
  - Unless otherwise specified in your project manifest, Node.js 16.x is the default runtime for new functions
- **Python**: `3.9`, `3.8`, or `3.7` using `pip3`
- **Ruby**: `2.7` using `bundle`
- **Deno**: `1.6.x` ([under development](../reference/runtime-helpers/deno))

> ⚠️ Working locally with the Sandbox requires target runtimes to be available in your `$PATH`.

Additionally, all other standard AWS-managed runtimes are supported in Architect applications (but may not be supported in [Sandbox](../reference/cli/sandbox)), including:

- **Go**: `1.x`
- **.NET**: `6`, `5`, and `3.1`
- **Java**: `11`, and `8`

Architect also supports _any custom runtime_ in using either [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) or [Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html).

Change a project's default runtime by specifying [an explicit environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) or an alias in `app.arc` with [the `@aws` pragma](../reference/project-manifest/aws).

#### Examples

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

---

### AWS CLI

The [AWS Command Line Interface](https://docs.aws.amazon.com/cli/) is the main interface for interacting with all parts of AWS using your computer's terminal. Architect uses the AWS CLI to package and deploy your app via CloudFormation. Follow this guide to [installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) for your preferred environment.

---

### Credentials

You'll need an Amazon Web Services account and credentials set up on your development machine and / or CI systems. If you haven't yet set it up, here's a useful guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

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

While it is recommended to explicitly declare your application's AWS profile and region in the `@aws` pragma of your project's manifest, you may also set a (default) profile and region with the `AWS_PROFILE` + `AWS_REGION` environment variables.

---

### AWS SDK

Each Lambda runtime version includes its own built-in version of the AWS SDK. These versions are maintained and transparently upgraded by AWS.

Since the AWS SDK is an extremely large library, we strongly recommend you do not ship your own version as a dependency, either in full or as a bundle. Doing so may have some of the following unintended side effects:
- Significantly slower Lambda coldstart
- Significantly slower Lambda invocation
- Reduced available code payload size
- Possibly increased difficulty debugging (in the case of bundles)


#### Node.js AWS SDK versions

AWS maintains two versions of the AWS SDK for Node.js developers:

- v2 - [`aws-sdk`](https://www.npmjs.com/package/aws-sdk)
- v3 - [`@aws-sdk/*`](https://github.com/aws/aws-sdk-js-v3)

Lambda Node.js runtimes up to `nodejs16.x` include AWS SDK v2 (`aws-sdk`).

As of `nodejs18.x`, Lambda not includes AWS SDK v3 (`@aws-sdk/*`).

While v2 will likely continue to be maintained for some time to come, by making v3 the only available built-in version in `nodejs18.x`, AWS has signaled that they expect user to migrate to the new version, whether or not it is an actual improvement to developer experience.

Moreover, as the versions imply, v2 is largely incompatible with v3, and per the above recommendation, the version you should use in your handler code should correspond to the runtime you use. For example:
- If you have a Lambda running `nodejs16.x`, we recommend against adding `@aws-sdk/*` modules (until you are ready to migrate to `nodejs18.x`)
- Likewise, if you intend to run your Lambda on `nodejs18.x`, we recommend against using `aws-sdk`

> ℹ️ Upgrading to `nodejs18.x` (and thus using AWS SDK v3) represents a meaningful change, and should be investigated thoroughly and with care. Key interfaces have been retired (such as `.promise()`), and some core SDK methods have changed significantly. (Example: [`S3.GetObject` no longer returns a Buffer](https://github.com/aws/aws-sdk-js-v3/issues/1877).)


#### Architect's AWS SDK strategy

A core goal of Architect is to make building [Functional Web Apps](https://fwa.dev) simpler, and an important aspect of that objective is to help (automatically) manage the many dependencies in use across your Lambdas, whether your project has one or one hundred of them.

However, in the singular case of AWS SDK, AWS manages that dependency in particular. For the aforementioned reasons Architect does not attempt to automatically manage or include any version of AWS SDK.

Practically speaking, that means if, for example, you rely on Architect's Lambda treeshaking feature – which scans your Lambda code and automatically installs `require`d or `import`ed dependencies at deploy-time – any mismatched versions of the AWS SDK will not be automatically installed by Architect.

Architect will, however, attempt to provide helpful warnings where possible. For example: if your `nodejs18.x` Lambda `import`s `aws-sdk`, which is not built into the Lambda container, Architect will warn you of this during deployment.

---

### Install Architect

The following command uses `npm`, the package manager for Node.js.

To create an entirely new Architect project:

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect ./testapp
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" ./testapp
```
</div>
</arc-tab>
</div>
</arc-viewer>

To install Architect locally into an existing project:

<arc-viewer default-tab=bash>
<div slot=contents>
<arc-tab label=bash>
<h5>Bash/cmd.exe</h5>
<div slot=content>

```bash
npm init @architect ./testapp
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm init "@architect" ./testapp
```
</div>
</arc-tab>
</div>
</arc-viewer>

Or you can install Architect globally, enabling you to use Architect from any directory on your computer. When doing so, you should also be sure to install the AWS SDK globally as well.

```bash
npm i -g @architect/architect aws-sdk
```
