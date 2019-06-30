let sandbox = require('./publish-sandbox')
let queue = require('./publish-queue')

/**
 * invoke a queue lambda by sqs queue name
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
  let exec = isLocal ? sandbox : queue
  exec(params, callback)
  return promise
}
