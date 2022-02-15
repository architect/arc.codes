---
title: Tables
description: Defines DynamoDB tables and indexes define global secondary indexes to facilitate more advanced access patterns.
sections:
  - Overview
  - Getting started
  - Examples
---

## Overview

How we store information is one of the pillars of app development. Durable persistence of structured data is the foundation for all powerful web apps. Data needs to be instantaneous, consistent, secure, and able to scale easily to meet demand. `@tables` defines DynamoDB database tables and trigger functions for them to read and write data with single digit millisecond latency.

Architect `@tables` defines DynamoDB tables and `@indexes` define global secondary indexes to facilitate more advanced access patterns.

> Read the official [AWS docs on DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)

**Sections**
[Getting started](#getting-started)
[Encryption](#encryption)
[IAM Permissions](#iam-permissions)
[Deploy](#deploy)
[Write Data](#write-data)
[Read Data](#read-data)
[Stream Data](#stream-data)
[Point-in-time Data Recovery](#point-in-time-data-recovery)
[Time To Live](#time-to-live)
[Examples](#examples)
[Resources](#resources)

## Getting started

### Work Locally

Tables are defined in your `app.arc` manifest file under `@tables` and `@indexes`:

```bash
@app
testapp

@tables
accounts
  accountID *String

cats
  accountID *String
  catID **String

secretDogs
  encrypt true
  accountId *String

@indexes
accounts
  email *String
```

> **Note**: `app.arc` creates fully isolated tables for `staging` and `production`. Running `arc sandbox` will mount the current `app.arc` into a local in memory database on `http://localhost:5000`.

### Tables

`@tables` defines DynamoDB database tables and trigger functions for them.


#### Table name syntax

- Lower + upper case alphanumeric string
- Between 3 and 255 characters
- Dashes, periods, and underscores are allowed
- Must begin with a letter


#### Table structure syntax

- Keys and Lambdas are defined by indenting two spaces
- The required partition key is denoted by `*`
- The optional sort key is denoted by `**`
- Currently only `*String`, `**String`, `*Number` and `**Number` are supported
- Lambdas can only be values of: `insert`, `update`, or `destroy`

> **Protip:** table names can be anything but choose a consistent naming scheme within your app namespace; one useful scheme is plural nouns like: `accounts` or `email-invites`


### Indexes

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

## Encryption

**AWS Managed**

By default tables are not encrypted. To enable encryption: Add `encrypt true` to any table:

```bash
@tables
mySekretTable
  encrypt true
Customer Managed Key
```

**Customer Managed Key**

Add encrypt `someValue` where `someValue` can be a CMK key ID, Amazon Resource Name (ARN), alias name, or alias ARN

```bash
@tables
senzitiveData
  encrypt arn:aws:kms:us-west-2:1234567890:key/12345-67890-1234-5678-901234567
```

---

## IAM Permissions

By default all runtime functions generated with Architect have one generated [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege ) with the least privileges possible. This means Lambda functions can only access other resources defined in the same `app.arc` file.

For `@tables` only the following IAM actions are allowed at runtime:

- `dynamodb:BatchGetItem`
- `dynamodb:BatchWriteItem`
- `dynamodb:PutItem`
- `dynamodb:DeleteItem`
- `dynamodb:GetItem`
- `dynamodb:Query`
- `dynamodb:Scan`
- `dynamodb:UpdateItem`
- `dynamodb:GetRecords`
- `dynamodb:GetShardIterator`
- `dynamodb:DescribeStream`
- `dynamodb:ListStreams`

> Note: wider account access can be explicitly granted with custom resource policies

---

## Deploy

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy production` to run a full CloudFormation production deployment

---

## Write Data

`put` with Node

```javascript
let arc = require('@architect/functions')

let data = await arc.tables()
await data.cats.put({fluffID: 2, name: 'sutr0'})
```

`update` with Ruby

```ruby
require 'architect/functions'

cats = Arc::Tables.table tablename: 'cats'

cats.update({
  key: {
    fluffID: 2
  },
  update_expression: 'set colour = :colour',
  expression_attribute_values: {
    ':colour' => 'grey'
  }
})
```

And `delete` with Python

```python
import arc.tables

cats = arc.tables.table(tablename='cats')
cats.delete_item(Key=1)
```

---

## Read Data

`scan` with Node

```javascript
let arc = require('@architect/functions')

let data = await arc.tables()
let cats = await data.cats.scan({})
```

`query` with Ruby

```ruby
require 'architect/functions'

cats = Arc::Tables.table tablename: 'cats'
result = cats.query {key_condition_expression: 'fluffID = 1'}
```

`get` with Python

```python
import arc.tables

cats = arc.tables.table(tablename='cats')
cat = cats.get_item(Key=1)
```

---

## Stream Data

Stream changes on a DynamoDB table to a Lambda function.

```bash
@app
testapp

@tables
cats
  catID *String
  stream true
```

- `arc init` creates `src/tables/cats` local code and
- `arc deploy` to publishes to Lambda

**Node**

```javascript
exports.handler = async function stream(event) {
  console.log(event)
  return true
}
```

**Ruby**

```ruby
def handler(event)
  puts event
  true
end
```

**Python**

```python
def handler(event, context):
    print(event)
    return True
```

---

## Point-in-time Data Recovery

DynamoDB has a feature which [lets you recover your data](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html) to any point in time over the last 35 days (from the time its enabled).

This is not enabled by default. To enable this for a given table, within your `app.arc` file:

```bash
@tables
myTable
    PointInTimeRecovery true
```

---

## Time To Live

From the [AWS Docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html):

> Time to Live (TTL) for Amazon DynamoDB lets you define when items in a table expire so that they can be automatically deleted from the database. With TTL enabled on a table, you can set a timestamp for deletion on a per-item basis, allowing you to limit storage usage to only those records that are relevant.

In order to specify a TTL in arc

```bash
@tables
wines
  id *String
  _ttl TTL
```

`_ttl` becomes the item attribute holding the timestamp of when the item should expire, in epoch

> **Protip:** items are rarely deleted at the moment specified by the specified TTL attribute. They are _typically_ deleted within 48 hours of the timestamp. You application logic should still check the value of that attribute. The convenience here is not having to remember to delete data from your table that is time bound. It will get deleted, eventually.

---

## Examples

ADD ME!

## Resources

- [`DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- [`DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- [Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
