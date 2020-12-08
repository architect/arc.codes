---
title: hydrate
description: Quickly install and update dependencies for all functions in the src directory.
sections:
  - Overview
  - Usage
  - Flags
---

## Overview

[`@architect/hydrate`](Architect env) ensures that all functions managed by architect have their dependencies installed. Functions containing all its required dependencies are considered to be 'hydrated' - thus the name!


## Usage

> Note: the process running `hydrate` must be the same as the root of the project it's hydrating. So if the project you're trying to `hydrate` is located locally at `/projects/myapp` and you're running `hydrate` from `/scripts/hydrate`, you'll need to ensure you `process.chdir('/projects/myapp')` prior to execution


### `hydrate(options)`

`options` object can include the following properties:

- `basepath`: What path hydrate should consider as the root for searching for functions to hydrate. Useful if you want to hydrate a subset of functions. Defaults to `src` in the current working directory.
- `install`: If truthy, will invoke [`hydrate.install()`][install].
- `update`: If truthy, will invoke [`hydrate.update()`][update].

By default, invokes [`hydrate.shared()`][shared].


### `hydrate.install(options, callback)`

Installs dependencies for all Functions found in the specified `basepath`. Invokes [`hydrate.shared()`][shared].

Note that for the default value of `basepath='src'`, this means `install` will also hydrate shared folders like `src/shared` and `src/views`.

To ensure local development behavior is as close to `staging` and `production` as possible, `hydrate.install()` (and other hydrate functions) uses:

- **node.js**: `npm ci` if `package-lock.json` is present and `npm i` if not
- **python**: `pip3 install`
- **ruby**: `bundle install`


### `hydrate.update(options, callback)`

Updates dependencies in all Functions found in the specified `basepath`. Invokes [`hydrate.shared()`][shared]. Note that this will only functionally differ from [`hydrate.install()`][install] if you use a lock-file like `package-lock.json` or `Gemfile.lock`.

Note that for the default value of `basepath='src'`, this means `update` will also update dependencies in shared folders like `src/shared` and `src/views`.

`update` is functionally almost identical to [`install`][install], except it will update dependencies to newer versions _if they exist_. This is done via:

- **node.js**: `npm update`
- **python**: `pip3 install -U --upgrade-strategy eager`
- **ruby**: `bundle update`


### `hydrate.shared(options, callback)`

Copies shared code (from `src/shared` and `src/views`) into all Functions.


[shared]: #hydratesharedoptions-callback
[install]: #hydrateinstalloptions-callback
[update]: #hydrateupdateoptions-callback
[npm]: https://www.npmjs.com/package/@architect/hydrate

### `arc hydrate`

- `arc hydrate` runs `npm i` 
- `arc hydrate update` runs `npm update` 

> ⚠️ Note: this operation can take time to complete depending on how many Lambdas you have and how many modules they require.

## Flags

`[-s, --shared, shared]` - hydrates and copies shared files only
`[-u, --update, update]` - updates each function's dependencies
`[-v, --verbose, verbose]` - prints additional output to the console


