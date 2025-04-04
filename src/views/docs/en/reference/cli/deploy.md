---
title: arc deploy
category: CLI
description: Architect deploy is a module to deploy SAM and CloudFormation templates to an AWS account
sections:
  - Overview
  - Usage
  - Flags
---

Deploy an Architect project to AWS by creating or updating a [CloudFormation][cfn] Stack with resources declared in [the project manifest][manifest].

[CloudFormation][cfn] Stack names are created from the name specified in [the `@app` pragma][app] and are unique to an AWS region. Changing the project name or region will create a new [CloudFormation][cfn] Stack.

## Usage

```bash
arc deploy [flags]
```

## Flags

- `--direct path/to/function`: Directly deploy the specified Lambda. A faster way to deploy and test small changes to individual functions without redeploying an entire Stack.
- `--dry-run`: Generate a [CloudFormation][cfn] template but do not deploy it. A dry run allows you to check the [CloudFormation][cfn] and SAM output before deploying the actual stack.
- `--eject`: Generate a [CloudFormation][cfn] template but do not deploy it. Instead, print out the `aws cloudformation` CLI invocation to execute the deployment.
- `-f`, `--fast`: Deploy the stack, but do not block the process until deployment completed.
- `-n`, `--name`: Deploy a custom named staging Stack. E.g. `--name CI` will deploy a `AppnameStagingCI` [CloudFormation][cfn] Stack.
- `--no-hydrate`: Do not automatically [`hydrate`](hydrate) functions prior to deployment.
- `-p`, `--production`: Deploys a [CloudFormation][cfn] Stack to a production Stack. If not specified, will default to deploy to a staging Stack.
- `--prune`: Remove static assets deployed to S3 bucket not present in the local [`@static`][static] folder.
- `-s`, `--static`: Deploys only the files in the [`@static`][static] folder.
- `-t`, `--tags`: Adds resource tags to the CloudFormation stack. The required tag format is `key=value`, e.g. `--tags key1=value1 key2=value2`
- `-v`, `--verbose`: Displays verbose logging.
- `-d`, `--debug`: Displays debug (and verbose) logging.

## Local preferences: `@create`

When deploying, Architect can automatically scaffold resources (via [`init`](init)) found in the [application's manifest][manifest] that do not yet exist. Options are set with [`@create` in local preferences](../configuration/local-preferences#%40create).

- `autocreate` - Set to `true` to enable automatic creation of boilerplate Lambda handlers and static assets if they do not exist.
- `templates` - Specify templates for automatic resource scaffolding.
  - `<pragma name> path/to/template.ext`
  - Does not enable `autocreate`

```arc
@create
autocreate true
templates
  http path/to/template/http.js
  events path/to/template/events.py
```

## Examples

### Deploy a staging Stack

```bash
arc deploy
```

### Deploy a production Stack

```bash
arc deploy --production
```

### Deploy a named staging Stack

```bash
arc deploy --name my-stack
```

> 💁  Named stacks use `staging` environment variables [set with the `env` command](env).

### Deploy static assets to S3

```bash
arc deploy --static
```

### Deploy the index route directly to staging

```bash
arc deploy --direct src/http/get-index
```

### Run deploy without deploying

This is useful for testing [`@plugins`][plugins]; it will still generate `sam.json`.

```bash
arc deploy --dry-run
```

[cfn]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
[manifest]: ../../get-started/project-manifest
[static]: ../project-manifest/static
[app]: ../project-manifest/app
[plugins]: ../project-manifest/plugins
