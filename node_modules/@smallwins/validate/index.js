var nodash      = require('@smallwins/nodash')
var isObject    = nodash.isObject
var isString    = nodash.isString
var isNumber    = nodash.isNumber
var isArray     = Array.isArray
var isBoolean   = nodash.isBoolean
var isError     = nodash.isError
var isUndefined = nodash.isUndefined
var isFunction  = nodash.isFunction
var has         = nodash.has
var property    = nodash.property
var types       = require('./_types')
var invalidType = require('./_invalid-type')
//
// validate
//
// - requires params and a schema
// - returns either an array of errors or false
//
module.exports = function validate(params, schema, callback) {

  // spectactular fail for programmer error
  if (!isObject(params) || isFunction(params) || isArray(params)) {
    throw Error('validate(params, schema): params is not an Object')
  }

  // spectactular fail for programmer error
  if (!isObject(schema) || isFunction(schema) || isArray(params)) {
    throw Error('validate(params, schema): schema is not an Object')
  }

  // callback is optional
  if (!isUndefined(callback) && !isFunction(callback)) {
    throw Error('validate(params, schema, callback): callback is not a function')
  }

  // our best case scenario
  var errors = []

  // data structures
  var rangesafe = [String, Number, Array]

  // walk each property key
  Object.keys(schema).forEach(function(k) {

    // lets get the prop
    var prop = schema[k]

    // test for required properties
    if (prop.required && !has(params, k)) {
      errors.push(ReferenceError('missing required param ' + k))
    }

    // type checker! only validating a type if params has the key
    if (prop.type && has(params, k)) {
      var tmpSchema = {}
      tmpSchema[k] = prop.type
      var err = invalidType(k, params, tmpSchema)
      if (isError(err)) {
        errors.push(TypeError('invalid type ' + k + ' is an ' + err.message))
      }
    }

    // add custom type to rangesafe if min or max is expected
    var builtins = [Object, String, Number, Array, Boolean, Function]
    var index = builtins.indexOf(prop.type)
    var notfound = index === -1
    var value = property(k)(params)

    if (prop.type && notfound && (prop.type.min || prop.type.max)) {
      rangesafe.push(prop.type)
    }

    // min
    if (prop.min && has(params, k) && rangesafe.indexOf(prop.type) > -1) {
      // Number: check the value directly
      var isNumAndUnderMin = isNumber(value) && value < prop.min
      // String & Array: both respond to length!
      var lengthUnderMin = (isString(value) || isArray(value)) && value.length < prop.min
      // Custom min found on a valid custom type
      var isCustom = prop.type.min && !isError(prop.type(value)) && !prop.type.min(prop.min, value)
      // anything goes!
      if (isNumAndUnderMin || lengthUnderMin || isCustom) {
        var msg = ''
        msg += k + ' under min with value '
        msg += lengthUnderMin? value.length : value
        msg += ' (min is ' + prop.min + ')'
        errors.push(RangeError(msg))
      }
    }

    // max
    if (prop.max && has(params, k) && rangesafe.indexOf(prop.type) > -1) {
      // Number: check the value directly
      var isNumAndOverMax = isNumber(value) && value > prop.max
      // String & Array: both respond to length
      var lengthOverMax = (isString(value) || isArray(value)) && value.length > prop.max
      // Custom max found on a valid custom type
      var isCustom = prop.type.max && !isError(prop.type(value)) && !prop.type.max(prop.max, value)
      // anything goes
      if (isNumAndOverMax || lengthOverMax || isCustom) {
        var msg = ''
        msg += k + ' over max with value '
        msg += lengthOverMax? value.length : value
        msg += ' (max is ' + prop.max + ')'
        errors.push(RangeError(msg))
      }
    }
  })

  // share the love
  if (callback) {
    callback(errors.length? errors : null, errors.length? null : params)
  }

  // friendly return (empty arrays being truthy leads to fugly err first handling)
  return errors.length? errors : null
}
