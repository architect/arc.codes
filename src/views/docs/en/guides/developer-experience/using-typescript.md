---
title: Using TypeScript
category: Developer experience
description: How to use Architect with TypeScript
---

Architect and TypeScript work great together. Types are available in the [@types/architect\_\_functions](https://www.npmjs.com/package/@types/architect__functions) package. Write functions in TypeScript and just be sure to build your functions with TypeScript (`tsc`) before running or deploying. For example, your `package.json` might have the following scripts to build the TypeScript code before deploying and running in the [sandbox for local development](/docs/en/guides/developer-experience/local-development):

```json
"scripts": {
  "start": "arc sandbox",
  "prestart": "npm run build",
  "deploy": "arc deploy",
  "predeploy": "npm run build",
  "build": "tsc"
}
```
