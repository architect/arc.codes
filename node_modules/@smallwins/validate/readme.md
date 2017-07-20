[ ![Codeship Status for smallwins/validate](https://codeship.com/projects/e0e990b0-d826-0133-2fa3-6a1daaefbd5c/status?branch=master)](https://codeship.com/projects/143153)

#### :raised_hands::seedling: @smallwins/validate :ok_hand::bow:

Parameter validation for builtins and custom types. Accepts `params` and a `schema` and returns an array of `Error`s or `false`.

```javascript
var validate = require('@smallwins/validate')

function hi(params, callback) {
  var schema = {
    'name':       {required:true,  type:Object},
    'name.first': {required:true,  type:String},
    'name.last':  {required:false, type:String}
  }
  var errors = validate(params, schema) 
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, 'hi ' + params.first)
  }
}

// logs: null, hi brian
hi({name:{first:'brian', last:'leroux'}}, console.log)

// logs: [ [ReferenceError: missing required param name.first] ] 
hi({name:{}}, console.log)
```

#### :dizzy: considerations

- For testing an `Object` that presumably came from a JSON payload
- Thusly, primarily concerned with JSON value types: `Object`, `String`, `Number`, `Array` and `Boolean`
- Custom types are easily supported
- Extra custom types bundled: `Email`, `ISO`, `DateRange` and `UUID`
- Designed to test keys and nested keys
- Optionally validate `required`
- Optionally validate `min` and `max` for `String`, `Number` and `Array` builtin types (and easily implement for custom types / see `DateRange` for an example)

#### things it does not do :thumbsdown:

- Mutate things with: serialization, formatting or defaults
- Nested subtypes (eg. the things in an array)
- Localized error messages

#### :punch::two_hearts: further justifications

There are a tonne of libraries that do things like this but also do a whole lot more. This library deliberately limits its scope: 

- Make errback style param contract validation super clean and simple
- Work primarily with builtins but easily extend
- Provide a nice API for usage (hence returning a falsy `null` instead of a truthy empty array `[]` for the return value of `validate` and making the schema type validation minimalist without sacrificing capability.)

#### terse style example :point_left::eyes::point_left:

```javascript
var validate = require('@smallwins/validate')

function sum(params, callback) {
  // define our assumed params
  var errors = validate(params, {
    x: {required:true, type:Number},
    y: {required:true, type:Number}
  })
  // err first! it'll be null w/ good input
  callback(errors, errors? null : params.x + params.y)
}

sum({}, console.log)
// logs
// [[ReferenceError: missing required param x], [ReferenceError: missing required param y]] null

sum({x:1, y:2}, console.log)
// logs
// null 2
```

## :love_letter: api :thought_balloon::star2:

`validate(params, schema)`

- `params` a plain `Object` that we assume came from JSON
- `schema` a plain `Object` for describing the shape of the data
- `callback` (optional) Node style errback `function(err, params) {}`

#### :key: schema

- `required` either `true` or `false` (or leave it out completely)
- `type` can be one of `Object`, `String`, `Number`, `Array` and `Boolean`
- `min` any `Number` (or anything allowed by a custom type)
- `max` any `Number` (or anything allowed by a custom type)

#### :package: bundled custom types

- `UUID`
- `Email` 
- `ISO`
- `DateRange`

Example usage of custom types:

```javascript
var validate = require('@smallwins/validate')
var lambda = require('@smallwins/lambda')
// pull in the custom types
var UUID = require('@smallwins/validate/uuid')
var Email = require('@smallwins/validate/email')
var ISO = require('@smallwins/validate/iso')
var DateRange = require('@smallwins/validate/daterange')

// use the schema per builtins
function valid(event, callback) {
  var schema = {
    'params.id': {required:true, type:UUID},
    'body.email': {required:true, type:Email},
    'body.created': {required:true, type:ISO},
    'body.duration': {required:true, type:DateRange, min:'2016/01/01', max:'2017/01/01'}
  }
  validate(event, schema, callback)
}

function save(event, callback) {
  // performs save
  callback(null, event)
}

exports.handler = lambda(valid, save)
```

Check out the [examples](https://github.com/smallwins/validate-params-schema/tree/master/examples) for more on custom types and ranges (and the tests).
