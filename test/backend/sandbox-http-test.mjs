import test from 'node:test'
import assert from 'node:assert'
import { get } from 'tiny-json-http'
import { start, end } from '@architect/sandbox'
import { currentRoot } from '../../src/shared/redirect-map.mjs'

const host = 'http://localhost:3333'
const root = `${host}${currentRoot}`

test('check key paths', async (t) => {
  await start({ quiet: true })
  assert.ok(true, `sandbox started at ${host}`)

  const quickstart = await get({ url: root })
  assert.ok(quickstart.body, 'got quickstart document')

  const playground = await get({ url: `${host}/playground` })
  assert.ok(playground.body, 'got static playground document')

  await end()
  assert.ok(true, 'sandbox ended')
})
