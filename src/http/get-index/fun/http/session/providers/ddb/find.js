var db = require('./_get-dynamo-doc-instance')
var create = require('./create')

module.exports = function _find(name, _idx, callback) {
  db.get({
    TableName: name,
    ConsistentRead: true,
    Key: {_idx}
  },
  function _get(err, data) {
    if (err) {
      callback(err)
    }
    else {
      var result = typeof data === 'undefined'? false : data.Item
      if (result && result.hasOwnProperty('_secret')) {
        callback(null, result)
      }
      else {
        create(name, {}, callback)
      }
    }
  })
}
