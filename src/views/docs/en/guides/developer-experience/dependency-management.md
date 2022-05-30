---
title: Using dependencies in your functions
category: Developer experience
description: Architect dependency structure and hydration
---

All [Functional Web Apps](https://fwa.dev) have project level dependencies and function level dependencies. Project level dependencies are defined at the root of the project. Lambda functions within a project are deployed individually and subsequently need to package their own dependencies. Different deployment frameworks handle this in different ways depending on the runtime; Architect projects encourage single responsibility functions with the minimum number of dependencies. This intentional isolation leads to easier debugging, faster coldstart and least privilege security.

## Node.js

If there is a `package.json` in the Lambda function folder it will be used. If there is no `package.json` in the function folder Architect will statically analyze the code and transparently tree shake an optimal `node_modules` folder for that specific Lambda function. Imported code must be in a `package.json` file or relative to the root of the function and or the module will not load once it has been deployed!

For example, assuming the current directory is `src/http/get-index`:

```javascript
// this is ok if it exists in package.json
let arc = require('@architect/functions')

// this will fail
let foo = require('../foo')

// this will work
let foo = require('./foo')

// this is also ok (if foo exists in @shared)
let foo = require('@architect/shared/foo')
```

Recommended additional reading for working with the Node runtime:

- Use `@shared` and `@views` to [share code](/docs/en/guides/developer-experience/sharing-code) between functions
- Use [`@architect/functions`](/docs/en/reference/runtime-helpers/node.js) to make working with Node a bit nicer

## Ruby

Architect uses `Gemfile` and `Gemfile.lock` with `bundle` to ensure Lambda function dependencies are deterministic. Code must be relative to the root of Lambda function directory.

```ruby
require 'bundler/setup' # initialize Bundler

require 'architect/functions' # is ok if it is vendored in the Lambda folder
require '../foo' # this will fail
require './foo' # this will work
require './vendor/shared/foo' # this is also ok (if foo exists in @shared)
```

Install runtime helpers for Ruby:

```bash
cd path/to/lambda
bundle init
bundle config set --local path 'vendor/bundle'
bundle add architect-functions
```

### Deployment Configuration

Prior to deploying, it is recommended to configure Bundler to work in a Lambda environment.

You'll need to let Bundler know about Lambda's platform architecture by adding an entry to the `Gemfile.lock`.
Additionally, Bundler often tries to write to the filesystem at runtime. Freeze the bundle by setting the `BUNDLE_FROZEN` environment variable to `1`.

```bash
bundle lock --add-platform x86_64-linux # declare Lambda's platform
npx arc env staging BUNDLE_FROZEN 1 # use arc to set an env var
npx arc env production BUNDLE_FROZEN 1 # do the same for production
```

## Python

Architect uses `requirements.txt` with `pip3` to ensure Lambda function dependencies are deterministic. Code must be relative to the root of Lambda function directory.

```python
import arc # is ok if it is vendored in the Lambda folder
import ..foo # this will fail
import .foo # this will work
import vendor.shared.foo # this is also ok (if foo exists in @shared)
```

Install runtime helpers for Python:

```bash
cd path/to/lambda
pip install --target ./vendor architect-functions
```
