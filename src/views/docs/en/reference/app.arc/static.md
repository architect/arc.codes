---
title: '@static'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
  - Deployment
---

## Overview

`@static` is an S3 bucket for hosting static assets uploaded from `public/` folder

## Syntax

- No parameters are required
- `fingerprint` enables static asset file fingerprinting (and long-lived caching headers)
- `ignore` ignores files from `public/` folder
- `serialize` will serialize smaller files into API Gateway upon deployment

> Note: apps using `@http` can access static assets via `/_static` proxy; this is handy for keeping assets on the same-origin without ugly CORS hacks

## Example

This `app.arc` file defines a static bucket:


<arc-tab-bar>

<arc-tab label=arc>

<h5>arc</h5>

<div slot=content>

```arc
@app
testapp

@static
fingerprint true
ignore
  .tar.gz
  tmp
  user
```

</div>

</arc-tab>

<arc-tab label=json>

<h5>json</h5>

<div slot=content>

```json
{
  "architect": {
    "app": "testapp",
    "static": {
      "fingerprint": true,
      "ignore": [
        ".tar.gz",
        "tmp",
        "user"
      ]
    }
  },
  "start": "npx sandbox",
  "dependencies": {
    "@architect/architect": "latest"
  }
}
```

</div>

</arc-tab>

<arc-tab label=toml>

<h5>toml</h5>

<div slot=content>

```toml
app="testapp"

[static]
fingerprint=true
ignore=[
  ".tar.gz",
  "tmp",
  "user"
]

```

</div>

</arc-tab>

<arc-tab label=yaml>

<h5>yaml</h5>

<div slot=content>

```yaml
---
app: testapp

static:
  fingerprint: true
  ignore:
    - ".tar.gz"
    - "tmp"
    - "user"
```

</div>

</arc-tab>

</arc-tab-bar>

## Deployment

Locally, if the folder `public/` exists, whenever you run `arc deploy` the contents are published to the `staging` stack. If you set `arc deploy production` the contents of `public/` are deployed to the production stack.

To _only_ deploy static assets from `/public` (and not function sources from `/src`), you can provide any of `--static`, `static` or `-s` flags, i.e. `arc deploy static`.

To _delete_ remote static assets on the S3 bucket that do not exist locally, provide the optional `--prune` or `--delete` flag, i.e. `arc deploy static --prune`.
