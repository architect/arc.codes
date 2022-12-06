---
title: '<code>hydrate</code> plugins'
category: Plugins
description: '<code>hydrate</code> lifecycle hook plugins'
---

`hydrate` lifecycle hook plugins expose functionality to extend the capabilities of Hydrate, Architect's tool for managing dependencies and shared code.


## `hydrate.copy` (experimental)

> Note: this API is currently experimental and [collecting feedback here](https://github.com/architect/architect/issues/1369), please let us know what you think!

Copy arbitrary files or folders into your project's Lambdas' dependency directories (e.g. `./src/$pragma/$name/node_modules/` if Node.js, or `./src/$pragma/$name/vendor` for Python, Ruby, etc.), and run arbitrary operations.

`hydrate.copy` runs after all dependency installation and shared file operations are complete, ensuring that any filesystem mutations will be present in final deployment artifacts.

`hydrate.copy` plugins are either async or synchronous functions, and receive a single argument, which is an object containing the following properties:

| Property    | Type            | Description                         |
|-------------|-----------------|------------------------------------ |
| `arc`       | object          | Raw Architect project object        |
| `inventory` | object          | [Inventory](./inventory) object     |
| `copy`      | async function  | [Copy file(s)](#copy-function)      |


### Copy function

`hydrate.copy` plugins are provided an async `copy` function capable of copying one or more files or folders into all Lambdas in the project (including Lambdas created by plugins with [`set` methods](./set)). Invocations accept the following properties:

| Property  | Type              | Description                                                   |
|-----------|-------------------|---------------------------------------------------------------|
| `source`  | string (required) | Relative or absolute path of the source file or folder        |
| `target`  | string            | Relative path of the target file or folder within each Lambda |


### Source paths

The `source` path (required) is a relative or absolute file path of the source file or folder to be copied into your Lambdas.

> Note: as of right now, `source` must be found somewhere within the project directory. This may change in the future based on feedback.


### Target paths

The `target` path (optional) is a relative path of the being copied into your Lambdas. If not provided, `hydrate.copy` will add the file or folder to the root of your dependencies directory.

For example, if you specify a `target` of `hi/there.json`, the following file will be written: `./src/$pragma/$name/$node_modules_or_vendor/hi/there.json`

If you specify a `source` of `howdy.json` and **do not** specify a `target`, the following file will be written: `./src/$pragma/$name/$node_modules_or_vendor/howdy.json`


## Examples

```javascript
// Copy a single file or folder to the same name
module.exports = { hydrate: {
  copy: async ({ arc, inventory, copy }) => {
    await copy({
      source: 'project/relative/path/file.txt',
      target: 'foo/file.txt', // Copied to `./src/$pragma/$name/$node_modules_or_vendor/foo/file.txt`
    })
  }
} }
```

```javascript
// Copy multiple files or folders
module.exports = { hydrate: {
  copy: async ({ arc, inventory, copy }) => {
    await copy([
      {
        source: 'project/relative/path/file.txt',
        target: 'file.txt', // Copied to `./src/$pragma/$name/$node_modules_or_vendor/foo/file.txt`
      },
      {
        source: 'project/relative/path/subfolder',
        target: 'some-subfolder', // Copied to `./src/$pragma/$name/$node_modules_or_vendor/some-subfolder`
      },
    ])
  }
} }
```

```javascript
// Assume the target is the root dependency dir
module.exports = { hydrate: {
  copy: async ({ arc, inventory, copy }) => {
    await copy({
      source: 'project/relative/path/file.txt',
      // Copied to `./src/$pragma/$name/$node_modules_or_vendor/file.txt`
    })
  }
} }
```
