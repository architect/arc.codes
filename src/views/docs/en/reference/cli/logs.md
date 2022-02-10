---
title: arc logs
category: CLI
description: Read or destroy Lambda function logs.
---

Anytime your remotely-deployed functions log to stdout, those get stored in CloudWatch. Retrieve these logs with `arc logs` for debugging or monitoring. You must provide a path argument to one of your functions (i.e. `arc logs src/http/get-index`). Unless --production is specified, this command will retrieve logs from the staging Stack.

## Usage

```bash
arc logs [--destroy] [--production] path/to/code
```

## Flags

- `[--production, -p]` Specify the production environment
- `[--destroy, -d]` Delete logs for the specified functions
- `[--verbose, -v]` Even more output

## Examples

### Read logs

```bash
arc logs src/http/get-index
```

### Destroy logs

```bash
arc logs --destroy src/http/get-index
```
