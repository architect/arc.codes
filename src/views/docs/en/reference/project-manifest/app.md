---
title: '<code>@app</code>'
category: app.arc
description: Define the application namespace
---

`@app` declares the application namespace

## Syntax

- Lower + upper case alphanumeric string
- Maximum of 100 characters
- Dashes and underscores are allowed
- Must begin with a letter

> 🪧  Changing the project's app name or [region](./aws#region) between deployments will create a new CloudFormation stack. The app namespace is used to create a stack name, which is unique to each AWS region.

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
