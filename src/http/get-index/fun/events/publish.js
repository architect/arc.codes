let sandbox = require('./publish-sandbox')
let topic = require('./publish-topic')

/**
 * invoke an event lambda by sns topic name
 */
module.exports = function publish(params, callback) {

  if (!params.name)
    throw ReferenceError('missing params.name')

  if (!params.payload)
    throw ReferenceError('missing params.payload')

  let promise
  if (!callback) {
    promise = new Promise((resolve, reject) => {
      callback = function errback (err, result) {
        err ? reject(err) : resolve(result)
      }
    })
  }

  let isLocal = process.env.NODE_ENV === 'testing' || process.env.hasOwnProperty('ARC_LOCAL')
  let exec = isLocal ? sandbox : topic
  exec(params, callback)
  return promise
}
