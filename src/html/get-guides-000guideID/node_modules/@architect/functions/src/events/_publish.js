var assert = require('@smallwins/validate/assert')
var aws = require('aws-sdk')
var sns = new aws.SNS
var ledger = {}

// priv publish
// blindly publishes to sns topic json stringified record
// throws if fails so lambda errors are noticible
function __publish(arn, payload, callback) {
  console.log('Publishing SNS', JSON.stringify({arn, payload}))
  sns.publish({
    TopicArn: arn,
    Message: JSON.stringify(payload)
  },
  function _published(err, result) {
    if (err) throw err
    callback(null, result)
  })
}

/**
 * invoke an event lambda by name
 *
 * usage
 *
 *   var arc = require('@smallwins/arc-prototype')
 *
 *   arc.events.publish({
 *     name: 'eventname',
 *     payload: {hello: 'world'},
 *   }, console.log)
 *
 * this will invoke appname-staging-eventname (or appname-production-eventname)
 *
 * you can invoke events for other arc apps in the same region by overriding appname with app param like so:
 *
 *   arc.events.publish({
 *     app: 'otherappname',
 *     name: 'eventname',
 *     payload: {hello: 'world2'},
 *   }, console.log)
 */
module.exports = function _publish(params, callback) {
  assert(params, {
    name: String,
    payload: Object
  })

  var {name, payload} = params
  var arn = ledger.hasOwnProperty(name)

  if (arn) {
    __publish(ledger[name], payload, callback)
  }
  else {
    var override = params.hasOwnProperty('app')
    var eventName = `${override? params.app : process.env.ARC_APP_NAME}-${process.env.NODE_ENV}-${name}`
    // lookup the event sns topic arn
    sns.listTopics({}, function _listTopics(err, results) {
      if (err) throw err
      var found = results.Topics.find(t=> {
        var bits =  t.TopicArn.split(':')
        var it = bits[bits.length - 1]
        return it === eventName
      })
      if (found) {
        // cache the arn here
        ledger[name] = found.TopicArn
        // and continue
        __publish(ledger[name], payload, callback)
      }
      else {
        throw Error(`topic ${eventName} not found`) // fail loudly if we can't find it
      }
    })
  }
}
