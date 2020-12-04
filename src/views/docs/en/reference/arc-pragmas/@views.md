---
title: '@views'
description: Pragma for sharing view code
sections:
---

## Overview

`@views` specifies how to copy shared view code from `src/views/*` to your lambda functions.

By default files found in the `src/views/` directory will be copied into `node_modules/@architect/views/` of every `GET` route.

You can also specify to only copy view code to specific lambda functions by listing them directly below the `@views` pragma.

## Syntax
- Routes should be existing `@http` routes.
- Route names follow the same requirements as `@http` routes. [see `@http`](@http)

## Example

This `app.arc` file defines specific `@http` functions to copy `src/views/` to:

```arc
@app
testapp

@http
get /
get /kittens
get /dogs
get /raccoons

@views
get /kittens
get /raccoons
```

