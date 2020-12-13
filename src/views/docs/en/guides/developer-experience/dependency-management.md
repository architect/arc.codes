---
title: Using dependencies in your functions
description: Architect dependency structure and hydration
---

All serverless applications have project level dependencies and function level dependencies. Project level dependencies are usually defined at the root of the project. Lambda functions are deployed individually and subsequently need to bundle their own dependencies. Different frameworks handle this in different ways depending on the runtime; Architect projects encourage single responsibility functions with the minimum number of dependencies and least privilege security. 

## Node

If there is a `package.json` in the Lambda function folder it will be used. If there is no `package.json` in the function folder Architect will statically analyze the code and transparently tree shake an optimal `node_modules` folder for that specific Lambda function. 

Imported code must be in a `package.json` file or relative to the root of the function and or the module won't load once deployed!

> Tip: use `@shared` and `@views` to [share code](/docs/en/guides/developer-experience/sharing-code) between functions.

Assuming the current directory is `src/http/get-index`:

```javascript
// this is ok (if it exists in package.json)
let arc = require('@architect/functions')

// this will fail
let foo = require('../foo')

// this will work
let foo = require('./foo')

// this is also ok (if foo exists in src/shared)
let foo = require('@architect/shared/foo')
```

## Ruby

Install runtime helpers for Ruby

```bash
cd path/to/lambda
bundle init
bundle install --path vendor/bundle
bundle add architect-functions
```

## Python

Install runtime helpers for Python

```bash
cd path/to/lambda
pip install --target ./vendor architect-functions
```
