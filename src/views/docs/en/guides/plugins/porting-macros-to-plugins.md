---
title: 'Porting <code>@macros</code> to <code>@plugins</code>'
category: Plugins
description: 'How-to port existing <code>@macros</code> to <code>@plugins</code>'
---

With the introduction of Architect 10, [`@macros`](/docs/en/reference/project-manifest/macros) were superseded by [`@plugins`](/docs/en/reference/project-manifest/plugins). It is important to note that [`@macros` will not cease to work, and will not be deprecated](/docs/en/guides/plugins/deploy#deploy.start). You do not need to port any macros you may have written for Architect.

However, there are a number of reasons that you may want to port your existing macro to a plugin:

- The `@macros` interface is also no longer actively maintained, whereas `@plugins` have numerous improvements and will continue to receive future upgrades
- The `@plugins` API surface is significantly more expansive and can do significantly more than `@macros`
- `@macros` and `@plugins` share the same logical namespace, so you may need to ensure there is not a name conflict


## How-to port your macro

### Before

In this example, we'll assume your project uses a private macro located at `src/macros/extend-arc/index.js`, and a project manifest that looks like so:

```arc
@app
my-app

@macros
extend-arc
```

The `@macros` API calls for a single function (async or sync) to be exported, and accepts the following arguments:

```javascript
// src/macros/extend-arc/index.js
module.exports = async function macro (arc, cloudformation, stage) {
  // modify cloudformation.Resources here
  return cloudformation
}
```


### After

The [`deploy.start` plugin API](/docs/en/guides/plugins/deploy#deploy.start), which is the direct successor to the `@macros` interface, is pretty close. To port the above macro, follow these steps:

1. Move your macro to `src/plugins/extend-arc/index.js`
2. Update your project manifest from `@macros` to `@plugins`:

```arc
@app
my-app

@plugins
extend-arc
```

3. Update your function to the new semantics:
```javascript
// src/plugins/extend-arc/index.js
module.exports = {
  deploy: {
    start: async function ({ arc, cloudformation, dryRun, inventory, stage }) {
      // modify cloudformation.Resources here
      return cloudformation
    }
  }
}
```

As you may notice, once inside the function, mutations to the `cloudformation` document are passed back in the very same way. (Similarly, returning early does not mutate `cloudformation`.)

The most important change to note is that your macro, which accepted positional arguments (that you may or may not have named as above) must now be exported as `deploy.start`, and has accepts a single object with named properties.

Otherwise, they are functionally identical. That's it!


### Help

If you have any questions or issues with your port to plugins, please don't hesitate to [chat with us in Discord](https://discord.gg/y5A2eTsCRX), we'd love to hear from you.
