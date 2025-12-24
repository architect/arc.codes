import test from 'node:test'
import assert from 'node:assert'
import slugify from '../../src/views/modules/helpers/slugify.mjs'

test('slugify', t => {
  const input = 'Architect manifest & config'
  const expected = 'architect-manifest-and-config'
  const actual = slugify(input)
  assert.strictEqual(expected, actual, 'slugifies')
})
