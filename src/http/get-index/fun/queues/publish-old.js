let http = require('http')
let waterfall = require('run-waterfall')
let aws = require('aws-sdk')

/**
 * invoke an sqs lambda by name
 *
 * usage
 *
 *   let arc = require('@architect/functions')
 *
 *   arc.queues.publish({
 *     name: 'queue-name-here',
 *     payload: {hello: 'world'},
 *   }, console.log)
 *
 */
module.exports = function _publish(params, callback) {

  // ensure required input
  if (!params.name)
    throw ReferenceError('missing params.name')
  if (!params.payload)
    throw ReferenceError('missing params.payload')

  // queue name normalized with appname and env
  let name = `${process.env.ARC_APP_NAME}-${process.env.NODE_ENV}-${params.name}`
  let payload = params.payload

  let promise
  if (!callback) {
    promise = new Promise((resolve, reject) => {
      callback = function errback (err, result) {
        err ? reject(err) : resolve(result)
      }
    })
  }

  // check if we're running locally
  let local = process.env.NODE_ENV === 'testing' || process.env.hasOwnProperty('ARC_LOCAL')
  if (local) {

    // if so send the mock request
    let req = http.request({
      method: 'POST',
      port: 3334,
      path: '/queues',
    })
    req.write(JSON.stringify(params))
    req.end()
    callback()
  }
  else {
    // otherwise attempt to sqs.sendMessage
    let sqs = new aws.SQS
    waterfall([
      function reads(callback) {
        sqs.getQueueUrl({
          QueueName: name,
        }, callback)
      },
      function  publishes(result, callback) {
        let QueueUrl = result.QueueUrl
        let DelaySeconds = params.delaySeconds || 0
        console.log('sqs.sendMessage', JSON.stringify({ QueueUrl, DelaySeconds, payload }))
        sqs.sendMessage({
          QueueUrl,
          DelaySeconds,
          MessageBody: JSON.stringify(payload)
        }, callback)
      }
    ],
    function _published(err, result) {
      if (err) throw err
      callback(null, result)
    })
  }
  return promise
}
