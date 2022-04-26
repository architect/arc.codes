import test from 'tape'
import { get } from 'tiny-json-http'
import { start, end } from '@architect/sandbox'
import { currentRoot } from '../../src/shared/redirect-map.mjs'

const host = 'http://localhost:3333'
const root = `${host}${currentRoot}`

test('check key paths', async (t) => {
  await start({ quiet: true })
  t.pass(`sandbox started at ${host}`)

  const quickstart = await get({ url: root })
  t.ok(quickstart.body, 'got quickstart document')

  const playground = await get({ url: `${host}/playground` })
  t.ok(playground.body, 'got static playground document')

  await end()
  t.pass('sandbox ended')

  t.end()
})
