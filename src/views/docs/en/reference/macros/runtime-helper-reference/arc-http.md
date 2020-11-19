---
title: arc.http
description: 160 (or fewer) character description of this document!
sections:
  - Overview
  - Getting started
  - Requests
  - Responses
  - Middleware
---

## Overview

`arc.http` is a middleware library for working with HTTP requests and responses while still being compatible with Lambda functions. To use it `npm install @architect/functions` to each function folder and require it at the top. 

```js
let arc = require('@architect/functions')

function route(req, res) {
  let html = '<h1> Hello World </h1>'
  response({html})
} 

exports.handler = arc.http(route)
```

## Getting started

`arc.http` registers one, or more, functions with the signature `(req, res, next) =>`. This functions similarly to Express middleware conventions, including the use of `next()` to continue function calls with the modified request object before resolving with a response. 

## Requests

`req` is an Object that has the following keys: 
`body` - any `application/x-www-form-urlencoded` form variables as a plain Object
`path` - absolute path of the request
`method` - one of GET, POST, PATCH, PUT and DELETE
`params` - any URL params defined
`query` - any query params defined
`headers` - a plain Object of request headers
`session` - a plain Object representing the current session


## Responses

`res` is a function that accepts named parameters: 

*Required*: One of 
- JSON
- html 
- text
- css
- js
- XML
- location
Optionally: `session` to assign to the current session
Optionally: `status` or `code` of: 
- 201 Created
- 202 Accepted
- 204 No Content
- 400 Bad Request
- 403 Forbidden
- 404 Not Found
- 406 Not Acceptable
- 409 Conflict
- 415 Unsupported Media Type
- 500 Internal Serverless Error

The default HTTP status code is 200. A 302 is sent automatically when redirecting via location.

- HTTP POST routes can only call `res` with `location` key and value of the redirect path.
- HTTP POST routes can optionally set `session` as well.

## Middleware

`arc.http` can accept multiple functions and execute them in the order they are passed. If the function does not end the request/response cycle, you must call `next()` to proceed to the next function, similar to Express style middleware. The final function call must end with a valid response object. 

In the following example we define `validate` middleware function. When this Lambda function is invoked, it will execute `validate()` then continue onto `handler()` and return the response to the client. 
```js
var arc = require('@architect/functions')
var sendEmail = require('./_send-email')

function validate(req, res, next) {
  var isValid = typeof req.body.email != 'undefined'
  if (isValid) {
    next()
  }
  else {
    res({
      session: {
        errors: ['email missing']
      },
      location: '/contact'
    })
  }
}

function handler(req, res) {
  sendEmail({
    email: req.body.email
  },
  function _email(err) {
    res({
      location: `/contact?success=${err? 'yep' : 'ruhroh'}`
    })
  })
}

exports.handler = arc.http(validate, handler)
```