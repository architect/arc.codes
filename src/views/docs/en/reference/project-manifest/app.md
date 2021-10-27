---
title: '@app'
category: app.arc
description: Define the application namespace
---

`@app` declares the application namespace

## Syntax

- Lowercase alphanumeric string
- Maximum of 10 characters
- Dashes allowed; underscores not allowed
- Must begin with a letter

## Example

Create an app with the namespace "foobaz":

<arc-viewer default-tab=arc>
<div slot=contents>
<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
foobaz
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot="content">

```json
{
  "app": "foobaz"
}
```
</div>
</arc-tab>

<arc-tab label=toml>
<h5>toml</h5>
<div slot=content>

```toml
app="foobaz"
```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot="content">

```yaml
---
app: foobaz
```
</div>
</arc-tab>

</div>
</arc-viewer>
