---
title: '@indexes'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@indexes` defines DynamoDB table indexes

## Syntax

- `@indexes` is a feature subset of `@tables`; as such, the names of your declared indexes must match those of your `@tables`
- Otherwise, the basic syntax for defining `@indexes` is the same as `@tables`:
  - Partition key, defined by a `*`, is required
  - Sort key, defined by `**`, is optional
  - Currently only `*String`, `**String`, `*Number` and `**Number` are supported

## Example

The following `app.arc` file defines a DynamoDB table with two Global Secondary Indexes:

```bash
@app
testapp

@tables
accounts
  accountID *String

@indexes
accounts
  email *String

accounts
  created *String
```

### Recommended

DynamoDB is a powerful database. There is a great deal more to learn to take full advantage of it. Dig into [Amazon's DynamoDB documentation](https://aws.amazon.com/documentation/dynamodb/) to build out your app's data layer.

---