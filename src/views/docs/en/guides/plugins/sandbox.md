---
title: '<code>sandbox</code> plugins'
category: Plugins
description: '<code>sandbox</code> lifecycle hook plugins'
---

`sandbox` lifecycle hook plugins expose functionality to extend the capabilities of Sandbox, Architect's local development environment.


## `sandbox.start`

Run arbitrary operations during Sandbox startup. At the time of `sandbox.start` execution, all core Sandbox services are guaranteed to be running.

> This method is similar to [`@sandbox-start` scripts](/docs/en/reference/configuration/local-preferences#%40sandbox-start), but authored in JS, and controlled entirely via plugin. If in doubt, we suggest using `sandbox.start` over [`@sandbox-start` scripts.

`sandbox.start` plugins are either async or synchronous functions, and receive a single argument, which is an object containing the following properties:

| Property    | Type            | Description                         |
|-------------|-----------------|------------------------------------ |
| `arc`       | object          | Raw Architect project object        |
| `inventory` | object          | [Inventory](./inventory) object     |
| `invoke`    | async function  | [Invoke a Lambda](#invoke-function) |

Example:

```javascript
let { readFile } = require('fs/promises')
// Invoke a scheduled event whenever its business logic changes
module.exports = { sandbox: {
  start: async ({ arc, inventory, invoke }) => {
    await loadDatabaseMock()
    await seedLocalDatabase()
    console.log('Seeded database!')
  }
} }
```


## `sandbox.watcher`

Run arbitrary operations on filesystem events within your project. By default, the watcher ignores changes to `vendor`, `node_modules`, `.git`, and other such files.

`sandbox.watcher` plugins are either async or synchronous functions, and receive a single argument, which is an object containing the following properties:

| Property    | Type            | Description                                         |
|-------------|-----------------|-----------------------------------------------------|
| `filename`  | string          | Absolute path of the project file that was changed  |
| `event`     | string          | One of `add`, `update`, or `remove`                 |
| `inventory` | object          | [Inventory](./inventory) object                     |
| `invoke`    | async function  | [Invoke a Lambda](#invoke-function)                 |


## `sandbox.end`

Run arbitrary operations on Sandbox shutdown. `sandbox.end` plugins are executed just prior to all core Sandbox services being shut down.

`sandbox.end` plugins are either async or synchronous functions, and receive a single argument, which is an object containing the following properties:

| Property    | Type            | Description                         |
|-------------|-----------------|-------------------------------------|
| `arc`       | object          | Raw Architect project object        |
| `inventory` | object          | [Inventory](./inventory) object     |
| `invoke`    | async function  | [Invoke a Lambda](#invoke-function) |


## Invoke function

Sandbox plugins are provided an async `invoke` function capable of arbitrarily executing any Lambda in the project (including Lambdas created by plugins with [`set` methods](./set)). Invocations must include the following properties:

| Property  | Type    | Description                                                 |
|-----------|---------|-------------------------------------------------------------|
| `pragma`  | string  | The pragma of the Lambda, without `@` (e.g. `http`)         |
| `name`    | string  | Inventory name of the Lambda being invoked (e.g. `get /foo` |
| `payload` | object  | Payload to invoke with; an empty object (`{}`) is allowed   |

Examples:

Assuming an `app.arc` file with the following:

```arc
@app
my-app

@scheduled
my-scheduled-event rate(1 day)
```

Your `my-scheduled-event` Lambda could be invoked locally on demand like so:

```javascript
let { readFile } = require('fs/promises')
// Invoke a scheduled event whenever its business logic changes
module.exports = { sandbox: {
  watcher: async ({ filename, event, inventory, invoke }) => {
    if (filename.includes('src/scheduled/my-scheduled-event')) {
      let rawPayload = await readFile('test/fixtures/event-payload.json')
      invoke({
        pragma: 'scheduled',
        name: 'my-scheduled-event',
        payload: JSON.parse(rawPayload),
      })
    }
  }
} }
```
