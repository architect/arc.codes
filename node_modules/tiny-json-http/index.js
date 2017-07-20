var _read = require('./_read')
var _write = require('./_write')

module.exports = {
  get: _read,
  post: _write.bind({}, 'POST'),
  put: _write.bind({}, 'PUT'),
  del: _write.bind({}, 'DELETE'),
}
