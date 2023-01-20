---
title: <code>@tables-indexes</code>
category: app.arc
description: Define DynamoDB table global secondary indexes.
---

Defines [Global Secondary Indexes][gsi] for your project's [DynamoDB][ddb] tables. `@tables-indexes` should only ever be paired with [`@tables`][tables].

> ℹ️  As of Architect v9.4, `@tables-indexes` should be used in place of `@indexes`. `@indexes` will be superseded in a future Arc release.

## Recommended Resources

[DynamoDB][ddb] is a powerful database, though different from both SQL and NoSQL databases. It is highly recommended to dig into Amazon's resources to familiarize yourself with it:

- [DynamoDB Core Components (start here!)][core]
- [Global Secondary Indexes in DynamoDB][gsi]
- [Amazon's full DynamoDB documentation][ddb]

## Syntax

- `@tables-indexes` is a feature subset of [`@tables`][tables]; as such, the names of your declared indexes must match those of your [`@tables`][tables]
- Otherwise, the basic syntax for defining `@tables-indexes` primary keys is the same as [`@tables`][tables]:
  - Partition key, defined by a `*`, is required
  - Sort key, defined by `**`, is optional
  - Currently only `*String`, `**String`, `*Number` and `**Number` are supported
- An optional `name` property can be provided to explicitly name the index. This is helpful when [querying the index with the AWS SDK as you know what to pass to the `IndexName` query parameter](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property)
- An optional `projection` property can be provided to explicitly define which [item attributes get projected][projection], or included, in query results. By default, Arc will project _all_ item attributes (the `ALL` projection type as described in the [DynamoDB documentation on attribute projections][projection])
  - Customizing which attributes to project can be helpful when trying to save on [storage costs][pricing]
  - Note that once a projection is defined, it cannot be changed; a new index would need to be created
  - Acceptable values for `projection` are:
    - `all` (default): all item attributes from the table are projected into the index
    - `keys`: only the base table and index primary keys (and sort keys, if defined) are projected into the index
    - Custom: otherwise, you may define one or more attribute names to explicitly project into the index. Note that the base table and index keys always get projected

## Example

The following `app.arc` file defines a [DynamoDB][ddb] table with two named [Global Secondary Indexes][gsi], both with `projection` explicitly defined:

<arc-viewer default-tab=arc>
<div slot=contents>
<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
testapp

@tables
accounts
  accountID *String

@tables-indexes
accounts
  email *String
  projection keys # only project base table and index keys (in this example that would be accountID and email)
  name byEmail

accounts
  created *String
  projection updated lastAccessed # only project base table and index keys plus the updated and lastAccessed attributes
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
    { "accounts": { "email": "*String", "name": "byEmail", "projection": "keys" } },
    { "accounts": { "created": "*String", "name": "byDate", "projection": [ "updated", "lastAccessed" ] } }
  ]
}
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

tables-indexes:
- accounts:
  - email: "*String"
  - name: "byEmail"
  - projection: "keys"
- accounts:
  - created: "*String"
  - name: "byDate"
  - projection: ["updated", "lastAccessed"]
```
</div>
</arc-tab>

</div>
</arc-viewer>

[tables]: tables
[core]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
[ddb]: https://aws.amazon.com/documentation/dynamodb/
[gsi]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html
[projection]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html#GSI.Projections
[pricing]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html#GSI.StorageConsiderations
