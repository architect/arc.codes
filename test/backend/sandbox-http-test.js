let test = require('tape')
let tiny = require('tiny-json-http')
let sandbox = require('@architect/sandbox')
let { currentRoot } = require('../../src/shared/redirect-map')

const host = 'http://localhost:3333'
const root = `${host}${currentRoot}`

test('check key paths', async (t) => {
  await sandbox.start({ quiet: true })
  t.pass(`sandbox started at ${host}`)

  let quickstart = await tiny.get({ url: root })
  t.ok(quickstart.body, 'got quickstart document')

  let playground = await tiny.get({ url: `${host}/playground` })
  t.ok(playground.body, 'got static playground document')

  await sandbox.end()
  t.pass('sandbox ended')

  t.end()
})
