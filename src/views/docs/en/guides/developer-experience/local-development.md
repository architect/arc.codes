---
title: Local development
category: Developer experience
description: How to develop locally with Architect sandbox
---

Fast local development creates a tighter feedback loop maximizing developer velocity.

## Requirements

- **Platforms:** Linux, macOS, Windows
- **Architect runtime:** Node.js 14+
- **Function runtimes & package managers:**
  - Node.js (optional, [supported versions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)) with [`npm`](https://www.npmjs.com/) 6+ or [`yarn`](https://yarnpkg.com/) 1+
  - Python (optional, [supported versions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)) and optionally [`pip3`](https://pip.pypa.io/en/stable/)
  - Ruby (optional, [supported versions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)) and optionally [`bundle`](https://bundler.io/)

## Preview

Follow the [quickstart](/docs/en/get-started/quickstart) to get everything wired up. To preview a project running locally in a web browser:

```bash
cd myproject
npx arc sandbox
```
>  `npx arc sandbox` kicks up a local web server with all the resources defined in your `app.arc` file
## Testing

Checkout [a complete example project for working locally](https://github.com/architect-examples/arc-example-working-locally).

### Testing `@http` functions

Use `@architect/sandbox` as a module to test `@http` functions with Node:

```javascript
const test = require('tape')
const tiny = require('tiny-json-http')
const sandbox = require('@architect/sandbox')

test('setup', async t=> {
  t.plan(1)
  await sandbox.start()
  t.ok(true, 'sandbox started on http://localhost:3333')
})

test('get /', async t=> {
  t.plan(1)
  let result = await tiny.get({ url: 'http://localhost:3333' })
  t.ok(result, 'got 200 response')
})

test('teardown', async t=> {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'sandbox ended')
})
```

### Testing `@events` and `@queues`

Use `@architect/functions` to publish locally to `@events` or `@queues` for testing.

```javascript
const test = require('tape')
const arc = require('@architect/functions')
const sandbox = require('@architect/sandbox')

test('setup', async t=>{
  t.plan(1)
  await sandbox.start()
  t.ok(true, 'started')
})

test('@events', async t=> {
  t.plan(1)
  // mock pingID
  let pingID = 'testing-ping'
  // send a ping event
  await arc.events.publish({
    name: 'ping',
    payload: { pingID }
  })
  // see if testing-ping is in the db
  let data = await arc.tables()
  let { hits } = await data.pings.get({ pingID })
  t.ok(hits, 'pong!')
})

test('teardown', async t=>{
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'closed')
})

```

### Testing `@tables`

Using `@architect/functions` to interact with DynamoDB `@tables` defined locally.

```javascript
const test = require('tape')
const arc = require('@architect/functions')
const sandbox = require('@architect/sandbox')

test('setup', async t=>{
  t.plan(1)
  await sandbox.start()
  t.ok(true, 'started')
})

test('db', t=> {
  t.plan(1)
  let data = await arc.tables()
  let cats = await data.cats.scan({})
  t.ok(Array.isArray(cats.Items), 'bag o cats')
})

test('teardown', async t=>{
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'closed')
})
```
