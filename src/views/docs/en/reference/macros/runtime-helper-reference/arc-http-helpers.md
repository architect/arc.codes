---
title: arc.http.helpers
description: additional web helpers
sections:
  - Body parser
  - URL
  - Express
---

## Body parser

`arc.http.helpers.bodyParser` accepts a Base64 encoded string request body and will interpolate a request body into an object. `bodyParser` will interpolate request bodies based on `Content-Type` from the headers. Architect request bodies are always Base64 encoded strings with `req.isBase64Encoded=true`.

```js
let arc = require('@architect/functions')

exports.handler = async function (req) {
  let body = arc.http.helpers.bodyParser(req)
  return {
    headers: {"Content-type": "text/html; charset=UTF-8"},    
    body: `<pre>${JSON.stringify(body)}</pre>`
  }
}
```

Multipart Form Data
```js
// incoming POST request with {"key":"value"}
{
  httpMethod: 'POST',
  body: 'LS1YLUlOU09NTklBLUJPVU5EQVJZDQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9ImtleSINCg0KdmFsdWUNCi0tWC1JTlNPTU5JQS1CT1VOREFSWS0tDQo=',
  headers: {
    'content-type': 'multipart/form-data; boundary=X-INSOMNIA-BOUNDARY',
  }
}
// result of bodyParser
{
  "base64": "LS1YLUlOU09NTklBLUJPVU5EQVJZDQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9ImtleSINCg0KdmFsdWUNCi0tWC1JTlNPTU5JQS1CT1VOREFSWS0tDQo="
}
```

Form data URL encoded
```js
// incoming POST request with {"key":"value"}
{
  httpMethod: 'POST',
  body: 'a2V5PXZhbHVl',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  }
}
// result of bodyParser
[Object: null prototype] { key: 'value' }
```

JSON
```js
// incoming POST request with {"key":"value"}
{
  httpMethod: 'POST',
  body: 'ewoJImtleSI6InZhbHVlIgp9',
  headers: {
    'content-type': 'application/json',
  }
}
// result of bodyParser
{ key: 'value' }
```


## URL

Architect deploys to `staging` and `production` environments with different API Gateway endpoints. The staging endpoint has `/staging` appended to it. The URL helper let's you wrap a path and it will return the correct path for the environment. 

```js
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function (req) {
  return {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
    body: `<h1> Hello World </h1> <a href = ${url('/about')}> About Link</a>`
  }
}
```
In a staging environment, it will send the user to `/staging/about`, but in testing and production it will be `/about`

## Express

Architect has a helper for transitioning your Express apps to fully serverless architecture. In order to use Express in an HTTP function, look at the following example: 

```js
// src/http/get-index/index.js

let arc = require('@architect/functions')
let express = require('express')

let app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/cool', (req, res)=> res.send('very cool'))

exports.handler = arc.http.express(app)
```
`arc.http.express` is passed an app instance of `express()` and the rest of the app works just like Express. 

Things to keep in mind: 

- A Lambda function is stateless, so each time a user reaches this endpoint, they will receive a new instance of the entire Express server.
- Bundling an entire app with a web server in a Lambda function will result in poor performance if the entire function’s payload (including dependencies) exceeds 5MB.
