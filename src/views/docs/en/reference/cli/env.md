---
title: arc env
category: CLI
description: Read and write environment variables for Lambda functions.
sections:
  - Usage
  - Flags
  - Security
  - Examples
  - Reserved names
  - Specific function opt-out
---

Manage environment variables for your Architect application across different environments. This command allows you to read, add, and remove environment variables that will be available to your Lambda functions at runtime.

When run without any flags, this command will print out all environment variables and their values, across all environments.

Environment variables are stored in AWS SSM Parameter Store for staging and production environments. For local development (testing environment), variables are stored in your project's [`preferences.arc` file][prefs] or `.env` file if one exists.

> `arc env` will **not** upload variables from a project's [local preferences file][env-prefs]; however, it will download variables from AWS and overwrite local preference entries.

> 💁  `staging` environment variables are also used in named deployments [created with `arc deploy --name <name>`](./deploy).

## Usage

```bash
arc env [flags] [VARIABLE_NAME] [VARIABLE_VALUE]
```

## Flags

- `-e`, `--env <environment>`: Specify environment (`testing`, `staging`, or `production`)
- `-a`, `--add`: Add a new environment variable
- `-r`, `--remove`: Remove an environment variable
- `-v`, `--verbose`: Print more detailed output
- `-d`, `--debug`: Print even more detailed information for debugging

## Security

It is imperative that the `ARC_APP_SECRET` environment variable be set to a strong secret - especially in your production environment! **It must have a minimum length of 32 bytes**. This secret is used to encode HTTP sessions if you use the [`@architect/functions` runtime helpers](../runtime-helpers/node.js#arc.http.session).

## Reserved names

The following environment variable names are reserved for Architect use and cannot be set in an app:

- `ARC_ENV`
- `ARC_APP_NAME`
- `ARC_SESSION_TABLE_NAME`

## Specific function opt-out

A function can be [configured with a `config.arc`](../configuration/function-config#%40arc) to not load local environment variables.

## Examples

### Display environment variables for the current `app.arc`

```bash
arc env
```

### Display variables for a specific environment

```bash
arc env --env staging
```

### Save an environment variable to the staging environment

Variable values that contain special characters like email addresses should be wrapped in double quotes

```bash
arc env --add --env staging SECRET_API_PASSWORD "p@s5w0rd!"
```

### Remove an environment variable

```bash
arc env --remove --env staging SECRET_API_PASSWORD
```

[prefs]: ../configuration/local-preferences
[env-prefs]: ../configuration/local-preferences#%40env
