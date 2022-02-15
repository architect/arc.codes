---
title: '<code>@tables-streams</code>'
category: app.arc
description: Define DynamoDB tables with streaming changes
---

Define Lambda functions for streaming changes from DynamoDB tables. Respond to `insert`, `update`, and `destroy` events with a handler function.

## Recommended Resources

[AWS DynamoDB Streams](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.html)

## Syntax

- Name
  - Lowercase alphanumeric string
  - Must match a `@tables` name

Table streams can use more verbose configuration to allow for [custom source paths](../../guides/developer-experience/custom-source-paths) and names in your project. This is beneficial when creating more than one stream function for a single table. Optionally provide a `name` and/or `src` for each table stream.

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

</div>
</arc-viewer>

> ⚠️  Unfortunately, "dynalite" (used under the hood in Architect [Sandbox](../cli/sandbox)) doesn't support streams, so emulation isn't yet supported for local development.
