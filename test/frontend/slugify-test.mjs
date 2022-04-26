import test from 'tape'
import slugify from '../../src/views/modules/helpers/slugify.mjs'

test('slugify', t => {
  const input = 'Architect manifest & config'
  const expected = 'architect-manifest-and-config'
  const actual = slugify(input)
  t.equals(expected, actual, 'slugifies')
  t.end()
})
