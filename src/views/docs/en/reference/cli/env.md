---
title: arc env
category: CLI
description: Read and write environment variables for Lambda functions.
---

Read and write environment variables. This allows apps to centrally store sensitive configuration data, such as API keys, outside of the codebase in revision control.

## Usage

```bash
arc env [testing|staging|production] {VARIABLE_NAME} {VARIABLE_VALUE}
```

## Security

It is imperative that the `ARC_APP_SECRET` environment variable be set to
something secret - especially in your production environment! This secret is
used to encode HTTP sessions if you use the [`@architect/functions` runtime helpers](../runtime-helpers/node.js#arc.http.session).

## Examples

### Display environment variables for the current `app.arc`

```bash
arc env
```

### Save an environment variable to the staging environment

```bash
arc env staging FOO myvalue
```

> Protip: values that contain special characters like email addresses should be wrapped in double quotes

### Remove an environment variable

```bash
arc env remove staging FOO
```

## Reserved names

- `NODE_ENV`
- `ARC_APP_NAME`
- `SESSION_TABLE_NAME`

## Specific function opt-out

A function can be [configured with a `config.arc`](../configuration/function-config#%40arc) to not load local environment variables.
