---
title: Using ESM (ECMAScript Modules)
category: Developer experience
description: How to use ECMAScript Modules in functions
---

[AWS Lambdas support ES modules and top-level await](https://aws.amazon.com/blogs/compute/using-node-js-es-modules-and-top-level-await-in-aws-lambda/). Architect adheres to Node.js conventions and the AWS implementation.  
Lambdas must use the `nodejs14.x` or greater runtime to leverage ESM.

## Example project

A working Architect project with each method for using ESM and CJS, can be found on GitHub: [`architect-examples/arc-example-esm-cjs`](https://github.com/architect-examples/arc-example-esm-cjs).

## CommonJS by default

Architect projects currently default to CommonJS. In the future, `arc init` and `arc create` may generate ESM functions by default. Architect will always support CJS so long as Node.js does.

## ES Modules with `.mjs`

The simplest way to start using ESM is to create JavaScript files with a `.mjs` extension. For example, no configuration is needed for the following shared helper and HTTP GET function to work as ES modules:

```javascript
// ./src/shared/helper.mjs
export default function () {
  return "Don't panic."
}
```

The shared ESM file can be imported in any function. Remember, ES module import statements require the file extension.

```javascript
// ./src/http/get-index/index.mjs
import myHelper from '@architect/shared/helper.mjs'

export async function handler (event) {
  return { body: myHelper() }
}
```

## ES Modules with `package.json`

Alternatively, the `"type"` property of a function's package.json file can be set to `"module"` to declare the function is ESM. That function's handler file can then use a `.js` file extension:

```json
// ./src/http/get-index/package.json
{
  "description": "other attributes are allowed",
  "type": "module"
}
```

```
.
├── src
│   └── http
│       └── get-index
│           ├── index.js
│           └── package.json
└── app.arc
```

Declaring dependencies in a function's `package.json` will disable Lambda treeshaking for that function. This is true no matter the module type.

> ℹ️  Setting `"type": "module"` in the project's root `package.json` will not affect function module types.

## Explicitly using CommonJS

Users can explicitly use a `.cjs` file extension to declare a JS file is a CommonJS module.

```
.
├── src
│   └── http
│       └── get-index
│           └── index.cjs
└── app.arc
```
