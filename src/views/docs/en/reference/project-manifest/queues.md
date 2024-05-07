---
title: '<code>@queues</code>'
category: app.arc
description: Define SQS topics
---

Define SQS topics with Lambda handler functions.

### Syntax

- Lower + upper case alphanumeric string
- Maximum of 240 characters
- Dashes, periods, and underscores are allowed
- Must begin with a letter

### Example

This `app.arc` file defines two `@queues`:

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
myapp

@queues
convert-image
publish-log
```

</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

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

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: myapp
queues:
- convert-image
- publish-log
```

</div>
</arc-tab>

</div>
</arc-viewer>

Running `arc create` generates the following handlers:

```bash
/
├── src/queues/
│   ├── convert-image/
│   └── publish-log/
├── app.arc
└── package.json
```
