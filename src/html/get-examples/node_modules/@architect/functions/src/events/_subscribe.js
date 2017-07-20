var parallel = require('run-parallel')
/**
 * // Exmaple usage:
 *
 * var arc = require('@architect/functions')
 *
 * function signup(record, callback) {
 *   console.log(record)
 *   callback()
 * }
 *
 * exports.handler = arc.events.subscribe(signup)
 */
module.exports = function _subscribe(fn) {
  return function _lambdaSignature(evt, ctx, callback) {
    // sns triggers send batches of records
    // so we're going to create a handler for each one
    // and execute them in parallel
    parallel(evt.Records.map(function _iterator(record) {
      // for each record we construct a handler function
      return function _actualHandler(callback) {
        try {
          fn(JSON.parse(record.Sns.Message), callback)
        }
        catch(e) {
          callback(e)
        }
      }
    }), callback)
  }
}
