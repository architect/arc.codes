---
title: '@tables-streams'
category: app.arc
description: Define DynamoDB tables with streaming changes
---

Define Lambda functions for streaming changes to DynamoDB tables. Respond to `insert`, `update`, and `destroy` events with a handler function.

> ⚠️  Unfortunately, "dynalite" (used under the hood in Architect [Sandbox](../cli/sandbox)) doesn't support streams, so emulation isn't supported for local development.

## Recommended Resources

[AWS DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.html)

## Syntax

- Lowercase alphanumeric string
- Must match a `@tables` name

> Using `@tables-streams` requires specifying corresponding `@tables`.

## Example

This `app.arc` file defines a table with a corresponding stream handler:

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

@tables-streams
people

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
      }
    }
  ],
  "tables-streams": [
    "people"
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
[tables.people]
pplID="*String"

tables-streams=["people"]
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

tables-streams:
- people
```
</div>
</arc-tab>

</div>
</arc-viewer>

