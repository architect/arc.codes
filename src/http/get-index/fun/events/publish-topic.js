let aws = require('aws-sdk')
let lookup = require('./lookup-topics')
let ledger = {}

module.exports = function live({name, payload}, callback) {

  function publish(arn, payload, callback) {
    console.log('sns.publish', JSON.stringify({arn, payload}))
    let sns = new aws.SNS
    sns.publish({
      TopicArn: arn,
      Message: JSON.stringify(payload)
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
