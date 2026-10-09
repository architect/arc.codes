---
title: arc logs
category: CLI
description: Read or destroy Lambda function logs.
sections:
  - Usage
  - Flags
  - Examples
---

Retrieve or delete [CloudWatch][cloudwatch] logs for your Lambda functions. When your functions log to `stdout` or `stderr`, these messages are stored in [AWS CloudWatch][cloudwatch]. This command lets you access these logs for debugging or monitoring.

You must provide a path to one of your Lambda function directories (e.g., `arc logs src/http/get-index`). By default, this command retrieves logs from your staging environment, unless the `--production` flag is specified.

If no function path is provided and your project has a root HTTP handler defined, logs for that handler will be retrieved by default.

## Usage

```bash
arc logs [flags] <path/to/function>
```

## Flags

- `--destroy`: Delete logs for the specified function
- `-p`, `--production`: Retrieve logs from the production environment (default is staging)
- `-v`, `--verbose`: Display more detailed information during command execution
- `-d`, `--debug`: Display even more detailed information for debugging purposes

## Examples

### Read logs from staging

```bash
arc logs src/http/get-index
```

### Read logs from production

```bash
arc logs --production src/http/get-index
```

### Delete logs

```bash
arc logs --destroy src/http/get-index
```

[cloudwatch]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html
