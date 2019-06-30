let aws = require('aws-sdk')
let lookup = require('./lookup-queues')
let ledger = {}

module.exports = function live({name, payload, delaySeconds}, callback) {

  function publish(QueueUrl, payload, callback) {
    let sqs = new aws.SQS
    let DelaySeconds = delaySeconds || 0
    console.log('sqs.sendMessage', JSON.stringify({QueueUrl, DelaySeconds:0, payload}))
    sqs.sendMessage({
      QueueUrl,
      DelaySeconds,
      MessageBody: JSON.stringify(payload)
    }, callback)
  }

  let arn = ledger.hasOwnProperty(name)
  if (arn) {
    publish(ledger[name], payload, callback)
  }
  else {
    lookup(function done(err, found) {
      if (err) callback(err)
      else if (!found.hasOwnProperty(name)) {
        callback(ReferenceError(`${name} not found`))
      }
      else {
        ledger = found
        publish(ledger[name], payload, callback)
      }
    })
  }
}
