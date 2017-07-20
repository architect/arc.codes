var waterfall = require('../')
var test = require('tape')

test('empty tasks array', function (t) {
  t.plan(1)

  waterfall([], function (err) {
    t.error(err)
  })
})

test('empty tasks array and no callback', function (t) {
  waterfall([])
  t.pass('did not throw')
  t.end()
})
