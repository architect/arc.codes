---
title: Detailed setup
description: Setting up and installing Architect.
sections:
  - Prerequisites
  - AWS Setup & IAM credentials
  - Configure AWS CLI
  - Install Architect
  - Example project
  - Work locally
  - Deploying
  - Clean Up
---

## Prerequisites

**TL/DR**

**To work locally**, all you need is:

- A supported [runtime](#runtimes)

**To deploy your project to AWS**, you'll need:

- A supported [runtime](#runtimes)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
  - (Which requires [Python](https://www.python.org/downloads/))
- AWS account with admin privileges
- Your [credentials file](#local-credentials-file) set up at:
  - \*nix: `~/.aws/credentials`
  - Windows: `C:\Users\USER_NAME\.aws\credentials`


### Runtimes

Architect supports the following runtime versions when working locally:

**Recommended**

- Node: `12.x` & `10.x` using `npm`
- Ruby: `2.5` using `bundle`
- Python: `3.7` & `3.6` using `pip3`

> Working locally with the Architect `sandbox` dev server requires target runtimes to be installed and available in $PATH. For example, if you are only targeting Node, then only Node needs to be installed locally. (Likewise for Ruby and Python.)

To use the same runtime across all functions in your project, add it to your `@aws` pragma like so:

```
# Valid runtimes: `nodejs12.x`, `nodejs10.x`, `deno`, `python3.7`, `python3.6`, or `ruby2.5`
@aws
runtime python3.7
```

This setting can be overridden on a function-by-function basis with [`.arc-config`](/en/reference/architect-manifest-and-config/function-config-file).

Architect also supports the following runtimes in live infra, but not while working locally (at present):
- Go: `1.x`,
- .NET: `2.1`
- Java: `8`

---

## AWS Setup & IAM credentials

You'll need an Amazon Web Services account and credentials set up on your development machine. If you haven't done it before, here's a useful guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

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

To set these variables on Linux, macOS, or UNIX, use export in your `~/.bashrc` (or equivalent shell configuration):

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

## Configure AWS CLI

The [AWS Command Line Interface](https://docs.aws.amazon.com/cli/) is the main interface for interacting with all parts of AWS using your computer's terminal. The AWS CLI provides a direct way to access all of the public APIs of AWS. 

It will be important to have this set up on your machine to be able to use Architect. Below we will show you how to install and configure the AWS CLI correctly so that you may move on to installing Architect.

There are two versions of the AWS CLI available for download. Version two is for production environments and is the most recent major version of the AWS CLI and supports all of the latest features. Version one is the original AWS CLI, has backwards compatibility, and is still supported by AWS.

To check which version you have installed, run the `aws --version`. If not already installed, let's do that now.

There are different ways to install the AWS CLI depending on the dev environment you are using. Use the instruction at the link below to correctly install the CLI for your preferred environment.

[Installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

## Install Architect

The following command uses NPM, the package manager for JavaScript, to install Architect globally, a framework for building serverless applications. This will allow you to use Architect in any project directory on your computer.

```bash
npm install -g @architect/architect
```

Or, if you prefer, you can install Architect into a local project:

```bash
npm init @architect ./testapp
```

## Example project

Create a project folder

```bash
mkdir testapp
cd testapp
```
Start the dev server

```bash
arc sandbox
```
> Cmd / Ctrl + c exits the sandbox

## Work locally

Run `arc init` to generate a basic project:

```
/
├── src
│   └── http
│       └── get-index/index.js
└── app.arc
```

Check out your first `app.arc` file & HTTP function!

```bash
# /project/path/.arc

@app
your-app-name

@http
get /
```

```javascript
// src/http/get-index/index.js

exports.handler = async function http(request) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8;' },
    body: '<h1>Hello World! 🎉</h1>'
  }
}
```

## Deploying

Deploy your app

```bash
arc deploy
```

Congrats, you've successfully created a powerful, modern, serverless app! Nice work. 💖

## Clean Up

ADD ME!

### Useful links:

- [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
- [Amazon Configuration and Credential Files](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)
- [Working with multiple AWS accounts](/en/guides/tutorials/multiple-aws-accounts)