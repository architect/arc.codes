---
title: Custom CloudFormation
description: How to use Architect Macros to define or modify resources with CloudFormation
---

Architect generates a standard CloudFormation document for deployment with the AWS CLI. `@macros` allow you to process the Architect generated CloudFormation before deployment. This enables customization of any Architect default behavior as well as allowing apps extend into the entire AWS ecosystem of services.

Architect `@macros` are implemented as a standard Node module with the following function signature:

```javascript
 /**
  * Starter macro template
  *
  * @param {object} arc - Parsed `app.arc` value
  * @param {object} sam - Generated CloudFormation template
  * @param {string} stage - Deployment target runtime environment 'staging' or 'production'
  * @returns {object} Modified CloudFormation template
  */
module.exports = async function mymacro (arc, sam, stage='staging') {
  // modify sam cloudformation here 
  console.log({ arc, sam, stage })
  return sam
}
```

> Tip: preview generated CloudFormation without deploying by running `arc deploy --dry-run` and viewing `sam.json`

Architect finds `@macros` in `src/macros` or project root `node_modules`. An app opts into using `@macros` by adding them to `app.arc`:

```arc
@app
myapp

@macros
mymacro
```

> In the example above running `arc deploy` will look for `src/macros/mymacro` and then `./node_modules/mymacro`
