---
title: '@indexes'
category: app.arc
description: Define DynamoDB table global secondary indexes.
---

Defines [Global Secondary Indexes][gsi] for your project's [DynamoDB][ddb] tables. `@indexes` should only ever be paired with [`@tables`][tables].

## Recommended

[DynamoDB][ddb] is a powerful database, though different from both SQL and NoSQL databases. It is highly recommended to dig into Amazon's resources to familiarize yourself with it:

- [DynamoDB Core Components (start here!)][core]
- [Global Secondary Indexes in DynamoDB][gsi]
- [Amazon's full DynamoDB documentation][ddb]

## Syntax

- `@indexes` is a feature subset of [`@tables`][tables]; as such, the names of your declared indexes must match those of your [`@tables`][tables]
- Otherwise, the basic syntax for defining `@indexes` primary keys is the same as [`@tables`][tables]:
  - Partition key, defined by a `*`, is required
  - Sort key, defined by `**`, is optional
  - Currently only `*String`, `**String`, `*Number` and `**Number` are supported
- An optional `name` property can be provided to explicitly name the index. This is helpful when [querying the index with the AWS SDK as you know what to pass to the `IndexName` query parameter](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property)

## Example

The following `app.arc` file defines a [DynamoDB][ddb] table with two [Global Secondary Indexes][gsi]:


<arc-viewer default-tab=arc>
<div slot=contents class=bg-g4>
<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
testapp

@tables
accounts
  accountID *String

@indexes
accounts
  email *String
  name byEmail

accounts
  created *String
  name byDate
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "testapp",
  "tables": [
    { "accounts": { "accountID": "*String" } }
  ],
  "indexes": [
    { "accounts": { "email": "*String", "name": "byEmail" } },
    { "accounts": { "created": "*String", "name": "byDate" } }
  ]
}
```
</div>
</arc-tab>

<arc-tab label=toml>
<h5>toml</h5>
<div slot=content>

```toml
app="testapp"

[[tables]]
[tables.accounts]
accountID="*String"

indexes = [
{ "accounts" = { "email" = "*String", "name" = "byEmail" } },
{ "accounts" = { "created" = "*String", "name" = "byDate" } }
]
```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: testapp

tables:
- accounts:
    accountID: "*String"

indexes:
- accounts:
  - email: "*String"
  - name: "byEmail"
- accounts:
  - created: "*String"
  - name: "byDate"
```
</div>
</arc-tab>

</div>
</arc-viewer>

[tables]: tables
[core]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
[ddb]: https://aws.amazon.com/documentation/dynamodb/
[gsi]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html
