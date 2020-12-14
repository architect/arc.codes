---
title: Macros
description: character description of this document!
---

Extend the functionality of your Architect app with standard CloudFormation. The `@macro` primitive allows developers to add any resources or modify existing ones extending Architect into the entire AWS ecosystem supported by CloudFormation.

## Getting started

These example configuration files declare a macro saved to `src/macros/my-custom-macro.js`

<h5>arc</h5>

```arc
@app
testapp

@macros
my-custom-macro
```

<h5>json</h5>

```json
{
  "app": "testapp",
  "macros": [
    "my-custom-macro"
  ]
}
```

<h5>json</h5>

```json
{
  "app": "testapp",
  "macros": [
    "my-custom-macro"
  ]
}
```

<h5>toml</h5>

```toml
app="testapp"

macros=[
 "my-custom-macro"
]

```

<h5>yaml</h5>

```yaml
---
app: testapp

macros:
- my-custom-macro
```

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
