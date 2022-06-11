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

- `[--production, -p]` Deploys a CloudFormation stack to a production stack.
- `[--static, -s]` Deploys only the files in the static folder.
- `[--direct, -d path/to/function]` Overwrite staging Lambda with local source. A faster way to deploy and test small changes to individual functions without redeploying an entire stack.
- `[--name, -n]` Deploy a custom named staging stack.
- `[--tags, -t]` Adds resource tags to the CloudFormation stack.
- `[--prune]` Remove assets not present in the local static folder.
- `[--no-hydrate]` Do not automatically run `npm`, `bundle` or `pip`
- `[--dry-run]` Creates a CloudFormation template but does not deploy it. A dry-run allows you to check the CloudFormation and SAM output before deploying the actual stack.
- `[--verbose, -v]` Displays the full deploy status messages.

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

