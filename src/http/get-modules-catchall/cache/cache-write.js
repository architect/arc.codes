const data = require('@begin/data')
const crypto = require('crypto')

module.exports = async function write ({ key, body }) {

  // Fingerprint it
  console.time('fingerprint')
  let hash = crypto.createHash('sha1')
  hash.update(Buffer.from(body))
  let sha = hash.digest('hex').substr(0, 7)
  let [file, extension] = key.split('/').slice(0).reverse().shift().split('.')
  let filename = `${ file }-${ sha }.${ extension }`
  console.timeEnd('fingerprint')

  console.log(
   'FILE\n',
    file
  )

  // Cache it
  console.time('begin-data-cache')
  let bundle = {
    table: 'module-cache',
    key,
    filename,
    body,
    headers: {
      'content-type': `text/${ extension === 'js' ? 'javascript' : 'css' }; charset=UTF-8`,
      'cache-control': 'max-age=315360000'
    },
  }
  let build = process.env.BEGIN_BUILD_COMMIT_SHA
  if (build) {
    bundle.build = build
  }
  await data.set(bundle)
  console.timeEnd('begin-data-cache')

  return filename
}
