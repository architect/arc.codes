var fs = require('fs')
var path = require('path')
var test = require('tape')
var waterfall = require('run-waterfall')
var parse = require('@architect/parser')
var events = require('../src/events')
var mockSnsEvent = require('./mock-sns-event.json')

test('env', t=> {
  t.plan(2)
  t.ok(events, 'gotta events')
  t.ok(events.subscribe, 'events.subscribe')
})

test('events.subscribe', t=> {
  t.plan(1)
  
  // create a var to see if we successfully invoked
  var eventHandlerCalled = false

  // create a mock event handler
  function eventHandler(payload, callback) {
    console.log({payload})
    eventHandlerCalled = true
    callback()
  }

  // get a lambda signature from the handler
  var handler = events.subscribe(eventHandler)

  // invoke the lambda handler with mock payloads
  var mockContext = {}
  handler(mockSnsEvent, mockContext, function _handler(err, result) {
    if (err) {
      t.fail(err) 
    }
    else {
      t.ok(eventHandlerCalled, 'successfully called') 
    }
  })
})

/*
test.only('events.generate.exec', t=> {
  t.plan(1)
  var arcPath = path.join(__dirname, 'mock-arc')
  var mockArc = fs.readFileSync(arcPath).toString()
  var parsed = parse(mockArc)
  waterfall([
    function _plan(callback) {
      console.log('call to plan')
      events.generate.plan(parsed, callback)
    },
    function _exec(plan, callback) {
      console.log('call to exe')
      events.generate.exec(plan, callback)
    }
  ],
  function _done(err, result) {
    if (err) {
      t.fail(err)
      console.log(err)
    }
    else {
      t.ok(result, 'got result')
      console.log(result)
    }
  })
})
*/
/*
test('events.publish', t=> {
  t.plan(1)
  events.publish('test-event', function _publish(err, result) {
    if (err) {
      t.fail(err)
      console.log(err)
    }
    else {
      t.ok(result, 'gotta result')
      console.log(result)
    }
  })
})

test('manually cleanup', t=> {
  t.plan(1)
})*/
