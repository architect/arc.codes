let test = require('tape')
let tiny = require('tiny-json-http')
let sandbox = require('@architect/sandbox')

const host = 'http://localhost:3333'

test('sandbox HTTP request', async t => {
  t.plan(4)

  await sandbox.start({ quiet: true })
  t.pass(`sandbox started on ${host}`)

  let quickstart = await tiny.get({ url: `${host}/docs/en/guides/get-started/quickstart` })
  t.ok(quickstart.body, 'got quickstart document')

  let playground = await tiny.get({ url: `${host}/playground` })
  t.ok(playground.body, 'got static playground document')

  await sandbox.end()
  t.pass('sandbox ended')
})
