# @events example

```arc
# .arc
@app
testapp

@events
hello

@html
get /
post /msg

@tables
counter
  counterID *String
```

```javascript
// ./src/events/hello
var arc = require('@smallwins/arc-prototype')
var data = require('@yourcompany/testapp-data')

function hello(payload, callback) {
  data.increment(callback)
}

exports.handler = arc.events.subscribe(hello)
```

```javascript
// ./src/html/get-index
var arc = require('@smallwins/arc-prototype')
var data = require('@yourcompany/testapp-data')

function form(count) {
  return `
  <h1>${count} said hello!</h1>
  <form action=/msg>
    <button>Say hi</button>
  </form>
  `
}

function index(req, res) {
  data.read(function _read(err, result) {
    if (err) {
      res({
        statusCode: 500,
        html: err
      })
    }
    else {
      res({
        html: form(result.count)
      })
    }
  })
}

exports.handler = arc.html.get(index)
```

```javascript
// ./src/html/post-msg
var arc = require('@smallwins/arc-prototype')

function msg(req, res) {
  arc.events.publish({
    name: 'hello',
    payload: req
  }, 
  function _publish() {
    res({
      location: '/'
    })
  })
}

exports.handler = arc.html.post(msg)
```
