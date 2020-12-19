---
title: Indexes
description: Indexes give you access to alternate query patterns, and can speed up queries.
sections:
  - Overview
  - Getting started
  - Examples
---

## Overview

Indexes give you access to alternate query patterns, and can speed up queries. Architect provides fast access to items in a table by specifying primary key values. Indexing comes into the picture if you want to fetch the data of attributes other than the primary key.

It's another way to slice up your data. So lets use a concrete example:

```bash
@tables
accounts
  email *String
  
@indexes
accounts
  username *String
```

In this example you can query for an account by their username or email!

---

## Getting started

### Syntax
- `@indexes` is a feature subset of `@tables`; as such, the names of your declared indexes must match those of your `@tables`
- Otherwise, the basic syntax for defining `@indexes` is the same as `@tables`:
  - Partition key, defined by a `*`, is required
  - Sort key, defined by `**`, is optional
  - Currently only `*String`, `**String`, `*Number` and `**Number` are supported

## Examples

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

> DynamoDB is a powerful database. There is a great deal more to learn to take full advantage of it. Dig into [Amazon's DynamoDB documentation](https://aws.amazon.com/documentation/dynamodb/) to build out your app's data layer.
