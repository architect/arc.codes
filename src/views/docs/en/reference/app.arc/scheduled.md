---
title: '@scheduled'
description: 
---

Define EventBridge schedule expressions with Lambda handler functions.

### Syntax

- name
  - Lowercase alphanumeric string
  - Maximum of 20 characters
  - Dashes are allowed; underscores are not allowed
  - Must begin with a letter

- Interval
  - A valid `rate` or `cron` expression ([more info here](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html))

### Example

These configuration examples show how to define scheduled functions:

<arc-tab-bar>

<arc-tab label="arc">

  <h5>arc</h5>

  <div slot="content">

```arc
@app
myapp

@scheduled
daily-update-buddy rate(1 day)
friyay-only cron(0 15 ? * FRI *)
```

  </div>

</arc-tab>

<arc-tab label="json">

  <h5>json</h5>

  <div slot="content">

```json
{
  "app": "myapp",
  "scheduled": {
    "daily-update-buddy": "rate(1 day)",
    "friyay-only": "cron(0 15 ? * FRI *)" }
}
```

  </div>

</arc-tab>

<arc-tab label="toml">

  <h5>toml</h5>

  <div slot="content">

```toml
app="myapp"

[scheduled]
daily-update-buddy="rate(1 day)"
friyay-only="cron(0 15 ? * FRI *)"
```

  </div>

</arc-tab>

<arc-tab label="yaml">

  <h5>yaml</h5>

  <div slot="content">

```yaml
app: myapp
scheduled:
  - daily-update-buddy: rate(1 day)
  - friyay-only: cron(0 15 ? * FRI *)
```

  </div>

</arc-tab>

</arc-tab-bar>


Which generates the following scaffolding:

```bash
/
├── src/
│   └── scheduled/
│       ├── daily-update-buddy/
│       └── friyay-only/
├── app.arc
└── package.json
```
