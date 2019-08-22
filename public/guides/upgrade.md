# Upgrade Guide

> Guides for upgrading to the latest version of Architect

## 6.x

New:
- This version of Architect is CloudFormation based! This allows Architect apps to use anything in the AWS ecosystem and allows users to extend the `.arc` format.
- Global `arc` CLI tool (or just use `npx arc` locally)
- Ruby and Python fully supported (including local `sandbox`)
- Workflows start local (`arc init && arc sandbox`) and `arc deploy` is opt in
- Runtime helpers:
  - `@architect/functions` for Node refactored and tightened up
  - `architect-functions` for Ruby
  - `architect-functions` for Python

Removed:
- Runtime deps are now completely removed by default and are now opt in
- `npx create` removed (all you have to do now is `deploy`!)
- `npx audit` removed (the IAM role is dynamically generated scoped to the app)
- `npx config` removed (`.arc-config` settings are now serialized every deploy)
- `npx inventory` removed (just use CloudFormation console)
- `npx dns` removed (but we plan to revisit)

Deprecated:
 - `arc.http.helpers.static()` is now just `arc.static()`

Breaking:
- DynamoDB triggers are now defined with `stream true`
- `arc.proxy` and `arc.middleware` are now `arc.http.proxy` and `arc.http.middleware`
- `architect/data` is now deprecated in favor of `@architect/functions` (using `arc.tables`)

## 5.x 

Architect version 5 is here!

Things we added:

- [Websocket support](/guides/ws)
- [New middleware](/guides/middleware) - added later in arc 4, and out of the box in Arc 5

## 4.x

Architect version 4 (Yeti) is here!

Things we added:

- `/public` for static assets
- `@http` routes 
- complete docs overhaul
- new simpler install package `npm i @architect/architect`
- one repo [architect/architect](https://github.com/architect/architect)
- `@architect/functions` new APIs: `arc.http`, `arc.http.session` and `arc.http.helpers`

Things we removed:

- Statically bound Content-Type routes: `@html`, `@css`, `@js`, `@json`, `@text`, `@xml`
- `@architect/functions` interfaces: `arc.css`, `arc.js`, etc.


### Upgrading to HTTP functions

HTTP functions are now completely dynamic and allow for either async/await or Node style errback signatures with **zero deps**.

Extremely new school style:

```javascript
exports.handler = async function http(request) {
  return {
    cors: true,
    type: 'application/javascript',
    body: JSON.stringify({hello:'world'})
  }
}
```

Extremely old school style:

```javascript
exports.handler = function http(request, context, callback) {
  callback(null, {
    cors: true,
    type: 'application/javascript',
    body: JSON.stringify({hello:'world'})
  })
}
```

Of course the `aws-sdk`, and `@architect/functions` and `@architect/data` are still available should you wish to opt into richer functionality. Session support is much more granular:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(request) {

  // read the session from DynamoDB
  let session = await arc.http.session.read(request)

  // mutate the session state
  session.like = (session.like || 0) + 1

  // write the session to DynamoDB and get a Set-Cookie string
  let cookie = await arc.http.session.write(session)

  // ensure the cookie gets updated on the client
  return {
    cookie,
    cors: true,
    type: 'application/javascript',
    body: JSON.stringify({hello:'world'})
  }
}

```

The old school express-style middleware is still available with `@architect/functions`:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

function log(req, res, next) {
  console.log('logger middleware:', JSON.stringify(req, null, 2))
  next()
}

function route(req, res) {
  res({
    html: `hello world from ${url(req.path)}`
  })
}

exports.handler = arc.http(log, route)
```


### Deprecated Docs
  - [Roadmap](/intro/roadmap)
  - [`@css`](/reference/css)
  - [`@html`](/reference/html)
  - [`@js`](/reference/js)
  - [`@json`](/reference/json)
  - [`@text`](/reference/text)
  - [`@xml`](/reference/xml)
  - [`arc.html.get`](/reference/html-get)
  - [`arc.html.post`](/reference/html-post)
  - [`arc.css.get`](/reference/css-get)
  - [`arc.js.get`](/reference/js-get)
  - [`arc.text.get`](/reference/text-get)
  - [`arc.json.get`](/reference/json-get)
  - [`arc.json.post`](/reference/json-post)
  - [`arc.json.put`](/reference/json-put)
  - [`arc.json.patch`](/reference/json-patch)
  - [`arc.json.delete`](/reference/json-delete)
  - [`arc.xml.get`](/reference/xml-get)
  - [`arc.xml.post`](/reference/xml-post)
  - [`arc.xml.put`](/reference/xml-put)
  - [`arc.xml.patch`](/reference/xml-patch)
  - [`arc.xml.delete`](/reference/xml-delete)


## 3.3.0

`@architect/workflows` added SQS support in `3.3.0` and existing apps will need to add permissions to the default `arc-role` IAM Role used for Lambda execution if they want to add `@queues`.

**Using the AWS Console**

1. Open up IAM in the AWS Console
2. Select **Roles** &rarr; **arc-role**
3. Click **Attach Policies**
4. Select **AWSLambdaSQSQueueExecutionRole**
5. Click **Attach Policy**

Now existing functions can publish to SQS queues.

**With the AWS CLI**

If the command line is more your style you can upgrade with the following:

```bash
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole --role-name arc-role
```

**With NodeJS**

If you prefer to script this upgrade you can use the NodeJS `aws-sdk`:

```javascript
let aws = require('aws-sdk')
let PolicyArn = 'arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole'

let iam = new aws.IAM
iam.attachRolePolicy({
  RoleName: 'arc-role'
  PolicyArn, 
}, console.log)
```

