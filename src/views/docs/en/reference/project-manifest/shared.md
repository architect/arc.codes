---
title: '<code>@shared</code>'
category: app.arc
description: Configure <code>src/shared</code> code
---

Configure the location of shared code. For a full example, see [Sharing Code](../../guides/developer-experience/sharing-code).

## Syntax

- File path of the folder containing shared code

## Example

The following configuration examples define a different folder than the default `src/shared` directory.

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
myapp

@shared
src path/to/code
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "myapp",
  "shared": {
    "src": "path/to/code"
  }
}
```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: myapp
shared:
  - src: path/to/code
```
</div>
</arc-tab>

</div>
</arc-viewer>

## Specific function opt-out

A function can be [configured with a `config.arc`](../configuration/function-config#%40arc) to not have `@shared` code automatically hydrated.
