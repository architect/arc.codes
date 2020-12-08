---
title: '@scheduled'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@scheduled` functions are functions invoked at specified times

### Syntax

- Lowercase alphanumeric string
- Maximum of 20 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter
- Followed by a valid `rate` or `cron` expression ([more info here](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html))

### Example

This `app.arc` file defines some scheduled functions:

```bash
@app
testapp

@scheduled
daily-update-buddy rate(1 day)
friyay-only cron(0 15 ? * FRI *)
```

Which generates the following code:

```bash
/
├── src/
│   └── scheduled/
│       ├── daily-update-buddy/
│       └── friyay-only/
├── app.arc
└── package.json
```