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

```bash
@app
testapp

@static
fingerprint true
ignore
  .tar.gz
  tmp
  user
```

## Deployment

Locally, if the folder `public/` exists, whenever you run `arc deploy` the contents are published to the `staging` stack. If you set `arc deploy production` the contents of `public/` are deployed to the production stack.

To _only_ deploy static assets from `/public` (and not function sources from `/src`), you can provide any of `--static`, `static` or `-s` flags, i.e. `arc deploy static`.

To _delete_ remote static assets on the S3 bucket that do not exist locally, provide the optional `--prune` or `--delete` flag, i.e. `arc deploy static --prune`.