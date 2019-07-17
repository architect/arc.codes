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

test('your test here', t=> {
  t.plan(1)
  // test can talk to http://localhost:3333
  // or even the local DynamoDB http://localhost:5000
  t.ok(true, 'your test here')
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
