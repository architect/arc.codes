var nodash = require('@smallwins/nodash')
var isPlainObject = nodash.isPlainObject
var isObject = nodash.isObject
var isError = nodash.isError
var has = nodash.has
var invalidType = require('./_invalid-type')

function caps(str) {
  var working = (typeof str).slice('')
  var first = working[0].toUpperCase()
  var rest = working.slice(1, working.length)
  return `${first}${rest}`
}

function cleans(str) {
  var exp = /function (\w+)\(\) { \[native code\] }/
  if (exp.test(str)) {
    return str.toString().match(exp)[1]
  }
  else {
    return str
  }
}

module.exports = function assert(params, schema) {
  
  if (!isObject(params)) {
    throw TypeError('params not an object')
  }

  if (!isPlainObject(schema)) {
    throw TypeError('schema not a plain object')
  }

  // check for existance of things
  Object.keys(schema).forEach(key=> {
    if (!has(params, key)) {
      throw ReferenceError('missing required params.' + key)
    }
    // if we made it here the key exists
    // check its correctly typed or throw
    if (isError(invalidType(key, params, schema))) {
      var msg = ''
      msg += 'expected ' + cleans(schema[key]) + ' '
      msg += 'but received ' + caps(params[key]) + ' "'+ params[key] + '" '
      msg += 'for params.' + key
      throw TypeError(msg)
    }
  })
}
