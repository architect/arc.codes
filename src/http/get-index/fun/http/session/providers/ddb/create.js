var uid = require('uid-safe')
var week = require('./_week-from-now')
var db = require('./_get-dynamo-doc-instance')
var crsf = require('csrf')
var parallel = require('run-parallel')

module.exports = function _create(name, payload, callback) {
  parallel([
    function _key(callback) {
      uid(18, function _uid(err, val) {
        if (err) callback(err)
        else callback(null, {_idx: val})
      })
    },
    function _secret(callback) {
      (new crsf).secret(function _uid(err, val) {
        if (err) callback(err)
        else callback(null, {_secret: val})
      })
    }
  ],
  function _put(err, results) {
    if (err) throw err
    results.push({_ttl: week()})
    var keys = results.reduce((a, b)=> Object.assign(a, b))
    var session = Object.assign(payload, keys)
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
