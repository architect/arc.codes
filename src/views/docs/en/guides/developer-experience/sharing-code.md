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

Architect makes it easy to share code across Lambda functions. Share business logic across functions with the [`@shared`](../../reference/project-manifest/shared) pragma and view templates with the [`@views`](../../reference/project-manifest/views) pragma.

Enabling these features instructs Architect to automatically copy the contents of `./src/shared` into all Lambdas and `./src/views` into `@http` GET Lambda functions.

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
│   │   ├── get-index
│   │   │   └── index(.js|.rb|.py)
│   │   └── post-like
│   │       └── index(.js|.rb|.py)
│   ├── shared
│   │   └── authenticate(.js|.rb|.py)
│   └── views
│       └── document(.js|.rb|.py)
└── app.arc
```

`get-index` can use shared code by requiring it from `@architect/shared/<file>` and views code from `@architect/views/<file>`:

<arc-viewer default-tab=js>
<div slot=contents>

<arc-tab label=js>
<h5>js</h5>
<div slot=content>

```js
// get-index/index.js
const auth = require('@architect/shared/authenticate')
const document = require('@architect/views/document')
```

</div>
</arc-tab>

<arc-tab label=rb>
<h5>rb</h5>
<div slot=content>

```rb
# get-index/index.rb
require_relative './vendor/shared/authenticate'
require_relative './vendor/views/document'
```

</div>
</arc-tab>

<arc-tab label=py>
<h5>py</h5>
<div slot=content>

```py
# get-index/index.py
import vendor.shared.authenticate
import vendor.views.document
```

</div>
</arc-tab>

</div>
</arc-viewer>

The `post-like` route has access to shared code as well, but not views because it does not respond to a GET request.

<arc-viewer default-tab=js>
<div slot=contents>

<arc-tab label=js>
<h5>js</h5>
<div slot=content>

```js
// post-like/index.js
const auth = require('@architect/shared/authenticate')
```

</div>
</arc-tab>

<arc-tab label=rb>
<h5>rb</h5>
<div slot=content>

```rb
# post-like/index.rb
require_relative './vendor/shared/authenticate'
```

</div>
</arc-tab>

<arc-tab label=py>
<h5>py</h5>
<div slot=content>

```py
# post-like/index.py
import vendor.shared.authenticate
```

</div>
</arc-tab>

</div>
</arc-viewer>

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

<arc-viewer default-tab=js>
<div slot=contents>

<arc-tab label=js>
<h5>js</h5>
<div slot=content>

```js
// get-index/index.js
const auth = require('@architect/shared/authenticate')
const document = require('@architect/views/document')
```

</div>
</arc-tab>

<arc-tab label=rb>
<h5>rb</h5>
<div slot=content>

```rb
# get-index/index.rb
require_relative './vendor/shared/authenticate'
require_relative './vendor/views/document'
```

</div>
</arc-tab>

<arc-tab label=py>
<h5>py</h5>
<div slot=content>

```py
# get-index/index.py
import vendor.shared.authenticate
import vendor.views.document
```

</div>
</arc-tab>

</div>
</arc-viewer>

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
