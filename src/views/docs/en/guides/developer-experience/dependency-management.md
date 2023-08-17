---
title: Using dependencies in your functions
category: Developer experience
description: Architect dependency structure and hydration
---

## Overview

[Functional Web Apps](https://fwa.dev) have both project-level dependencies and individual function-level dependencies.

Project-level dependencies are defined at the root of the project, and may include things like developer dependencies.

Function-level dependencies are isolated to each deployed cloud function.

To optimize for startup, invocation, and deployment performance, and to minimize bug surface area, Architect projects encourage single responsibility functions with the minimum number of dependencies. This intentional isolation leads to easier debugging, faster responses, and least privilege security.


## Node.js

### Automated dependency treeshaking

Most Architect developers using Node.js (and [TypeScript](/docs/en/guides/developer-experience/using-typescript)) use Architect's built-in dependency treeshaking. Here's (roughly) it works:

- Install your dependencies in your root `package.json` (e.g. `npm i @architect/functions`)
- `import` or `require` your dependencies as normal
- When working locally, [Sandbox](/docs/en/reference/cli/sandbox)'s Node.js process will resolve your dependencies from your project's root `node_modules/` dir
- During deployment, Architect statically analyzes your code and resolves your (non-dynamic) `import` and `require` statements
- Dependencies are installed to and deployed with your Lambda
- For debugging purposes, the automatically generated `package.json` can be found in your Lambda's `node_modules/` dir (until the next deployment or Sandbox run)
  - Example path: `src/http/get-index/node_modules/_arc-autoinstall/package.json`

Using Architect's Lambda treeshaking, generally most developers do not need to spend any time managing individual dependencies across their project's many functions.

> Tip: Lambda treeshaking also supports dependencies found in [`shared` and `views`](/docs/en/guides/developer-experience/sharing-code)

Automatically install [`@architect/functions`](/docs/en/reference/runtime-helpers/node.js):

```javascript
// src/http/get-index/index.js
import arc from '@architect/functions'

export const handler = arc.http(async req => {
  return { ok: true }
})
```

Automatically install an optional dependency to ensure it's available to the Lambda:

```javascript
// src/http/get-index/index.js
// Note: you don't have to actually use the dep, merely importing or requiring is sufficient
require('an-optional-dependency')

export const handler = async req => {
  return { ok: true }
}
```


### Manual dependency management

Sometimes you may need fine-grained control over an individual function's dependencies. In these cases, Architect enables per-Lambda dependency management by way of a `package.json` file in your Lambda's folder.

If a `package.json` file with a `dependencies` property is found in your Lambda, Architect's treeshaking functionality will be automatically disabled for that specific Lambda, and your `package.json` file will be in complete control of that Lambda's dependencies.

Assuming the following `src/http/get-index/package.json`:

```json
{
  "dependencies": {
    "glob": "latest"
  }
}
```

This Lambda would work locally in Sandbox (due to Node's module resolution algorithm on your local machine), but would fail once deployed:

```javascript
// src/http/get-index/index.js
import arc from '@architect/functions'
import glob from 'glob'

export const handler = arc.http(async req => {
  return glob('**/**')
})
```


### Relative modules & code sharing

Individual Lambdas can `import` / `require` code from within their own path, but it is important to understand they cannot make use of local files that descend into other Lambdas. Attempting to do so will not work once deployed.

To share code across multiple Lambdas, please make use of `@shared` and `@views`, and refer to our [guide on code sharing](/docs/en/guides/developer-experience/sharing-code).

For example, assume the following `src/http/get-index/index.js` handler:

```javascript
// This is ok if it exists in the root package.json
import arc from '@architect/functions'

// This will fail
import foo from '../foo.js'

// This will work (if present, of course)
import foo from './foo.js'

// This is also ok (if foo exists in @shared)
import foo from '@architect/shared/foo.js'
```

---

## Python

### Automated dependency treeshaking

As with Node.js, we suggest Architect developers using Python utilize Architect's built-in dependency treeshaking. Here's (roughly) it works in Python:

- In addition to Architect, you will need to have `pipdeptree` installed to your system (`pip3 install pipdeptree`)
- Install your dependencies in your root `requirements.txt` (e.g. `pip3 install architect-functions -r requirements.txt`)
- `import` your dependencies as normal
- When working locally, [Sandbox](/docs/en/reference/cli/sandbox) will find your dependencies from your system $PATH
- During deployment, Architect statically analyzes your code and resolves your `import` statements into `pypi` packages
  - Supported options in your root `requirements.txt` file are respected, such as `--extra-index-url https://test.pypi.org/simple/`
- Dependencies are installed to and deployed with your Lambda
- For debugging purposes, the automatically generated `requirements.txt` can be found in your Lambda's `vendor/` dir (until the next deployment or Sandbox run)
  - Example path: `src/http/get-index/vendor/_arc_autoinstall/requirements.txt`

Using Architect's Lambda treeshaking, generally most developers do not need to spend any time managing individual dependencies across their project's many functions.

<!-- TODO: > Tip: Lambda treeshaking also supports dependencies found in [`shared` and `views`](/docs/en/guides/developer-experience/sharing-code) -->

Automatically install [`architect-functions`](/docs/en/reference/runtime-helpers/python):

```python
# src/http/get-index/lambda.py
import arc

def handler(req):
  return {"ok": True}
```


#### Native packages

By default, `pip` attempts to [install packages as wheels](https://packaging.python.org/en/latest/tutorials/installing-packages/#source-distributions-vs-wheels) that match the platform it's running on. For example: if you're running a Mac, `pip` will attempt to download the Mac wheel of the package you're installing. This is great for working locally in Sandbox.

During deployment to AWS, Architect's dependency hydration makes a best-effort attempt to guide `pip` to download wheels compatible with AWS Linux 2 (AL2), the underlying OS of Lambda (and many other AWS compute services). However, not all packages publish AL2 compatible wheels. Packages that do not publish source distributions, or that incorrectly tag `glibc` versions in their wheel distributions, for example, may have issues running in AWS.

Due to this potential variability in dependency compatibility, we advise thoroughly testing your Python deployments in staging before promoting to production.


### Manual dependency management

Sometimes you may need fine-grained control over an individual function's dependencies. In these cases, Architect enables per-Lambda dependency management by way of a `requirements.txt` file in your Lambda's folder.

If a `requirements.txt` file is found in your Lambda, Architect's treeshaking functionality will be automatically disabled for that specific Lambda, and your `requirements.txt` file will be in complete control of that Lambda's dependencies.


### Relative modules & code sharing

Individual Lambdas can `import` code from within their own path, but it is important to understand they cannot make use of local files that descend into other Lambdas. Attempting to do so will not work once deployed.

To share code across multiple Lambdas, please make use of `@shared` and `@views`, and refer to our [guide on code sharing](/docs/en/guides/developer-experience/sharing-code).

For example, assume the following `src/http/get-index/lambda.py` handler:

```python
# This is ok if it exists in the root requirements.txt file
import arc # → architect-functions

# This will fail
import ..foo

# This will work (if present, of course)
import .foo

# This is also ok (if foo exists in @shared)
import vendor.shared.foo
```

---

## Ruby

### Automated dependency treeshaking

Per the [runtime support matrix](/docs/en/get-started/runtime-support), Architect does not support automated dependency management for Ruby Lambdas at this time.


### Manual dependency management

Architect installs per-Lambda dependencies with `bundle` according to each `Gemfile` (and `Gemfile.lock`) found in each function directory.


### Relative modules & code sharing

Individual Lambdas can `require` code from within their own path, but it is important to understand they cannot make use of local files that descend into other Lambdas. Attempting to do so will not work once deployed.

To share code across multiple Lambdas, please make use of `@shared` and `@views`, and refer to our [guide on code sharing](/docs/en/guides/developer-experience/sharing-code).

For example, assume the following `src/http/get-index/lambda.rb` handler:

```ruby
# Initialize Bundler
require 'bundler/setup'

# This is ok if it exists in the Lambda's Gemfile
require 'architect/functions'

# This will fail
require '../foo'

# This will work (if present, of course)
require './foo'

# This is also ok (if foo exists in @shared)
require './vendor/shared/foo'
```


### Deployment configuration

Prior to deploying, it is recommended to configure Bundler to work in a Lambda environment.

You'll need to let Bundler know about Lambda's platform architecture by adding an entry to the `Gemfile.lock` (see below).

Additionally, Bundler often tries to write to the filesystem at runtime. Freeze the bundle by setting the `BUNDLE_FROZEN` environment variable to `1`.

```bash
# Declare the Lambda platform; assumes you have not configured your Lambda to use ARM
bundle lock --add-platform x86_64-linux

# Use Architect to set a Bundler-specific env var for staging & production
npx arc env -a -e staging BUNDLE_FROZEN 1
npx arc env -a -e production BUNDLE_FROZEN 1
```
