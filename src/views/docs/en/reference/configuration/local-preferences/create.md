---
title: '@create'
category: prefs.arc
description: Sandbox environment variables
---

> Architect preferences (`preferences.arc`, or `prefs.arc`) defines settings for local Architect workflows. This file is intended to be added to `.gitignore`.

Preferences for resource creation with `arc init`.

## `autocreate`

By adding the `@create` pragma to your preferences file and specifying `autocreate true`, you can enable `arc sandbox`, `arc deploy`, and other workflows to automatically run `arc init` to create boilerplate Lambda handlers and static assets if they do not exist.

```arc
@create
autocreate true
```

## `templates`

Define custom boilerplate Lambda handlers on a per-pragma basis with `templates`:

```arc
@create
templates
  http path/to/template/http.js
  events path/to/template/events.py
```

In the above example, new `@http` functions will use your `path/to/template/http.js` template instead of the Architect default, while creating new `@events` functions will use the `path/to/template/events.py`. This will work for either `autocreate true` or the `arc init` command.
