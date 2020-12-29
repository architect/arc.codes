---
title: '@queues'
description: Define SQS topics
---

Define SQS topics with Lambda handler functions.

### Syntax

- Lowercase alphanumeric string
- Maximum of 50 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

### Example

This `app.arc` file defines two `@queues`:

<arc-viewer default-tab=arc>
<div slot=contents class=bg-g4>

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

<arc-tab label=toml>
<h5>toml</h5>
<div slot=content>

```toml
app="myapp"

queues=[
  "convert-image"
  "publish-log"
]
```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
app: myapp
queues:
- convert-image
- publish-log
```
</div>
</arc-tab>

</div>
<arc-viewer>

Which generates the corresponding code:

```bash
/
├── queues
│   ├── convert-image/
│   └── publish-log/
└── app.arc
```
