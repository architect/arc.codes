---
title: '@shared'
description: Configure src/shared code
---

`@shared` pragma allows you to configure the location of shared code to copy into functions for deployment

### Syntax

- Lowercase alphanumeric string
- Maximum of 20 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

### Example

This `app.arc` file:

<arc-tab-bar>

<arc-tab label="arc">

  <h5>arc</h5>

  <div slot="content">

```arc
@app
myapp

@shared
src path/to/code
```

  </div>

</arc-tab>

<arc-tab label="json">

  <h5>json</h5>

  <div slot="content">

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

<arc-tab label="toml">

  <h5>toml</h5>

  <div slot="content">

```toml
app="myapp"

[shared]
src="path/to/code"
```

  </div>

</arc-tab>

<arc-tab label="yaml">

  <h5>yaml</h5>

  <div slot="content">

```yaml
app: myapp
shared:
  - src: path/to/code
```

  </div>

</arc-tab>

</arc-tab-bar>
