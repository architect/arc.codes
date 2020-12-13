---
title: '@shared'
description: Configure src/shared code
---

Configure the location of shared code.

### Syntax

- Lowercase alphanumeric string
- Maximum of 20 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

### Example

The following configuration examples define a different folder than the default `src/shared` directory.

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
