---
title: '<code>@tables</code>'
category: app.arc
description: Define DynamoDB database tables
---

Define [DynamoDB][ddb] tables with optional:

- [encryption at rest][encryption]
- [time-to-live item expiry][ttl]
- [point-in-time recovery][recovery]

[Global Secondary Indexes][gsi] can be specified on each table you define using the [`@tables-indexes`][tables-indexes] pragma.

Additionally, database changes can be streamed to a function with the [`@tables-streams`][tables-streams] pragma.

## Recommended Resources

[DynamoDB][ddb] is a powerful database, though different from both SQL and NoSQL databases. It is highly recommended to dig into Amazon's resources to familiarize yourself with it:

- [DynamoDB Core Components (start here!)][core]
- [Amazon's full DynamoDB documentation][ddb]

## Syntax

### Table name syntax

- Lower + upper case alphanumeric string
- Between 3 and 255 characters
- Dashes, periods, and underscores are allowed
- Must begin with a letter


### Table structure syntax

- Keys and Lambdas are defined by indenting two spaces
- The required partition key is denoted by `*`
- The optional sort key is denoted by `**`
- Currently only `*String`, `**String`, `*Number` and `**Number` are supported
- `insert`, `update`, and `destroy` events can be handled with [`@tables-streams`][tables-streams]

> Note: `app.arc` creates fully isolated tables for `staging` and `production`.

### Streaming Changes to a Lambda

Use the [`@tables-streams`][tables-streams] pragma to have Architect create a [Lambda function which will receive events whenever items in the table get inserted, updated or deleted][stream]. Architect will create the Lambda for you locally under `src/tables-streams/<tableName>`.

### Encrypting Tables

Define a `encrypt` property under a table definition to enable [encryption at rest][encryption] for your DynamoDB table. If `encrypt` is a boolean (i.e. `encrypt true`), then AWS will manage the encryption key. If a non-boolean is provided to `encrypt` (i.e. `encrypt hithere`), then the parameter is assumed to be an [AWS Key Management Service][kms] custom [master key ID](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id).

> Note: use of a custom master key will apply additional AWS KMS related charges

### Time To Live

[Time To Live (TTL)][ttl] lets you define when items in a table expire so that they can be automatically deleted from the table. To specify a TTL attribute on items in a table, define an attribute name under the table definition and assign a value of `TTL` to it. For example, a definition of `expires TTL` would set the `expires` attribute on items in the table as holding the timestamp (in epoch) for when the item should expire.

> Note: items are rarely deleted at the moment specified by the TTL attribute. They are typically deleted within 48 hours of the timestamp. Your application logic should still check the value of that attribute. The convenience here is not having to remember to delete data from your table that is time bound. It will get deleted, eventually.

### Point-in-Time Recovery

DynamoDB has a feature which lets you [recover your data][recovery] to any point in time over the last 35 days (from the time it is enabled). Define a `PointInTimeRecovery true` property under a table definition to enable this feature.

## Example

This `app.arc` file defines three database tables:

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
testapp

@tables
people
  pplID *String

cats
  pplID *String
  catID **String
  encrypt true
  PointInTimeRecovery true

fleeting-thoughts
  pplID *String
  expires TTL
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
    {
      "people": {
        "pplID": "*String"
      },
      "cats": {
        "pplID": "*String",
        "catID": "**String",
        "encrypt": true,
        "PointInTimeRecovery": true
      },
      "fleeting-thoughts": {
        "pplID": "*String",
        "expires": "TTL"
      }
    }
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
- people:
    pplID: "*String"
- cats:
    pplID: "*String"
    catID: "**String"
    encrypt: true
    PointInTimeRecovery: true
- fleeting-thoughts:
    pplID: "*String"
    expires: "TTL"
```
</div>
</arc-tab>

</div>
</arc-viewer>

[tables-indexes]: tables-indexes
[tables-streams]: tables-streams
[core]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
[ddb]: https://aws.amazon.com/documentation/dynamodb/
[encryption]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html
[gsi]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html
[kms]: https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html
[recovery]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html
[stream]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.html
[ttl]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html
