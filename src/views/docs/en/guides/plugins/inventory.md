---
title: Architect Inventory
category: Plugins
description: Information about the Architect Inventory format
---

All Architect plugins receive an `inventory` object that enumerates all the resources in a project. So what is the Architect Inventory format, anyway?


## How Architect Inventory works

Every time Architect initiates a command, your project manifest is parsed and interpreted into the internal Architect Inventory format that serves as the single source of truth for your project's state. Whenever your project resources or configuration changes in any way, it is reflected in the Inventory.

For example, let's say your project manifest looks like this:

```arc
@http
get /foo
```

Inventory responsible for enumerating the HTTP pragma's `get /foo` route, and its current configuration (e.g. Node.js version, memory, timeout, etc.) based on Architect's defaults, any project-level defaults you may have set, and any per-Lambda configuration via `config.arc`.

Inventory is also responsible for lower-level project configuration. For example: the above project does not define a handler at the root of your API; Inventory automatically creates a configuration to ensure something exists to handle requests to your root (so your users don't get a `5xx` error when visiting the root of your site).

In the same vein, Inventory would also set up default project options for static assets in anticipation of their use by your HTTP route(s).


## The Inventory format

The Inventory format represents every possible setting, option, and configuration in Architect. Since it isn't practical to document all that here. We'll cover the basics to help you navigate it.

The basics:

- Plugins are passed both `arc` (the raw manifest in the parsed Architect format) and `inventory` (the Architect Inventory format, probably what you'll most often be using)
  - The `arc` format is still helpful to have for inspecting custom pragmas. For example, if you wanted your users to configure your plugin with a custom `@my-plugin-config` pragma, that would only appear in `arc`, and not in `inventory`
- The `arc` + `inventory` objects passed to plugins are frozen copies; only Architect is responsible for changing or updating current `inventory`
- `inventory` contains two objects:
  - [`inv`](#inv): the current project Inventory
  - [`get`](#get): a convenient set of resource getter methods
- With limited exceptions, `inventory` values of `null` represent the lack of a userland configuration; anything non-`null` almost always represents something that was user-configured (or inferred by configuration)


## `inv`

The `inv` object contains a property for each Architect [pragma](/docs/en/get-started/project-manifest#more-on-app.arc), and a handful of meta properties and resource collections. Here is a basic example `inv` object:

```javascript
inventory.inv = {
  _arc:             { /* Architect metadata: current version, pragmas, stage, etc. */ },
  _project:         { /* Project metadata: cwd, preferences, env vars, etc. */ },
  ...pragmas,         /* Properties for each pragma: aws, http, tables, etc. */,
  lambdaSrcDirs:    [ /* Array of the source directory of each project Lambda */ ],
  lambdasBySrcDir:  { /* Object containing each Lambda, named by its source directory */ },
}
```

Each pragma's Lambdas may contain different properties and configurations; for example, `@scheduled` Lambdas have a `rate` or `cron` property, while `@http` Lambdas have a `method` and `path` property.

Here's an example of what the above `get /foo` Lambda object might look like:

```javascript
inventory.inv.http = [
  {
    name: 'get /foo',
    method: 'get',
    path: '/foo',
    // Lambda configuration
    config: {
      timeout: 10,
      memory: 3008,
      runtime: 'nodejs20.x',
      architecture: 'arm64',
      handler: 'index.handler',
      state: 'n/a',
      concurrency: 'unthrottled',
      layers: [],
      policies: [],
      shared: true,
      env: true,
    },
    // Other Architect config + paths and files
    src: '/your/project/path/src',
    handlerFile: '/your/project/path/src/http/get-foo/index.js',
    handlerMethod: 'handler',
    handlerModuleSystem: 'esm',
    configFile: '/your/project/path/src/http/get-foo/config.arc',
    pragma: 'http'
  }
]
```

We encourage you to explore the Inventory format on your own; a quick way to inspect your project's Inventory would be to just log it out from a plugin like so:

```javascript
module.exports = { sandbox: { start: function ({ inventory }) {
  console.dir(inventory.inv, { depth: null })
} } }
```

> Note: remember, [`set` plugins](./set) run before the rest of the Inventory, and thus [receive incomplete Inventory objects](./set#caveats).


## `get`

The `get` object contains a variety of helpful methods for querying the inventory. For example, say a project had the following manifest:

```arc
@http
get /foo
post /bar
get /fiz
put /buz

@static
fingerprint true
```

Now say you wanted to get the Inventory Lambda object of `@http get /foo`. You could use `find()` on the `http` array to search for the `name` property of `get /foo` (e.g. `inventory.inv.http.find(({ name }) => name === 'get /foo')`). Or you can use `inventory.get`:

```javascript
console.log(get.http('get /foo')) // Your `get /foo` Lambda
console.log(get.http('get /bar')) // null
```

`get` also works on settings pragmas, like `@static` or `@aws`:

```javascript
console.log(get.static('fingerprint'))  // true
console.log(get.static('prune'))        // null
console.log(get.aws('region'))          // 'us-west-2'
```
