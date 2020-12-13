---
title: '@events'
description: Pragma defines SNS topics
---

 Define SNS topics with Lambda handler functions.

## Syntax

- Name
  - Lowercase alphanumeric string
  - Maximum of 50 characters
  - Dashes are allowed; underscores are not allowed
  - Must begin with a letter

## Example

These configuration examples show how to define events:


<h5>arc</h5>

```arc
@app
myapp

@events
hit-counter
likes
```

<h5>json</h5>

```json
{
  "app": "myapp",
  "events": [
    "hit-counter",
    "likes"
  ]
}
```

<h5>toml</h5>

```toml
app="myapp"
events=[
  "hit-counter",
  "likes"
]
```

<h5>yaml</h5>

```yaml
---
app: "myapp"
events:
- hit-counter
- likes
```

Which generates the following scaffolding:

```bash
/
├── events
│   ├── hit-counter/
│   └── likes/
├── app.arc
└── package.json
```
