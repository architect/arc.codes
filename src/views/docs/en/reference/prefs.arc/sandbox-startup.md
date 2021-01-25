---
title: '@sandbox-startup'
description: Sandbox scripts
---

Hook up CLI commands into [`arc sandbox`](../cli/sandbox) startup. Helpful for repetitive tasks like seeding a database or starting up additional services for local development.

### Example

Execute arbitrary commands or scripts on [`arc sandbox`](../cli/sandbox) startup.

```arc
@sandbox-startup
  node scripts/seed_db.js
```
