---
title: Sharing code
category: Developer experience
description: How to share code within your Architect project
sections:
  - Overview
  - Principles & best practices
  - src/shared
  - src/views
---

Architect makes it easy to share code across Lambda functions. The most common use case is to share business logic and view templates. Architect has [`@shared`](../../reference/project-manifest/shared) and [`@views`](../../reference/project-manifest/views) pragmas to provide this functionality.

Architect automatically copies the contents of `src/shared` into all Lambdas and `src/views` into `@http` GET Lambda functions.

## Example usage

Given a simple `app.arc` where `@shared` and `@views` are declared:

```arc
@app
myapp

@shared

@views

@http
get /
post /like
```

Where utility code lives in `./src/shared` and common view code in `.src/views`:

```sh
.
├── src
│   ├── http
│   │   ├── get-index/index.js
│   │   └── post-like/index.js
│   └── shared
│       └── authenticate.js
│   └── views
│       └── document.js
└── app.arc
```

`get-index` can use shared code by requiring it from `@architect/shared/<file>` and views code from `@architect/views/<file>`:

```js
// get-index/index.js
const auth = require('@architect/shared/authenticate')
const document = require('@architect/views/document')
```

The `post-like` route has access to shared code as well, but not views because it does not respond to a GET request.

```js
// post-like/index.js
const auth = require('@architect/shared/authenticate')
```

## Custom shared paths

The default shared and views directories can be overridden:

```arc
@app
myapp

@shared
src path/to/shared

@views
src path/to/views
```

They are still required in the same way:

```js
// get-index/index.js
const auth = require('@architect/shared/authenticate')
const document = require('@architect/views/document')
```

## Runtime details

No matter where `@shared` source is configured it gets copied to every Lambda. The destination is slightly different depending on runtime:

| Runtime | `@shared` destination |
| --- | --- |
| Node | `src/http/get-index/node_modules/@architect/shared` |
| Ruby | `src/http/get-index/vendor/shared` |
| Python | `src/http/get-index/vendor/shared` |

Likewise, `@views` runtime destinations:

| Runtime | `@views` destination |
| --- | --- |
| Node | `src/http/get-index/node_modules/@architect/views` |
| Ruby | `src/http/get-index/vendor/views` |
| Python | `src/http/get-index/vendor/views` |

> Tip: the entire contents of `src/shared` are copied so we strongly suggest keeping the directory structure as flat as possible, and the payloads as small as possible to ensure the best performance.

## Shared code dependencies

`@shared` and `@views` resources can have their own dependencies defined by `package.json`, `requirements.txt` or `Gemfile`. These dependencies will also be copied to corresponding Lambdas.
