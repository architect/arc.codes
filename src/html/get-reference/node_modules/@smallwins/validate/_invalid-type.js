var property = require('@smallwins/nodash').property
var types = require('./_types')

module.exports = function _invalidType(key, params, schema) {
  var aliases  = 'obj str num arr bool fun'.split(' ')
  var builtins = [Object, String, Number, Array, Boolean, Function]
  var index    = builtins.indexOf(schema[key])
  var notfound = index === -1
  var checker  = notfound? schema[key] : types[aliases[index]]
  var value    = property(key)(params)
  var err      = checker(value)
  // finally check the type
  return err
}

