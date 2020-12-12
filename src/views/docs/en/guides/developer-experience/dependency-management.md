---
title: Using dependencies in your functions
description: Architect dependency structure and hydration
sections:
  - Overview
  - Updating dependencies
  - Hydrating dependencies
---

Architect apps have project level dependencies and function level dependencies. Project level dependencies are defined at the root of the project. However, Lambda functions are deployed individually and as such each one needs to have its own dependencies vendored before it is deployed. 

## Node

If there is a `package.json` in the Lambda function folder it will be used. If there is no `package.json` in the function folder Architect will statically analyze the code and transparently tree shake an optimal `node_modules` folder for that specific Lambda function. 

Imported code must be in `package.json` or relative to the root of the function and or the module won't be able to load once deployed. **Use `@shared` and `@views` to [share code](/docs/en/guides/developer-experience/sharing-code) between functions.**

Assuming the current directory is `src/http/get-index`:

```javascript
// this will fail
let foo = require('../foo')

// this is ok
let foo = require('@architect/shared/foo')

// this is also ok
let foo = require('./foo')
```

## Deno

TODO

## Ruby

TODO

## Python

TODO
