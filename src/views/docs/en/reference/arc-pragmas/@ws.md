---
title: '@ws'
description: Pragma to declare your app namespace
sections:
  - Overview
  - Syntax
  - Example
---

## Overview

`@ws` section defines WebSocket handlers


### Syntax

No other config required

### Example

This `app.arc` file defines both HTTP and WebSocket endpoints:

```bash
@app
testapp

@ws
# no other config required

@http
get /
```

Running `arc create` generates the following functions:

```bash
/
|-src
| |-http
| | '-get-index/
| '-ws
|   |-connect/
|   |-default/
|   '-disconnect/
'-app.arc
```