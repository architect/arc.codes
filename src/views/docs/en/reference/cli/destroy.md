---
title: arc destroy
category: CLI
description: CLI destroy command for removing Architect application
---

Remove the CloudFormation stack and all related assets (S3 buckets, CloudWatch Log Groups, SSM environment variable parameters) for the current project from AWS completely. By default, removes the staging stack.

Large applications may take several minutes to delete and by default this command times out after 150 seconds. Even if this command times out, deletion may still complete successfully as removal completes asynchronously in the background at AWS. To have this process block until all application resources are removed, use the `--no-timeout` flag (see below for more information).

## Usage

```bash
arc destroy <--app MyAppName> [--production] [--name NamedEnvironment] [--force]
```

## Flags

- `[--app MyAppName]` Required. Specify the app name, located under `@app` in your Architect manifest, to delete the app from AWS.
- `[--name NamedEnvironment]` If you ran [`arc deploy`][deploy] with the `--name` flag to specify a custom named environment to deploy your application to, use this flag to destroy that same named application environment.
- `[--production]` Destroy the production stack of your application. By default, without this flag, the staging stack is removed.
- `[--force, -f]` Force deletion of the application even if it contains DynamoDB tables ([`@tables`][tables]) or S3 bucket containing static assets ([`@static`][static]).
- `[--no-timeout]` Do not exit the process until all application resources are deleted.

## Examples

### Destroy the staging stack

```bash
arc destroy --app my-app
```

### Destroy the production stack

```bash
arc destroy --app my-app --production
```

### Destroy staging stack with S3 bucket and/or Dynamo tables

```bash
arc destroy --app my-app --force
```

### Destroy custom named stack

```bash
arc destroy --app my-app --name Dev --force
```

[deploy]: deploy
[tables]: ../project-manifest/tables
[static]: ../project-manifest/static
