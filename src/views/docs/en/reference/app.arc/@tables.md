---
title: '@tables'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@tables` defines DynamoDB database tables and trigger functions for them.

## Syntax

### Table name syntax
- Lowercase alphanumeric string
- Between 3 and 255 characters
- Dashes are allowed
- Underscores are not allowed
- Must begin with a letter

### Table structure syntax
- Keys and Lambdas are defined by indenting two spaces
- The required partition key is denoted by `*`
- The optional sort key is denoted by `**`
- Currently only `*String`, `**String`, `*Number` and `**Number` are supported
- Streaming data has replaced the `insert`, `update`, and `destroy` events.

> Note: `app.arc` creates fully isolated tables for `staging` and `production`.

## Example

This `app.arc` file defines two database tables:

```bash
@app
testapp

@tables
people
  pplID *String
  stream true

cats
  pplID *String
  catID **String
```

### Resources

- [Tables Primitive](/en/reference/databases/tables)