---
title: '@sandbox-startup'
category: prefs.arc
description: Sandbox scripts
---

Hook up CLI commands into [`arc sandbox`](../cli/sandbox) startup. Helpful for repetitive tasks like seeding a database or starting up additional services for local development. Each command should be a separate unindented line under the `@sandbox-startup` pragma.

### Example

```arc
@sandbox-startup
node scripts/seed_db.js
echo 'hello'
```
