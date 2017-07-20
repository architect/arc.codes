var test = require('tape')
var dynalite = require('dynalite')
var session = require('../src/http/session')
var arc = require('../')

test('env', t=> {
  t.plan(1)
  t.ok(arc, 'gotta arc')
})

test('arc only accepts functions', t=> {
  t.plan(1)
  try {
    var handler = arc({})
  }
  catch(e) {
    t.ok(e, 'failed as expected')
    console.log(e)
  }
})

var server
test('can startup dynalite server', t=> {
  t.plan(1)
  server = dynalite({createTableMs:0}).listen(5000, err=> {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(true, 'Dynalite started on port 5000')
    }
  })
})

test('can init', t=> {
  t.plan(1)
  session.init('arc-sessions', function _init(err) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(true, 'initialized')
    }
  })
})

test('arc accepts middleware function and responds with html', t=> {
  t.plan(4)
  // sestup some mock middleware
  var firstCalled = false
  var secondCalled = false
  var thirdCalled = false

  function first(req, res, next) {
    console.log('request', req)
    firstCalled = true
    next()
  }

  function second(req, res, next) {
    secondCalled = true 
    next()
  }

  function third(req, res, next) {
    thirdCalled = true
    res({
      html: `<b>hello world</b>`
    })
  }

  // create a lambda handler
  var handler = arc.html.get(first, second, third)

  // execute the hander w mock data
  var request = {headers: {}, method:'get'}
  var context = {}
  handler(request, context, function errback(err, response) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(response, 'gotta result')
      t.ok(firstCalled, 'first called')
      t.ok(secondCalled, 'second called')
      t.ok(thirdCalled, 'third called')
      console.log('response', response)
    }
  })
})

test('arc responds with location', t=> {
  t.plan(2)

  // create a lambda handler
  var locCalled = false
  var handler = arc.html.get(function loc(req, res, next) {
    locCalled = true
    res({
      location: `/elsewhere`
    })
  })

  // execute the hander w mock data
  var request = {headers: {}, method:'get'}
  var context = {}
  handler(request, context, function errback(err, response) {
    if (err) {
      t.ok(err, err)
      t.ok(locCalled, 'loc called')
    }
    else {
      t.fail('loc must use errors')
    }
    console.log('response', response)
  })
})

var _idx
test('arc can save some data in a session', t=> {
  t.plan(2)

  // create a lambda handler
  var locCalled = false
  var handler = arc.html.get(function loc(req, res, next) {
    locCalled = true
    res({
      html: `<b>hi</b>`,
      session: {
        msg: 'hello world'
      }
    })
  })

  // execute the hander w mock data
  var request = {headers:{}, method:'get'}
  var context = {}
  handler(request, context, function errback(err, response) {
    if (err) {
      t.fail(err)
      console.log(err)
    }
    else {
      t.ok(response, 'gotta result')
      t.ok(locCalled, 'loc called')
      console.log('response', response)
      _idx = response.session._idx
    }
  })
})

test('arc session can be retrieved', t=> {
  t.plan(3)

  // create a lambda handler
  var locCalled = false
  var handler = arc.html.get(function loc(req, res, next) {
    console.log(req)
    locCalled = true
    t.ok(request.session.msg === 'hello world', 'session found')
    res({
      html: `sutr0 says hello`
    })
  })

  // execute the hander w mock data
  var request = {method:'get', headers: {Cookie:'_idx=' + _idx}}
  var context = {}
  handler(request, context, function errback(err, response) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(response, 'gotta result')
      t.ok(locCalled, 'loc called')
      console.log('response', response)
    }
  })
})

test('can shutdown', t=> {
  t.plan(1)
  server.close()
  t.ok(true, 'server closed')
})
