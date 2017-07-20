/**
 * // Exmaple usage:
 *
 * var arc = require('@architect/functions')
 *
 * function handler(event, callback) {
 *   console.log(record)
 *   callback()
 * }
 *
 * exports.handler = arc.scheduled(handler)
 */
module.exports = function _scheduled(fn) {
  return function _lambdaSignature(evt, ctx, callback) {
    fn.call({}, Object.assign(event, context), callback)
  }
}
