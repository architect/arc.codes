[ ![Codeship Status for smallwins/lambda](https://codeship.com/projects/2e4082e0-d808-0133-2035-1eae90b9310e/status?branch=master)](https://codeship.com/projects/143109)

---

## @smallwins/lambda :seedling::raised_hands:λ  

- Author your AWS Lambda functions as pure node style callbacks (aka errbacks)
- Familiar middleware pattern for composition
- Event sources like DynamoDB triggers and SNS topics too
- Helpful npm scripts `lambda-create`, `lambda-list`, `lambda-deploy` and `lambda-invoke` (and more)

#### :satellite::satellite::satellite: λ returning json results :mailbox:

Here is a vanilla AWS Lambda example for performing a sum. Given `event.query.x = 1` it will return `{count:2}`.

```javascript
exports.handler = function sum(event, context) {
  var errors = []
  if (typeof event.query === 'undefined') {
    errors.push(ReferenceError('missing event.query'))
  }
  if (event.query && typeof event.query != 'object') {
    errors.push(TypeError('event.query not an object'))
  }
  if (typeof event.query.x === 'undefined') {
    errors.push(ReferenceError('event.query not an object'))
  }
  if (event.query.x && typeof event.query.x != 'number') {
    errors.push(TypeError('event.query not an object'))
  }
  if (errors.length) {
    // otherwise Error would return [{}, {}, {}, {}]
    var err = errors.map(function(e) {return e.message})
    context.fail(err) 
  }
  else {
    context.succeed({count:event.query.x + 1})
  }
}
```

A huge amount of vanilla AWS Lambda code is working around quirky parameter validation. API Gateway gives you control over the parameters you can expect but this still means one or more of: headers, querystring, form body, or url parameters. Event source style lambdas are not much better because you can often still get differing payloads from different origin sources. In the example above we are validating *one* querystring parameter `x`. Imagine a big payload! 😮

Worse still, writing a good program we want to use JavaScript's builtin `Error` but it still needs manual serialization (and you still lose the stack trace). The latter part of this vanilla code uses the funky AWS `context` object.

We can do better:

```javascript
var validate = require('@smallwins/validate')
var lambda = require('@smallwins/lambda')

function sum(event, callback) {
  var schema = {
    'query':   {required:true, type:Object},
    'query.x': {required:true, type:Number}
  }
  var errors = validate(event, schema)
  if (errors) {
    callback(errors)
  }
  else {
    var result = {count:event.query.x + 1}
    callback(null, result)
  }
}

exports.handler = lambda(sum)
```

`@smallwins/validate` cleans up parameter validation. The callback style above enjoys symmetry with the rest of Node and will automatically serialize `Error`s into JSON friendly objects including any stack trace. All you need to do is wrap a your node style function in `lambda` which returns your function with an AWS Lambda friendly signature.

#### :loop::loop::loop: easily chain dependant actions ala middleware :loop::loop::loop:

Building on this foundation we can compose multiple functions into a single Lambda. It is very common to want to run functions in series. Lets compose a Lambda that: 

- Validates parameters
- Checks for an authorized account
- And then returns data safely
- Or if anything fails return JSON serialized `Error` array

```javascript
var validate = require('@smallwins/validate')
var lambda = require('@smallwins/lambda')

function valid(event, callback) {
  var schema = {
    'body':          {required:true, type:Object},
    'body.username': {required:true, type:String},
    'body.password': {required:true, type:String}
  }
  validate(event, schema, callback)
}

function authorized(event, callback) {
  var loggedIn = event.body.username === 'sutro' && event.body.password === 'cat'
  if (!loggedIn) {
    // err first
    callback(Error('not found'))
  }
  else {
    // successful login
    event.account = {
      loggedIn: loggedIn,
      name: 'sutro furry pants'
    }
    callback(null, event)
  }
}

function safe(event, callback) {
  callback(null, {account:event.account})
}

exports.handler = lambda(valid, authorized, safe)
```

In the example above our functions are executed in series passing event through each invocation. `valid` will pass event to `authorized` which in turn passes it to `save`. Any `Error` returns immediately so if we make it the last function we just send back the resulting account data. Clean!

#### :floppy_disk: save a record from a dynamodb trigger :boom::gun:

AWS DynamoDB triggers invoke a Lambda function if anything happens to a table. The payload is usually a big array of records. `@smallwins/lambda` allows you to focus on processing a single record but executes the function in parallel on all the results in the Dynamo invocation.

```javascript
var lambda = require('@smallwins/lambda')

function save(record, callback) {
  console.log('save a version ', record)
  callback(null, record)
}

exports.handler = lambda.triggers.dynamo.save(save)
```

#### :bookmark: respond to a message published on sns

Its very common to compose your application events using AWS SNS. `@smallwins/lambda` runs in parallel over the records in the trigger, similar to the Dynamo.

```javascript
// somewhere in your codebase you'll want to trigger a lambda
var aws = require('aws-sdk')
var sns = new aws.SNS

sns.publish({
  Message: JSON.stringify({hello:'world'}),
  TopicArn: 'arn:aws:sns:us-east-1'
}, console.log)
```

```javascript
// then, in your lambda
var lambda = require('@smallwins/lambda')

function msg(message, callback) {
  console.log('received msg ', message) // logs {hello:"world"}
  callback(null, message)
}

exports.handler = lambda.triggers.sns(msg)
```

## :love_letter: api :thought_balloon::sparkles:

- `lambda(...fns)` create a Lambda that returns a serialized json result `{ok:true|false}`
- `lambda([fns], callback)` create a Lambda and handle result with your own errback formatter
- `lambda.local(fn, fakeEvent, (err, result)=>)` run a Lambda locally offline by faking the event obj
- `lambda.triggers.dynamo.insert(fn)` run on INSERT only
- `lambda.triggers.dynamo.modify(fn)` run on MODIFY only
- `lambda.triggers.dynamo.remove(fn)` run on REMOVE only
- `lambda.triggers.dynamo.all(fn)` run on INSERT, MODIFY and REMOVE
- `lambda.triggers.dynamo.save(fn)` run on INSERT and MODIFY
- `lambda.triggers.dynamo.change(fn)` run on INSERT and REMOVE
- `lambda.triggers.sns(fn)` run for every sns trigger invocation; expects `record.Sns.Message` to be a serialized JSON payload

A handler looks something like this:

```javascript    
function handler(event, callback) {
  // process event, use to pass data
  var result = {ok:true, event:event}
  callback(null, result)
}
```

#### :heavy_exclamation_mark: regarding errors :x::interrobang:

Good error handling makes programs easier to maintain. [This is a great guide digging in more.](https://www.joyent.com/developers/node/design/errors) When using `@smallwins/lambda` always use `Error` type as the first parameter to the callback: 

```javascript
function fails(event, callback) {
  callback(Error('something went wrong')
}
```

Or an `Error` array:

```javascript
function fails(event, callback) {
  callback([
    Error('missing email'), 
    Error('missing password')
  ])
}
```

`@smallwins/lambda` serializes errors into Slack RPC style JSON. Easier to work with from API Gateway:

```javascript
{
  ok: false, 
  errors: [
    {name:'Error', message:'missing email', stack'...'},
    {name:'Error', message:'missing password', stack'...'}
  ]
}
```

#### <kbd>#! automatations</kbd> :memo:

`@smallwins/lambda` includes some helpful automation code perfect for npm scripts. If you have a project that looks like this:

```
project-of-lambdas/
 |-test/
 |-src/
 |  '-lambdas/
 |     |-signup/
 |     |  |-index.js
 |     |  |-test.js
 |     |  '-package.json <--- name property should equal the deployed lambda name
 |     |-login/
 |     '-logout/
 '-package.json

```

And a `package.json` like this:

```javascript
{
  "name":"project-of-lambdas",
  "scripts": {
    "create":"AWS_PROFILE=smallwins lambda-create",
    "list":"AWS_PROFILE=smallwins lambda-list",
    "deploy":"AWS_PROFILE=smallwins lambda-deploy",
    "invoke":"AWS_PROFILE=smallwins lambda-invoke",
    "local":"AWS_PROFILE=smallwins lambda-local",
    "deps":"AWS_PROFILE=smallwins lambda-deps",
    "log":"AWS_PROFILE=smallwins lambda-log"
  }
}
```

You get:

#### :fast_forward: npm run scripts :running::dash:

This is :key:! Staying in the flow with your terminal by reducing hunts for information in the AWS Console. :shipit::chart_with_upwards_trend:

- :point_right: <kbd>npm run <b>create</b> src/lambdas/forgot</kbd> creates a new lambda named `forgot` at `src/lambdas/forgot` 
- :point_right: <kbd>npm run <b>list</b></kbd> lists all deployed lambdas and all their alias@versions
- :point_right: <kbd>npm run <b>deploy</b> src/lambdas/signup brian</kbd> deploys the lambda with the alias `brian`
- :point_right: <kbd>npm run <b>invoke</b> src/lambdas/login brian '{"email":"b@brian.io", "pswd":"..."}'</kbd> to remote invoke a deployed lambda
- :point_right: <kbd>npm run <b>local</b> src/lambdas/login brian '{"email":"b@brian.io", "pswd":"..."}'</kbd> to locally invoke a lambda
- :point_right: <kbd>npm run <b>deps</b> src/lambdas/*</kbd> for a report of all your lambda deps
- :point_right: <kbd>npm run <b>log</b> src/lambdas/logout</kbd> to view the cloudwatch invocation logs for that lambda (remote `console.log` statements show up here)

_Note: these scripts assume each lambda has it's own nested `package.json` file with a `name` property that matches the lambda name._

### testing :white_check_mark: 

You can invoke a Lambda locally with a mock payload using `lambda.local`. Say you have this lambda function:

```javascript
// always-ok.js
var lambda = require('@smallwins/lambda')

function fakeFn(event, callback) {
  callback(null, Object.assign({hello:'world'}, event))
}

exports.handler = lambda(fakeFn)
```

You can imagine the test:

```javascript
// always-test.js
var fn = require('./always-ok').handler

lambda.local(fn, {fake:'payload'}, console.log)
// logs {hello:'world', fake:'payload', ok:true}
```

`./scripts/invoke.js` is also a module and can be useful for testing. It will remotely invoke your lambda.

```javascript
var invoke = require('@smallwins/lambda/scripts/invoke')

invoke('path/to/lambda', alias, payload, (err, response)=> {
  console.log(err, response)
})
```

