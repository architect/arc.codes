# Tables
## Read and write data with single digit millisecond latency

Durable persistence of structured data is the foundation for all powerful web apps. Data needs to be instantaneous, consistent, secure, and transparently scale to meet demand.

Architect `@tables` defines [DynamoDB tables](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.TablesItemsAttributes) and `@indexes` define [global secondary indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.SecondaryIndexes) to facilitate more advanced access patterns.

> If you've never used DynamoDB before, we recommend you familiarize yourself with the [DynamoDB Core Components](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)

---

- <a href=#define><b>📋 Define Tables</b></a>
- <a href=#index><b>📇 Add Indexes</b></a>
- <a href=#local><b>🚜 Work Locally</b></a>
- <a href=#provision><b>🌾 Provision</b></a>
- <a href=#encrypt><b>🔒 Encryption</b></a>
- <a href=#sec><b>💰 IAM Permissions</b></a>
- <a href=#deploy><b>⛵️ Deploy</b></a>
- <a href=#write><b>🔏 Write Data</b></a>
- <a href=#read><b>📖 Read Data</b></a>
- <a href=#stream><b>📚 Stream Data</b></a>
- <a href=#recovery><b>📀 Point-in-time Data Recovery</b></a>
- <a href=#ttl><b>⏰ Time To Live</b></a>

---

<h2 id=define>📋 Define Tables</h2>

Tables are defined in `app.arc` under `@tables`:

```arc
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
```

*Table names are _lowercase alphanumeric_ and can contain _dashes_.* Each item within a table is uniquely identified by a [_primary key_](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey). The primary key can either be a simple, single-attribute _partition key_ or can be a _composite primary key_ composed of two attributes, a partition key and a _sort key_.

The partition key is indented two spaces and must be of the type `*String` or `*Number`. The optional sort key is defined using `**String` or `**Number`.

> **Protip:** table names can be anything but choose a consistent naming scheme within your app namespace; one useful scheme is plural nouns like: `accounts` or `email-invites`

---

<h2 id=index>📇 Add Indexes</h2>

Indexes are defined in `app.arc` under `@indexes`:

```arc
@app
testapp

@tables
accounts
  accountID *String

@indexes
accounts
  email *String
```

For each index defined, arc will create a [_global secondary index_](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.SecondaryIndexes) for you. Secondary indexes are a powerful way to expand your querying capabilities in DynamoDB.

Just like the _base table_, you must define a primary key for the index. The attributes of the index's primary key do not have to include the attributes of the base table's primary key.

> 💪 Take full advantage of the querying capabilities provided by indexes and learn about [Best Practices Using Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes.html)


---

<h2 id=local>🚜 Work Locally</h2>

Running `arc sandbox` will mount the current `app.arc` into a local in-memory database on `http://localhost:5000`.

---

<h2 id=provision>🌾 Provision</h2>

Running `arc deploy` will setup the following AWS resources:

- `AWS::DynamoDB::Table`

Additionally `AWS::SSM::Parameter` resources are created for every table which can be inspected at runtime:

- **`/[StackName]/tables/[TableName]`** with a value of the generated DynamoDB Table

> All runtime functions have the environment variable `AWS_CLOUDFORMATION` which is the currently deployed CloudFormation stack name; this combined w the runtime `aws-sdk` or `@architect/functions` can be used to lookup these values in SSM

---

<h2 id=encypt>🔒 Encryption</h2>

By default tables are not encrypted. To enable encryption:

**AWS Managed**

Add `encrypt true` to any table

```
@tables
mySekretTable
  encrypt true
```

**Customer Managed Key**

Add `encrypt someValue` where `someValue` can be a CMK key ID, Amazon Resource Name (ARN), alias name, or alias ARN

```
@tables
senzitiveData
  encrypt arn:aws:kms:us-west-2:1234567890:key/12345-67890-1234-5678-901234567
```

--

<h2 id=sec>💰 IAM Permissions</h2>

By default all runtime functions generated with Architect have one generated <a href=https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege target=blank>IAM role</a> with the least privileges possible. This means Lambda functions can only access other resources defined in the same `app.arc` file.

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

<h2 id=deploy>⛵️ Deploy</h2>

- `arc deploy` to deploy with CloudFormation to staging
- `arc deploy production` to run a full CloudFormation production deployment

---

<h2 id=write>🔏 Write Data</h2>

Within any arc function handler you can interact with your tables and indexes
using the `@architect/functions` runtime helper library's [`tables` operations](/reference/functions/tables).
Given an `app.arc` as follows:

```
@tables
cats
  fluffId *Number
```

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

<h2 id=read>📖 Read Data</h2>

> Check out the [`@architect/functions` `tables` reference](/reference/functions/tables) for details

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

<h2 id=stream>📚 Stream Data</h2>

Stream changes on a DynamoDB table to a Lambda function.

```arc
@app
testapp

@tables
cats
  catID *String
  stream true
```

`arc init` creates `src/tables/cats` local code and `arc deploy` publishes to Lambda.

<section class="code-examples">

Node
```javascript
exports.handler = async function stream(event) {
  console.log(event)
  return true
}
```

Ruby
```ruby
def handler(event)
  puts event
  true
end
```

Python
```python
def handler(event, context):
    print(event)
    return True
```

</section>

> Your stream handler function should handle errors gracefully. Otherwise, by default, DynamoDB will keep delivering the same failed record changes to your handler until it succeeds; for more information please see the [AWS docs on this topic](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html#services-dynamodb-errors)

---

<h2 id=recovery>📀 Point-in-time Data Recovery</h2>

DynamoDB has a feature which [lets you recover your data](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html) to any point in time over the last 35 days (from the time its enabled).

This is not enabled by default. To enable this for a given table, within your `app.arc` file:

```arc
@tables
myTable
    PointInTimeRecovery true
```

<h2 id=ttl>⏰ Time To Live</h2>

From the [AWS Docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html):

> Time to Live (TTL) for Amazon DynamoDB lets you define when items in a table expire so that they can be automatically deleted from the database. With TTL enabled on a table, you can set a timestamp for deletion on a per-item basis, allowing you to limit storage usage to only those records that are relevant.

In order to specify a TTL in arc

```arc
@tables
wines
  id *String
  _ttl TTL
```

`_ttl` becomes the item attribute holding the timestamp of when the item should expire, in epoch,

> **Protip:** items are rarely deleted at the moment specified by the specified TTL attribute. They are _typically_ deleted within 48 hours of the timestamp. You application logic should still check the value of that attribute. The convenience here is not having to remember to delete data from your table that is time bound. It will get deleted, eventually.

---

## Resources

- [`DynamoDB`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- [`DynamoDB.DocumentClient`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- [Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

---
