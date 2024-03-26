---
title: arc deploy
category: CLI
description: Architect deploy is a module to deploy SAM and CloudFormation templates to an AWS account
sections:
  - Overview
  - Usage
  - Flags
---

Deploy an Architect project to AWS by creating or updating a [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) stack with resources declared in [the project manifest](../../get-started/project-manifest).

CloudFormation stack names are created from the name specified in the `@app` pragma and are unique to an AWS region. Changing the project name or region will create a new CF stack.

## Usage

```bash
arc deploy [--production|--static|--direct]
```

## Flags

- `[--debug, -d]` Displays debug (and verbose) logging.
- `[--direct path/to/function]` Overwrite staging Lambda with local source. A faster way to deploy and test small changes to individual functions without redeploying an entire stack.
- `[--dry-run]` Creates a CloudFormation template but does not deploy it. A dry-run allows you to check the CloudFormation and SAM output before deploying the actual stack.
- `[--fast, -f]` Deploy the stack, but do not hold the process open to determine whether the deployment succeeded or failed within AWS
- `[--name, -n]` Deploy a custom named staging stack.
- `[--no-hydrate]` Do not automatically run `npm`, `bundle`, or `pip`
- `[--production, -p]` Deploys a CloudFormation stack to a production stack.
- `[--prune]` Remove assets not present in the local static folder.
- `[--static, -s]` Deploys only the files in the static folder.
- `[--tags, -t]` Adds resource tags to the CloudFormation stack.
  - The required tag format is `key=value`, e.g. `--tags key1=value1 key2=value2`
- `[--verbose, -v]` Displays verbose logging.

## Local preferences: `@create`

When deploying, Architect can automatically scaffold resources (via [`arc init`](./init)) found in the [application's manifest](../../get-started/project-manifest) that do not yet exist. Options are set with [`@create` in local preferences](../configuration/local-preferences#%40create).

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

### Deploy a staging stack

```bash
arc deploy
```

### Deploy a production stack

```bash
arc deploy --production
```

### Deploy a named environment

```bash
arc deploy --name my-stack
```

> 💁  Named stacks use `staging` environment variables [set with `arc env -e staging --add`](./env).

### Deploy static assets to S3

```bash
arc deploy --static
```

### Deploy code directly to the staging Lambda

```bash
arc deploy --direct src/http/get-index
```

### Run deploy without deploying

This is useful for testing `@macros`; it will still generate `sam.json`.

```bash
arc deploy --dry-run
```
