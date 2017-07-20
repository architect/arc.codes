// wip experimental extension to allow validation of N named schemas
// passes if any one schema works
/**
 * var validate = require('@smallwins/validate/one-of')
 *
 * function valid(params) {
 *   var schema = {
 *     rpc: {
 *       'query.x': {required:true, type:String}
 *     },
 *     www: {
 *       'query.y': {required:true, type:String}
 *     }
 *   } 
 *   return validate(params, schema)
 * }
 *
 */

var validate = require('./')

module.exports = function oneOf(params, schema, callback) {
  // schema is three levels
  // values are all objects
  // the final layer keys can only be one of required, type, min and max

  var schemas = Object.keys(schema)

  for (var i = 0; i < schemas.length; i++) {
    var tryna = validate(params, schemas[i])
    if (tryna) {
      // continue loop
    }
    else {
      // break loop
      failed = false
      break
    }
  }
  if (failed) {
  
  }
  else {
    
  }
}
