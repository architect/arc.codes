# tiny-json-http

Minimalist `HTTP` client for `GET` and `POST`ing `JSON` payloads

- Zero dependencies: perfect for AWS Lambda or Browserify
- Sensible default: assumes buffered JSON responses
- System symmetry: Node style errback API

```bash
npm i tiny-json-http --save
```

### api

- `tiny.get(options, callback)`
- `tiny.post(options, callback)`
- `tiny.put(options, callback)`
- `tiny.del(options, callback)`

### options

- `url` *required*
- `data` form vars for `tiny.post`, `tiny.put`, and `tiny.delete` otherwise querystring vars for `tiny.get`
- `headers` key/value map used for headers

### callback values

- `err` a real javascript `Error` if there was one
- `data` an object with `headers` and `body` keys

## example

```javascript
var tiny = require('tiny-json-http')
var url = 'http://www.randomkittengenerator.com'

tiny.get({url}, function __got(err, result) {
  if (err) {
    console.log('ruh roh!', err)
  }
  else {
    console.log(result)
  }
})
```

Check out the tests for more examples! :heart_decoration:
