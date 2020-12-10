---
title: arc.static
description: Get the URL of a static asset
sections:
  - Overview
  - Install runtime helpers for Node
  - Get the URL for an asset on S3
---

## Overview

Get the URL of a static asset: `arc.static(assetPath, options)`

Returns the fully-qualified URI of a static asset for the project-relative `assetPath` parameter. 

Takes into account:

- What environment (testing, staging, production) we are running in.
- Whether fingerprinting is enabled.
- Whether the override environment variable `ARC_STATIC_BUCKET` is present.

`options` is an object with the following currently-supported properties:

- `stagePath`: boolean, prepends `/staging` or `/production` to the asset path; useful if the current app is being run on a naked (non-domain-mapped) API Gateway

## Install runtime helpers for Node

```bash
cd path/to/lambda
npm init -f
npm install @architect/functions
```

Install runtime helpers for Ruby

```bash
cd path/to/lambda
bundle init
bundle install --path vendor/bundle
bundle add architect-functions
```

Install runtime helpers for Python

```bash
cd path/to/lambda
pip install --target ./vendor architect-functions
```

## Get the URL for an asset on S3

Node

```javascript
let arc = require('@achitect/functions')

let avatar = arc.static('/avatar')
```

Ruby

```ruby
require 'architect/functions'

avatar = Arc.static '/avatar'
```

Python

```python
import arc.static

avatar = arc.static('/avatar')
```

---
