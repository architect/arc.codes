---
title: arc destroy
description: Destroy coresponding CloudFormation stack
---

Remove the CloudFormation stack and all related assets for the current project from AWS completely.

## Usage

```bash
arc destroy [production] [--name|--force|-f]
```

## Examples

### Destroy the staging stack

```bash
arc destroy --name my-app-name
```

### Destroy the production stack

```bash
arc destroy production --name my-app-name
```

### Destroy stack with S3 bucket and/or Dynamo tables

```bash
arc destroy --name my-app --force
```
