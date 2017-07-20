var _create = require('./_create')
var _find = require('./_find')
var _update = require('./_update')

module.exports = function client(name) {
  var create = _create.bind({}, name)
  var find = _find.bind({}, name)
  var update = _update.bind({}, name)
  return {
    create,
    find,
    update
  }
}
