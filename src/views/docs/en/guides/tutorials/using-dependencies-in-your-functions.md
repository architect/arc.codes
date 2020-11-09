---
title: Using dependencies in your functions
description: Architect dependency structure and hydration
sections:
  - Overview
  - Updating dependencies
  - Hydrating dependencies
---

## Overview

Each function in an Architect project is self-contained and has its own dependencies. Shared code can be located in `/src/shared` which will be copied into every function's `node_modules` folder during hydration and deployment. If you are working in Node, this means that each function will require a `package.json`. Architect will also respect other runtime dependency management such as a `requirements.txt` for Python and `gemfile` for Ruby.


## Updating dependencies

Every function respects the dependencies found in the root of the function. This means if you have more than one function, each one needs it's own `package.json`. When the function is invoked, all of it's dependencies need to be present in the folder. Let's make a new architect project with multiple functions and different dependencies in each function. 

```bash
mkdir arc-deps-app
cd arc-deps-app
touch app.arc
```
Now we can write a `app.arc` file with two HTTP functions as follows:

```bash
# app.arc file

@app
arc-deps-app

@http
get /deps
post /echo
```

Once you have the `app.arc` file, you can run `arc create` or `arc init` to scaffold the function folders. In each folder we're going to install `@architect/functions`, a runtime helper library. Since each function is isolated, we need to create a `package.json` and `npm install` the module we want.

```bash
cd src/http/get-deps
npm init -y
npm install @architect/functions
cd ../post-echo
npm init -y
npm install @architect/functions
cd ../../..
```

Let's make a couple of small functions to check for `node_modules` and echo JSON from a POST request.

```js
// src/http/get-deps

let arc = require("@architect/functions")
let fs = require("fs")
let deps = require('./package.json')
async function checkDeps(request) {
  if (!fs.existsSync("./node_modules")) {
    throw new Error( 'Error: node_modules directory is missing')
  }
  return {
    status: 200,
    body: JSON.stringify(deps.dependencies)
  }
}
exports.handler = arc.http.async(checkDeps)
```

```js
// src/http/post-echo

let arc = require("@architect/functions")
async function echo(request) {
  let echo = arc.http.helpers.bodyParser(request)
  return {
    status: 200,
    body: JSON.stringify(echo)
  }
}
exports.handler = arc.http.async(echo)
```

## Hydrating dependencies

Your project can also have a `package.json` at the root of the project to manage project level dependencies and NPM scripts. It is important to note which directory you are running `npm install`. In order to hydrate the dependencies of each function, use `arc hydrate`.

In the root of the project let's add a `package.json` with a start script

```bash
npm init -y
npm install -D @architect/sandbox
```

```json
"scripts": {
    "start": "arc sandbox"
  }
```
Run `npm start` in the terminal to start Sandbox, a local dev server. Notice that when Sandbox starts, it checks each function for a `package.json` and installs any dependencies if they are missing.