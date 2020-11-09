---
title: arc.static
description: 160 (or fewer) character description of this document!
sections:
  - Overview
---

## Overview

`arc.static(assetPath, options)`

Returns the fully-qualified URI of a static asset for the project-relative `assetPath` parameter. Takes into account:

- What environment (testing, staging, production) we are running in.
- Whether fingerprinting is enabled.
- Whether the override environment variable `ARC_STATIC_BUCKET` is present.

`options` is an object with the following currently-supported properties:

- `stagePath`: boolean, prepends `/staging` or `/production` to the asset path; useful if the current app is being run on a naked (non-domain-mapped) API Gateway

