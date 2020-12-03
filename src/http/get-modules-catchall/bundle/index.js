const { rollup } = require('rollup')
const path = require('../cache/cache-path')
const write = require('../cache/cache-write')

module.exports = async function bundle({ module }) {
  console.time('bundle')
  let key = module
  let input = path(key)
  let bundle = await rollup({ input })
  let bundled = await bundle.generate({ format: 'esm' })
  let body = bundled.output[0].code
  console.timeEnd('bundle')
  console.log(
   'KEY\n',
    key
  )

  return write({ key, body })
}
