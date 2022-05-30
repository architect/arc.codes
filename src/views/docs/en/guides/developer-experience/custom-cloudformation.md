---
title: Custom CloudFormation
category: Developer experience
description: How to use Architect Plugins to define or modify AWS resources with CloudFormation
---

One of Architect's chief responsibilities is to generate a standard CloudFormation document for deployment to AWS. This infrastructure-as-code document is available to Architect plugins to mutate however you see fit.


## `deploy.start` plugins

[`deploy.start` plugins](/docs/en/guides/plugins/deploy#deploy.start) allow you to process and mutate Architect-generated CloudFormation prior to deployment. This enables deep customization of any Architect default behavior, as well as allowing apps to extend into the entire AWS ecosystem of services.

Architect [`@plugins`](/docs/en/guides/plugins/overview) are implemented as a Node.js CJS module with the following function signature:

```javascript
// Do something only for staging deployments
module.exports = { deploy: {
  start: async ({ arc, cloudformation, dryRun, inventory, stage }) => {
    if (stage !== 'staging') return

    let config = await getSomeConfig()
    cloudformation.Resources.whatever = config
    // The returned mutated CloudFormation document will be passed to any other `deploy.start` plugins in sequence
    return cloudformation
  }
} }
```

## Additional resources

- [Learn more about authoring `deploy.start` plugins](/docs/en/guides/plugins/deploy#deploy.start)
- [Port existing `@macros` extensions to `deploy.start` plugins](/docs/en/guides/plugins/porting-macros-to-plugins)

> Tip: preview generated CloudFormation without deploying by running `arc deploy --dry-run` and viewing `sam.json`
