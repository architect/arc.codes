---
title: Detailed AWS setup
category: Get started
description: Setting up, installing, and working with Architect and AWS.
---

> To work locally all you need is [Node](https://nodejs.org), any additional [supported runtimes](#runtime-environments) you plan to use, and the [Architect CLI](#install-architect).

## AWS deployment requirements

1. [Node.js](https://nodejs.org) for Architect
2. Any additional [supported runtimes](#runtime-environments) you plan to use in your application
3. [AWS credentials](#credentials)
4. [Architect CLI](#install-architect)

---

### Runtime environments

Architect supports the following runtimes for composing your application's business logic:

- **Node.js**: >= 16.x using `npm`
  - Unless otherwise specified in your project manifest, Node.js 20.x is the default runtime for new functions
- **Python**: >= 3.8 using `pip3`
  - Unless otherwise specified in your project manifest, Python 3.12 is the default Python runtime
- **Ruby**: `3.2` using `bundle`
- **Deno**: `1.6.x` ([under development](../reference/runtime-helpers/deno))

> ⚠️ Working locally with the Sandbox requires target runtimes to be available in your `$PATH`.

Additionally, other standard AWS-managed runtimes are supported in Architect applications (but may not be supported in [Sandbox](../reference/cli/sandbox)). Learn more about [Architect's runtime support](/docs/en/get-started/runtime-support).

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

### Credentials

You'll need an Amazon Web Services account and credentials set up on your development machine and / or CI systems. If you don't yet have credentials on your development machine (like from [configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)), here's a guide for [gathering credentials from the AWS Console](../guides/developer-experience/create-aws-credentials).

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
npm i -D @architect/architect
```
</div>
</arc-tab>

<arc-tab label=PowerShell>
<h5>PowerShell</h5>
<div slot=content>

```powershell
npm i -D "@architect/architect"
```
</div>
</arc-tab>
</div>
</arc-viewer>

Or you can install Architect globally, enabling you to use Architect from any directory on your computer.

```bash
npm i -g @architect/architect
```

---

## Interacting with AWS services

Each Lambda runtime version includes its own built-in version of the AWS SDK. However, due to ongoing performance and developer ergonomics issues with the AWS SDK, we recommend utilizing the community-driven [`aws-lite`](https://aws-lite.org) SDK.


### Using `aws-lite`

Since the AWS SDK is an extremely large library, we strongly recommend you do not ship your own version as a dependency, either in full or as a bundle. Doing so may have some of the following unintended side effects:

- Slower Lambda coldstart and / or invocation
- Reduced available code payload size
- Possibly increased difficulty debugging (in the case of bundles)

Instead, we recommend interacting with AWS services via [`aws-lite`](https://aws-lite.org) where possible, as it is 2-5x faster, and hundreds of megabytes smaller than the AWS SDK. [Learn more here](https://aws-lite.org/performance).

Where that is not possible, we recommend using AWS Lambda's provided, *non-bundled* version of the AWS SDK. See [below for details](#node.js-aws-sdk-versions).


### Architect's AWS SDK strategy

A core goal of Architect is to make building [Functional Web Apps](https://fwa.dev) simpler, and an important aspect of that objective is to help (automatically) manage the many dependencies in use across your Lambdas, whether your project has one or one hundred of them.

However, in the of AWS SDK, AWS manages that dependency within the Lambda environment. For the aforementioned reasons, Architect does not attempt to automatically manage or include any version of AWS SDK in the resources it manages on your behalf.

Practically speaking, that means if you rely on Architect's Lambda treeshaking feature – which scans your Lambda code and automatically installs `require`d or `import`ed dependencies at deploy-time – versions of the AWS SDK will not be automatically added to your Lambda dependencies by Architect (as it is already expected to be present in the Lambda environment).

Architect will, however, attempt to provide helpful warnings where possible. For example: if your `nodejs18.x` Lambda `import`s `aws-sdk`, the now-deprecated v2 that is not built into the Lambda container, Architect will warn you of this during deployment.


### Node.js AWS SDK versions

AWS has opted Node.js developers into a migration from AWS SDK v2 ([`aws-sdk`](https://www.npmjs.com/package/aws-sdk), now deprecated)) to v3 ([`@aws-sdk/*`](https://github.com/aws/aws-sdk-js-v3)):

- Lambda `nodejs18.x` and greater use AWS SDK v3 (`@aws-sdk/*`)
- Lambda `nodejs16.x` and prior use AWS SDK v2 (`aws-sdk`)
  - The last Lambda runtime to use SDK v2, `nodejs16.x`, is deprecated mid-2024

Migrating from AWS SDK v2 to v3 represents a meaningful change, and should be investigated thoroughly and with care. Key interfaces have been retired (such as `.promise()`), and some core SDK methods have changed significantly. (Example: [`S3.GetObject` no longer returns a Buffer](https://github.com/aws/aws-sdk-js-v3/issues/1877).)

Instead of adopting the forced breaking changes of a migration to AWS SDK v3, we instead recommend migrating (and contributing, where possible) to the [`aws-lite`](https://aws-lite.org) SDK.

> Architect maintains an ongoing commitment to backward compatibility wherever possible; as such, [`@architect/functions`](/docs/en/reference/runtime-helpers/node.js#%40architect%2Ffunctions) users can likely safely and reliably upgrade handlers in most cases. For additional details, please refer to the [Architect upgrade guide](/docs/en/about/upgrade-guide).
