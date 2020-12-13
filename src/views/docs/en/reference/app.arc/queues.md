---
title: '@queues'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@queues` define SQS topics and Lambda handlers for them

### Syntax

- Lowercase alphanumeric string
- Maximum of 50 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

### Example

This `app.arc` file defines two `@queues`:

<arc-tab-bar>

<arc-tab label="arc">

  <h5>arc</h5>

  <div slot="content">

```arc
@app
myapp

@queues
convert-image
publish-log
```
  </div>

</arc-tab>

<arc-tab label="json">

  <h5>json</h5>

  <div slot="content">

```json
{
  "app": "myapp",
  "queues": [
    "convert-image",
    "publish-log"
  ]
}
```

  </div>

</arc-tab>

<arc-tab label="toml">

  <h5>toml</h5>

  <div slot="content">

```toml
app="myapp"

queues=[
  "convert-image"
  "publish-log"
]
```

  </div>

</arc-tab>

<arc-tab label="yaml">

  <h5>yaml</h5>

  <div slot="content">

```yaml
app: myapp
queues:
- convert-image
- publish-log
```

  </div>

</arc-tab>

<arc-tab-bar>

Which generates the corresponding code:

```bash
/
├── queues
│   ├── convert-image/
│   └── publish-log/
├── app.arc
└── package.json
```

---
