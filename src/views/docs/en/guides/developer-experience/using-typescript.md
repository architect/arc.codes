---
title: Using TypeScript
category: Developer experience
description: How to use TypeScript with Architect
---

Architect and TypeScript work great together. Architect maintains a first-party TypeScript integration via [`@architect/plugin-typescript`](https://github.com/architect/plugin-typescript).

Architect's TypeScript integration takes care of transpiling, source maps, source vs. build paths, and integration with Sandbox. All you have to do is author your functions (and, optionally, run `tsc` within your tests).


## Getting started

In your Architect project run:

```sh
npm i @architect/plugin-typescript --save-dev
```

Add the following to your Architect project manifest (usually `app.arc`):

```arc
@aws
runtime typescript # sets TS as the the default runtime for your entire project

@plugins
architect/plugin-typescript
```

## Usage

Author (or port) Lambdas in the `src` tree with `index.ts` handlers. For example:

```js
// src/http/get-index/index.ts
export async function handler (request: any, context: any): Promise<any> {
  return request
}
```

The above function will be automatically transpiled by Architect to `./.build/http/get-index.js`. The destination build directory is configurable, as is `tsconfig.json`, and esbuild plugins; [see the plugin documentation for more options](https://github.com/architect/plugin-typescript).)

When working locally, Sandbox automatically detects changes to your TypeScript handlers and re-transpiles them (and adds environment-specific sourcemaps) for you.

You can use TypeScript in as many or few Lambdas as you like, relying on project or Lambda-level [`runtime` function config](/docs/en/reference/configuration/function-config).


## `@architect/functions`

We recommend using the [`@architect/functions`](http://localhost:3333/docs/en/reference/runtime-helpers/node.js) runtime helper to smooth over some rough edges in working with various aspects of AWS (as well as to add built-in session support, and other niceties).

If you do, TypeScript types are available in the [@types/architect__functions](https://www.npmjs.com/package/@types/architect__functions) package.
