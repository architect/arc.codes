---
title: arc.tables
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - get
  - query
  - scan
  - put
  - delete
  - update
  - data._db
  - data._doc
  - data._name
---

## Overview

### `arc.tables(callback)`

Returns an object that can be used to access data in database tables as defined under `@tables` in your `app.arc` file. For example, given the following `app.arc` file snippet:

```bash
@tables
accounts
  accountID *String

messages
  msgID *String
```

Running the following code:

```js
let data = await arc.tables()
```
Would yield the following objects: 
- `data.accounts`: reference to the `accounts` table
- `data.messages`: reference to the `messages` table

... which contain the following methods:


## get

`get(key, callback)`: retrieves the record from the table with `key` key and invokes callback when complete

```js
let result = await data.accounts.get({
  accountID: 'fake'
})
// returns {"accountID: "fake"}
```

## query

`query(params, callback)`: queries the table using params and invokes callback with the result

```js
let result = await data.accounts.query({
  KeyConditionExpression: 'accountID = :id',
  ExpressionAttributeValues: {
    ':id': 'one',
  }
})
```

## scan - `scan(params, callback)`

scans the table using params and invokes callback with the result


## put - `put(item, callback)`

adds item to the table and invokes callback with the item when complete


## delete - `delete(key, callback)`

deletes the record from the table with `key` key and invokes callback with the result


## update - `update(params, callback)`

updates an item in the table using params and invokes callback when complete


## `data._db`
an instance of `DynamoDB` from the `aws-sdk`

## `data._doc`
an instance of `DynamoDB.DocumentClient` from the `aws-sdk`

## `data._name`
a helper for returning an environment appropriate table name

