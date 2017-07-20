var uid = require('uid-safe')
var week = require('./_week-from-now')
var db = require('./_get-dynamo-doc-instance')

module.exports = function _create(name, payload, callback) {
  uid(18, function _uid(err, _idx) {
    if (err) throw err
    var _ttl = week()
    var session = Object.assign(payload, {_idx, _ttl})
    db.put({
      TableName: name,
      Item: session
    },
    function _create(err) {
      if (err) {
        callback(err)
      }
      else {
        callback(null, session)
      }
    })
  })
}
