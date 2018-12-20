var test = require('tape')
var tiny = require('tiny-json-http')
var http = require('@architect/architect').sandbox.start
var close

test('http.start', t => {
  t.plan(2)
  t.ok(http, 'exists')
  http(function(err, finna) {
    if (err) {
      t.fail(err)
    } else {
      close = finna
      t.ok(true, 'started')
    }
  })
})

test('/', t => {
  t.plan(1)
  tiny.get(
    {
      url: 'http://localhost:3333'
    },
    function _get(err, data) {
      if (err) {
        t.fail(err)
      } else {
        t.ok(data, 'got response')
        console.log(data.body.substring(0, 60), '... (truncated)')
      }
    }
  )
})

test('http.close', t => {
  t.plan(1)
  close()
  t.ok(true, 'closed')
})
