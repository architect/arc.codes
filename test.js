var test = require('tape')
var tiny = require('tiny-json-http')
var http = require('@architect/workflows/src/sandbox/http')
var server

test('http.start', t=> {
  t.plan(2)
  t.ok(http, 'exists')
  server = http.start(function() {
    t.ok(true, 'started')
  })
})

test('/', t=> {
  t.plan(1)
  tiny.get({
    url: 'http://localhost:3333/'
  },
  function _get(err, data) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data, 'got response')
      console.log(data.body)
    }
  })
})

test('http.close', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'closed')
})
