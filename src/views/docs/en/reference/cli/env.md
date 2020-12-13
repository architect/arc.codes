---
title: arc env
description: Read and write environment variables for Lambda functions.
---

Read and write environment variables. This allows apps to utilize sensitive configuration data, such as API keys, outside of the codebase in revision control. You can use this tool to ensure an entire team, and the deployment targets are in sync.

## Usage

```bash
arc env [testing|staging|production] {VARIABLE_NAME} {VARIABLE_VALUE}
```

## Examples

### Display environment variables for the current `app.arc`

```
arc env
```

### Save an environment variable to the staging environment

```
arc env staging FOO myvalue
```

> Protip: values that contain special characters like email addresses should be wrapped in double quotes 

### Remove an environment variable 

```
arc env remove staging FOO
```

## Reserved names

- `NODE_ENV`
- `ARC_APP_NAME` 
- `SESSION_TABLE_NAME`
