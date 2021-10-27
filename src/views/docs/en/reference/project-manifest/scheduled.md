---
title: '@scheduled'
category: app.arc
description: Define EventBridge schedule expressions
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

Scheduled functions can use more verbose configuration to allow for [custom source paths](../../guides/developer-experience/custom-source-paths) in your project. Provide a `rate` or `cron` and `src` for each event.

### Example

These configuration examples show how to define scheduled functions:

<arc-viewer default-tab=arc>
<div slot=contents class=bg-g4>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
myapp

@scheduled
daily-update-buddy rate(1 day)
friyay-only cron(0 15 ? * FRI *)
# verbose custom source:
annual-review
  rate 1 year
  src custom/source
```

</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "myapp",
  "scheduled": {
    "daily-update-buddy": "rate(1 day)",
    "friyay-only": "cron(0 15 ? * FRI *)" },
    "annual-review": {
      "rate": [1, "year"],
      "src": "whatever/schedueld/dir/you/want"
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
scheduled:
  - daily-update-buddy: rate(1 day)
  - friyay-only: cron(0 15 ? * FRI *)
  # verbose custom source:
  - "annual-review":
      rate: [1, "year"]
      src: "custom/source"
```

</div>
</arc-tab>

<arc-tab label=toml>
<h5>toml</h5>
<div slot=content>

```toml
app="myapp"

[scheduled]
daily-update-buddy="rate(1 day)"
friyay-only="cron(0 15 ? * FRI *)"

# TOML doesn't allow mixed types in an array.
# Theoretically a "table" entry with a custom source would look like:

[scheduled."annual-review"]
rate = ["1", "year"]
src = "custom/source"
```

</div>
</arc-tab>

</div>
</arc-viewer>


Which generates the following scaffolding:

```bash
/
├── custom
│   └── source/
├── src/
│   └── scheduled/
│       ├── daily-update-buddy/
│       └── friyay-only/
├── app.arc
└── package.json
```
