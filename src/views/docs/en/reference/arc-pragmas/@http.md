---
title: '@http'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@http` section defines generic HTTP routes

## Syntax

- Each route begins with `get`, `post`, `put`, `patch` or `delete` followed by the desired path
- Must have a `/` route defined
- Additional routes must include a leading slash
- Dashes and underscores are not allowed
- Must begin with a letter

### Additional bits

- Advised maximum of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)

## Example

This `app.arc` file defines some typical HTML routes:

```bash
@app
testapp

@http
get /
get /pages
get /pages/:dateID
get /contact
post /contact
```

The `app.arc` above generates the following functions:

```bash
/
├── http
│   ├── get-index/
│   ├── get-pages/
│   ├── get-pages-000dateID/
│   ├── get-contact/
│   └── post-contact/
├── app.arc
└── package.json
```

> Note: The route `/pages/:dateID` corresponding handler deliberately looks a bit weird with the triple `000`. This is so you can quickly differentiate URL params from URL parts.
