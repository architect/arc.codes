var session = require('../src/http/session')
var test = require('tape')
var dynalite = require('dynalite')
var server, sesh
var name = 'test-sessions'

test('can startup dynalite server', t=> {
  t.plan(2)
  server = dynalite({createTableMs:0}).listen(5000, err=> {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(true, 'Dynalite started on port 5000')
      t.ok(session, 'exists in scope')
    }
  })
})

test('can init', t=> {
  t.plan(1)
  session.init('test-sessions', function _init(err) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(true, 'initialized')
    }
  })
})

test('can get a session client', t=> {
  t.plan(1)
  session = session.client(name)
  t.ok(session, 'got a session client')
})

test('can create', t=> {
  t.plan(1)
  session.create({foo:1}, function _create(err, data) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data, 'created')
      sesh = data
      console.log(data)
    }
  })
})

test('can find', t=> {
  t.plan(1)
  session.find(sesh._idx, function _find(err, data) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data, 'found')
      console.log(data)
    }
  })
})

test('can update', t=> {
  t.plan(1)
  sesh.b = 2
  session.update(sesh, function _update(err, data) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data, 'updated')
      sesh = data
      console.log(data)
    }
  })
})


test('can shutdown', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'server closed')
})
