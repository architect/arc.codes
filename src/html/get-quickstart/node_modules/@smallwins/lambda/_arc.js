var errback = require('serialize-error')
var lambda = require('./_lambda')

// 
// no errors ever just serialize everything to a {json} payload
// for api gateway endpoints generated w arc-create
//
// usage:
//   
//   exports.handler = lambda.arc.json(valid, registered)
//
module.exports = function _arcJSON() {
  var fns = [].slice.call(arguments)
  return lambda(fns, function _fmt(err, json, context) {
    if (err) {
      json = {
        errors: (Array.isArray(err)? err : [err]).map(errback)
      }
    }
    context.succeed({json})
  })
}

