var waterfall = require('../')
var test = require('tape')

test('functions run in series', function (t) {
  t.plan(4)

  var tasks = [
    function (cb) {
      t.pass('cb 1')
      cb(null)
    },
    function (cb) {
      t.pass('cb 2')
      cb(null)
    },
    function (cb) {
      t.pass('cb 3')
      cb(null)
    }
  ]

  waterfall(tasks, function (err) {
    t.error(err)
  })
})

test('waterfall: functions pass results to next function', function (t) {
  t.plan(8)

  var tasks = [
    function (cb) {
      t.pass('cb 1')
      cb(null, 1)
    },
    function (result, cb) {
      t.equal(result, 1)
      cb(null, 2, 3, 4)
    },
    function (result1, result2, result3, cb) {
      t.equal(result1, 2)
      t.equal(result2, 3)
      t.equal(result3, 4)
      cb(null, 99, 100)
    }
  ]

  waterfall(tasks, function (err, result1, result2) {
    t.error(err)
    t.equal(result1, 99)
    t.equal(result2, 100)
  })
})
