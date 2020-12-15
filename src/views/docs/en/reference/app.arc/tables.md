---
title: '@tables'
description:
---

Define DynamoDB tables with optional streaming Lambda functions.

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

<arc-tab-bar>

<arc-tab label=arc>

<h5>arc</h5>

<div slot=content>

```arc
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
</div>

</arc-tab>

<arc-tab label=json>

<h5>
  json
</h5>

<div slot=content>

```json
{
  "app": "testapp",
  "tables": [
    {
      "people": {
        "pplID": "*String",
        "stream": true
      },
      "cats": {
        "pplID": "*String",
        "catID": "**String"
      }
    }
  ]
}
```
</div>

</arc-tab>

<arc-tab label=toml>

<h5>
  toml
</h5>

<div slot=content>

```toml
app="testapp"

[tables]
[[tables.people]]
pplID="*String"
stream=true
[[tables.cats]]
pplID="*String"
catID="**String"
```
</div>

</arc-tab>

<arc-tab label=yaml>

<h5>
  yaml
</h5>

<div slot=content>

```yaml
---
app: testapp

tables:
- people:
    pplID: "*String"
    stream: true
- cats:
    pplID: "*String"
    catID: "**String"
```
</div>

</arc-tab>

</arc-tab-bar>
