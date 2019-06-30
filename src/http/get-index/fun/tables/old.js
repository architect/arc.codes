var parallel = require('run-parallel')
/**
 * var trigger = require('aws-dynamodb-lambda-trigger/lambda')
 *
 * function onInsert(record, callback) {
 *   console.log(record)
 *   callback(null, record) // errback style; results passed to context.succeed
 * }
 *
 * module.exports = trigger.insert(onInsert)
 */

function __trigger(types, handler) {
  return function __lambdaSignature(evt, ctx) {
    // dynamo triggers send batches of records so we're going to create a handler for each one
    var handlers = evt.Records.map(function(record) {
      // for each record we construct a handler function
      return function __actualHandler(callback) {
        // if isInvoking we invoke the handler with the record
        var isInvoking = types.indexOf(record.eventName) > -1
        if (isInvoking) {
          handler(record, callback)
        }
        else {
          callback() // if not we just call the continuation (callback)
        }
      }
    })
    // executes the handlers in parallel
    parallel(handlers, function __processedRecords(err, results) {
      if (err) {
        ctx.fail(err)
      }
      else {
        ctx.succeed(results)
      }
    })
  }
}

module.exports = {
  insert: __trigger.bind({}, ['INSERT']),
  modify: __trigger.bind({}, ['MODIFY']),
  update: __trigger.bind({}, ['MODIFY']),
  remove: __trigger.bind({}, ['REMOVE']),
 destroy: __trigger.bind({}, ['REMOVE']),
     all: __trigger.bind({}, ['INSERT', 'MODIFY', 'REMOVE']),
    save: __trigger.bind({}, ['INSERT', 'MODIFY']),
  change: __trigger.bind({}, ['INSERT', 'REMOVE'])
}
