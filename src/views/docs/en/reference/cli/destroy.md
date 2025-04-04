---
title: arc destroy
category: CLI
description: CLI destroy command for removing Architect application
sections:
  - Usage
  - Flags
  - Examples
---

Completely removes your Architect application from AWS. This command deletes all resources associated with your application, including the [CloudFormation][cfn] Stack, SSM environment variables, CloudWatch Logs, deployment S3 bucket, and static S3 bucket (if applicable). 

By default, this command destroys your staging environment. Use the `--production` flag to target the production environment instead. For custom environments created with [`deploy --name`][deploy], use the `--name` flag to specify the environment to destroy.

Large applications may take several minutes to delete and by default this command times out after 150 seconds. Even if this command times out, deletion may still complete successfully as removal completes asynchronously in the background. To have this process block until all application resources are removed, use the `--no-timeout` flag.

## Usage

```bash
arc destroy [flags]
```

## Flags

- `--app`: App name as specified by your application's [`@app` pragma][app] (required for confirmation).
- `--force`, `-f`: Destroy an app that has database [`@tables`][tables] and/or [`@static`][static] assets.
- `--name`: Target a custom named environment created with [`deploy --name`][deploy].
- `--now`: Skip the 5-second safety delay before destroying resources.
- `--no-timeout`: Wait indefinitely for all application resources to be removed (by default times out after ~150 seconds).
- `--production`, `-p`: Destroy the production environment instead of staging.
- `--verbose`, `-v`: Print more detailed information during the destroy process.
- `--debug`, `-d`: Print even more detailed information for debugging purposes.

## Examples

### Destroy the staging Stack

```bash
arc destroy --app my-app
```

### Destroy the production Stack

```bash
arc destroy --app my-app --production
```

### Destroy staging Stack with S3 bucket and/or Dynamo tables

```bash
arc destroy --app my-app --force
```

### Destroy custom named Stack

```bash
arc destroy --app my-app --name Dev
```

[deploy]: deploy
[app]: ../project-manifest/app
[tables]: ../project-manifest/tables
[static]: ../project-manifest/static
[cfn]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
