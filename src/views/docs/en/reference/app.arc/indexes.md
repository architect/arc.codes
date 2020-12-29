---
title: '@indexes'
description: Define DynamoDB table global secondary indexes.
---

Defines DynamoDB table global secondary indexes.

## Syntax

- `@indexes` is a feature subset of `@tables`; as such, the names of your declared indexes must match those of your `@tables`
- Otherwise, the basic syntax for defining `@indexes` is the same as `@tables`:
  - Partition key, defined by a `*`, is required
  - Sort key, defined by `**`, is optional
  - Currently only `*String`, `**String`, `*Number` and `**Number` are supported

## Example

The following `app.arc` file defines a DynamoDB table with two Global Secondary Indexes:


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

accounts
  created *String
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
    { "accounts": { "email": "*String" } },
    { "accounts": { "created": "*String" } }
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
{ "accounts" = { "email" = "*String" } },
{ "accounts" = { "created" = "*String" } }
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
- accounts:
  - created: "*String"
```
</div>
</arc-tab>

</div>
</arc-viewer>


### Recommended

DynamoDB is a powerful database. There is a great deal more to learn to take full advantage of it. Dig into [Amazon's DynamoDB documentation](https://aws.amazon.com/documentation/dynamodb/) to build out your app's data layer.
