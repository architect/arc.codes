# Testing
## Fast feedback loops 
---

## Node

Directly require `@architect/sandbox` for headless testing:

```javascript
let sandbox = require('@architect/sandbox')
let tape = require('tape')
let end

test('start', async t=> {
  t.plan(1)
  end = await sandbox.start()
  t.ok(true, 'started sandbox')
})

test('end', async t=> {
  t.plan(1)
  end()
  t.ok(true, 'sandbox shutdown')
})
```

---

## Ruby

---
## Python

---
