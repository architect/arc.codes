---
title: '@tables-streams'
category: app.arc
description: Define DynamoDB tables with streaming changes
---

Define Lambda functions for streaming changes to DynamoDB tables. Respond to `insert`, `update`, and `destroy` events with a handler function.

> ⚠️  Unfortunately, "dynalite" (used under the hood in Architect [Sandbox](../cli/sandbox)) doesn't support streams, so emulation isn't yet supported for local development.

## Recommended Resources

[AWS DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.html)

## Syntax

- Name
  - Lowercase alphanumeric string
  - Must match a `@tables` name

Table streams can use more verbose configuration to allow for [custom source paths](../../guides/developer-experience/custom-source-paths) and names in your project. Optionally provide a `name` and/or `src` for each table stream.

- `name` - a string as defined in `@tables`
- `src` - path to the function source

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
# verbose custom source:
a-named-table-stream
 table people
 src custom/source

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
    "people",
    {
      "a-named-table-stream": {
        "name": "people",
        "src": "custom/source"
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

tables-streams:
- people
# verbose custom source:
- "a-named-table-stream":
    name: "people"
    src: "custom/source"
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

# TOML doesn't allow mixed types in an array.
# Theoretically a "table" entry with a custom source would look like:

[["tables-streams"]]
["tables-streams"."a-named-table-stream"]
name = "people"
src = "custom/source"
```
</div>
</arc-tab>

</div>
</arc-viewer>

