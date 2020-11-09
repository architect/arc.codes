---
title: Macros
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Getting started
  - Examples
---

## Overview

Extend the functionality of your Architect app with standard CloudFormation. The `@macro` primitive allows developers to add any resources or modify existing ones extending Architect into the entire AWS ecosystem supported by CloudFormation.

## Getting started

An example `app.arc` file with custom macro:

```bash
@app
testapp

@macros
my-custom-macro
```

For this example the `.arc` manifest file above, the macro is in `src/macros/my-custom-macro.js`

> Note: Macros are a new feature, and only JavaScript macros are supported at this time; however, Python and Ruby are on the roadmap.

### Deploy

When running `arc deploy` Architect looks for macros to run in: 

- `src/macros/filename`
- `node_modules/macro-module-name`

You deploy a macro by using this syntax:

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy production` to run a full CloudFormation production deployment

## Examples

Macros receive the parsed `app.arc` file so custom pragmas and config can be defined. The second argument is the current CloudFormation template. 

```js
/**
 * @param {object} arc - the parsed app.arc file currently executing
 * @param {object} cloudformation - the current AWS::Serverless CloudFormation template
 * @param {object} stage - the application stage (one of `staging` or `production`)
 **/
module.exports = function myCustomMacro(arc, cloudformation, stage) {
  // modify cloudformation.Resources here
  return cloudformation
}
```
> Note: macros are a new feature and only JavaScript macros are supported at this time; however Python and Ruby are planned
