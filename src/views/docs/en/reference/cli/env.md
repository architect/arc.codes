---
title: arc env
category: CLI
description: Read and write environment variables for Lambda functions.
---

Read and write environment variables. This allows apps to centrally store sensitive configuration data, such as API keys, outside of the codebase in revision control.

> `arc env` will **not** upload variables from a project's [local preferences file](../configuration/local-preferences#%40env); however, it will download variables from AWS and overwrite local preference entries.

## Usage

```bash
arc env [-e environment] [--add|--remove] VARIABLE_NAME VARIABLE_VALUE
```


## Flags

- `[-e [testing|staging|production]]` Displays all environment variables for the specified environment
- `<--add, -a> -e <testing|staging|production> NAME value` Assigns a value to the specified variable name in the specified environment
- `<--remove, -r> -e <testing|staging|production> NAME` Removes the specified variable from the specified environment


## Security

It is imperative that the `ARC_APP_SECRET` environment variable be set to
a strong secret - especially in your production environment! It should have a minimum length of 16 bytes. This secret is
used to encode HTTP sessions if you use the [`@architect/functions` runtime helpers](../runtime-helpers/node.js#arc.http.session).


## Examples

### Display environment variables for the current `app.arc`

```bash
arc env
```


### Save an environment variable to the staging environment

Variable values that contain special characters like email addresses should be wrapped in double quotes

```bash
arc env -e staging --add SECRET_API_PASSWORD "p@s5w0rd!"
```

> 💁  `staging` env variables are also used in named deployments [created with `arc deploy --name <name>`](./deploy).


### Remove an environment variable

```bash
arc env -e staging --remove SECRET_API_PASSWORD
```


## Reserved names

- `ARC_ENV`
- `ARC_APP_NAME`
- `ARC_SESSION_TABLE_NAME`


## Specific function opt-out

A function can be [configured with a `config.arc`](../configuration/function-config#%40arc) to not load local environment variables.
