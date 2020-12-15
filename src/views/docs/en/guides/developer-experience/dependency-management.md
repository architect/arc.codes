---
title: Using dependencies in your functions
description: Architect dependency structure and hydration
---

All serverless applications have project level dependencies and function level dependencies. Project level dependencies are defined at the root of the project. Lambda functions within a project are deployed individually and subsequently need to package their own dependencies. Different deployment frameworks handle this in different ways depending on the runtime; Architect projects encourage single responsibility functions with the minimum number of dependencies. This intentional isolation leads to easier debugging, faster coldstart and least privilege security. 

## Node

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
- Use [`@architect/functions`](/docs/en/runtime/reference/node) to make working with Node a bit nicer

> Note: frontend bundlers are unneccessary for code sharing; Node has a very fast native module system with excellent debugging properties out of the box. There is no need to recreate the Node module system especially since it will have poorer debugging comparatively. (Source maps are experimental in Node and not first class in Lambda.) Sometimes performance is cited but coldstart is not an issue for single responsibility functions which Architect encourages. Code transforms might still might be neccessary when using non-standard dialiects that transpile to Node runtime JavaScript. [For the transpiler use case provide custom source paths](/docs/en/guides/developer-experience/custom-source-paths) but, once again, please be aware this will be trading off developer velocity to recover from bugs.

## Ruby

Architect uses `Gemfile` and `Gemfile.lock` with `bundle` to ensure Lambda function dependencies are determinstic. Code must be relative to the root of Lambda function directory.

```ruby
require 'architect/functions' # is ok if it is vendored in the Lambda folder
require '../foo' # this will fail
require './foo' # this will work
require 'architect/shared/foo' # this is also ok (if foo exists in @shared)
```

Install runtime helpers for Ruby:

```bash
cd path/to/lambda
bundle init
bundle install --path vendor/bundle
bundle add architect-functions
```

## Python

Architect uses `requirements.txt` with `pip3` to ensure Lambda function dependencies are determinstic. Code must be relative to the root of Lambda function directory.

```python
import arc # is ok if it is vendored in the Lambda folder
import ..foo # this will fail
import .foo # this will work
from arc.shared import foo # this is also ok (if foo exists in @shared)
```

Install runtime helpers for Python:

```bash
cd path/to/lambda
pip install --target ./vendor architect-functions
```
