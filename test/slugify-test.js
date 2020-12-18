import test from 'tape'
import slugify from '../src/views/modules/helpers/slugify.js'

test('slugify', t=> {
  let input = 'Architect manifest & config'
  let expected = 'architect-manifest-and-config'
  let actual = slugify(input)
  t.equals(expected, actual, 'slugifies')
  t.end()
})
