var parallel = require('run-parallel')
/**
 * var lambda = require('@smallwins/lambda')
 *
 * function msg(record, callback) {
 *   console.log(record)
 *   callback(null, record) // errback style; results passed to context.succeed
 * }
 *
 * module.exports = lambda.trigger.sns(msg)
 */
module.exports = function _sns(fn) {
  return function __lambdaSignature(evt, ctx) {
    // sns triggers send batches of records 
    // so we're going to create a handler for each one
    // and execute them in parallel
    parallel(evt.Records.map(function _iterator(record) {
      // for each record we construct a handler function
      return function __actualHandler(callback) {   
        try {
          fn(JSON.parse(record.Sns.Message), callback)
        }
        catch(e) {
          callback(e)  
        }
      }
    }), 
    function __processedRecords(err, results) {
      if (err) {
        ctx.fail(err)
      }
      else {
        ctx.succeed(results)
      }
    })
  }
}
