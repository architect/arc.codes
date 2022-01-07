---
title: Using ESM (ECMAScript modules)
category: Developer experience
description: How to use ECMAScript modules in functions
---

As of January 6, 2022 [AWS Lambdas support Node.js ES modules and top-level await](https://aws.amazon.com/blogs/compute/using-node-js-es-modules-and-top-level-await-in-aws-lambda/). Architect shipped an update in version `9.5.0` that adheres to Node.js conventions and the implementation from AWS.

## CommonJS by default

New and existing Architect projects will default to CommonJS. In the future `arc init` and `arc create` _might_ generate ESM functions. Join the discussion on [GitHub](https://github.com/architect/architect/discussions) and [Discord](https://discord.gg/y5A2eTsCRX) to help inform the future of Arc.

## ES Modules with `.mjs`

The simplest way to start using ESM is to create JavaScript files with a `.mjs` extension. For example, no configuration is needed for the following HTTP GET function to work as an ES module:

```js
// ./src/http/get-index/index.mjs
export const handler = async function (request) {
  return { request }
}
```

```
.
├── src
│   └── http
│       └── get-index
│           └── index.mjs
└── app.arc
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

> ℹ️  Setting `"type": "module"` in the project's root `package.json` will not affect function module types.

## Explicitly setting CommonJS

Furthermore, users can explicitly use a `.cjs` file extension or setting a function's `package.json` to `"type": "commonjs"` to declare a JS file is a CommonJS module.
