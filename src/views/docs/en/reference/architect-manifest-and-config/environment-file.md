---
title: Environment file
description: 160 (or fewer) character description of this document!
sections:
  - Environments
  - .env
  - .arc-env
---

## Environments

You can use environment variables to store secrets securely and adjust your function's behavior without updating code. An environment variable is a pair of strings that are stored in a function's version-specific configuration. The Lambda runtime makes environment variables available to your code and sets additional environment variables that contain information about the function and invocation request.


## .env

`.env` files are for environment variables. An environment variable is made up of a name/value pair, and any number may be created and available for reference at a point in time. During application initialization, these are loaded into process.env and accessed by suffixing the name of the environment variable as shown below. At runtime, the reference to the environment variable name is replaced with its current value.

## .arc-env

Creating a file .arc-env in the root of your project will allow you to load environment variables locally in the sandbox.

```bash
@testing
FOO 1

@staging
FOO 2

@production
FOO 3
```