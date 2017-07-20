var nodash     = require('@smallwins/nodash')
var isObject   = nodash.isObject
var isString   = nodash.isString
var isNumber   = nodash.isNumber
var isArray    = Array.isArray
var isBoolean  = nodash.isBoolean
var isFunction = nodash.isFunction

// built in types (thus all of JSON!)
module.exports = {

  obj: function obj(v) {
    return isObject(v)? true : TypeError('not an Object')
  },

  str: function str(v) {
    return isString(v)? true : TypeError('not a String')
  },

  num: function num(v) {
    return isNumber(v)? true : TypeError('not a Number')
  },

  arr: function arr(v) {
    return isArray(v)? true : TypeError('not an Array')
  },

  bool: function bool(v) {
    return isBoolean(v)? true : TypeError('not a Boolean')
  },

  fun: function bool(v) {
    return isFunction(v)? true : TypeError('not a Function')
  }
}

