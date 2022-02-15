---
title: '<code>@macros</code>'
category: app.arc
description: Customize Architect-generated CloudFormation
---

> Notice: `@macros` is no longer the preferred way to extend CloudFormation in Architect, and have been superseded by [`@plugins` `deploy.start`](/docs/en/guides/plugins/deploy#deploy.start). Existing `@macros` extensions will continue to be supported, but are no longer actively improved.

Extend the functionality of your Architect app with standard CloudFormation. The `@macro` primitive allows developers to add any resources or modify existing ones extending Architect into the entire AWS ecosystem supported by CloudFormation. Macros also allow you to look for custom directives and add pre-deploy steps. You can find some examples in our [GitHub](https://github.com/architect/?q=macro-&type=source).

## Getting started

These example configuration files declare a macro saved to `src/macros/my-custom-macro.js`

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
testapp

@macros
my-custom-macro
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "testapp",
  "macros": [
    "my-custom-macro"
  ]
}
```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: testapp

macros:
- my-custom-macro
```
</div>
</arc-tab>

</div>
</arc-viewer>

### Deploy

When running `arc deploy` Architect looks for macros to run in:

- `src/macros/filename`
- `node_modules/macro-module-name`

You deploy a macro by using this syntax:

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy production` to run a full CloudFormation production deployment

## Examples

Macros receive the parsed `app.arc` file so custom pragmas and config can be defined. The second argument is the current CloudFormation template.

```javascript
/**
 * @param {object} arc - the parsed app.arc file currently executing
 * @param {object} cloudformation - the current AWS::Serverless CloudFormation template
 * @param {object} stage - the application stage (one of `staging` or `production`)
 * @returns {object|Promise} must return a CloudFormation object or a promise for a CloudFormation object
 **/
module.exports = function myCustomMacro(arc, cloudformation, stage) {
  // modify cloudformation.Resources here
  return cloudformation
}
```
> Note: macros are a new feature and only JavaScript macros are supported at this time; however Python and Ruby are planned
