---
title: '<code>create</code> plugins'
category: Plugins
description: '<code>create</code> lifecycle hook plugins'
---

`create` lifecycle hook plugins extend Architect's ability to generate new Lambda handlers as you expand the capabilities of your application.

`create` plugins execute when users run [`arc create` (aka `arc init`)](/docs/en/reference/cli/init), and in related contexts.


## `create.register`

`create.register` is a string or array of built-in runtime names (e.g. `nodejs18.x`) or aliases (`node`).

> Note: if your plugin creates a custom runtime with both `set.runtimes` and `create.handlers`, it is unnecessary to use `create.register`. This is because `set.runtimes` informs Architect that the plugin can be expected to deal with the runtime(s) it populates; thus, `create.register` is only necessary if you wish to have a plugin do handler creation for built-in runtimes, or require very deep customization.


## `create.handlers`

`create.handlers` plugins are either async or synchronous functions, and receive a single argument, which is an object containing the following properties:

| Property    | Type    | Description                                       |
|-------------|---------|---------------------------------------------------|
| `arc`       | object  | Raw Architect project object                      |
| `inventory` | object  | [Inventory](./inventory) object                   |
| `lambda`    | object  | Properties f the specific Lambda being created    |

`create.handlers` can execute arbitrary commands, write files to disk, and generally take care of whatever is required in preparation for the new Lambda handler.

Alternately, you can return a single object or an array of objects with the following properties, which will be conveniently written into your handler folder for you:

| Property    | Type    | Description                               |
|-------------|---------|-------------------------------------------|
| `filename`  | string  | Handler-relative file path to be created  |
| `body`      | string  | Contents of the file to be written        |

> Note: if you do not return one or more files for the Create API to write to your handler directory, make sure you write your files to the `lambda.src` directory.


## Examples

```javascript
// Write two custom files for Node.js Lambda handlers
module.exports = {
  create: {
    register: 'node',
    handler: async ({ arc, inventory, lambda }) => {
      return [
        {
          filename: 'index.mjs',
          body: 'export let handler = async req => req'
        },
        {
          filename: 'config.arc',
          body: '@aws\n' + 'memory 3072'
        }
      ]
    }
  }
}
```

```javascript
// Run external commands that generate handlers; notes:
// - `create.register` is not necessary because `set.runtimes` is used
// - This example is contrived for brevity; actual `cargo-lambda` behavior differs
let { execSync } = require('child_process')
module.exports = {
  set: {
    runtimes: () => {
      return { name: 'rust', type: 'transpiled' }
    }
  },
  create: {
    handler: async ({ arc, inventory, lambda }) => {
      let cmd = `cargo lambda new --http bootstrap`
      execSync(cmd, { cwd: lambda.src })
    }
  }
}
```
