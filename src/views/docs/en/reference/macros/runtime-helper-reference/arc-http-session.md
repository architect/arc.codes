---
title: arc.http.session
description: read/write secure, anonymous sessions from client cookie stores or a secure database
sections:
  - Overview
  - Database vs. JWE
  - Session domain
  - Table name
  - Secret
  - Reading sessions
  - Writing sessions
---

## Overview

ADD ME!


## Database vs. JWE

ADD ME!


## Session domain

ADD ME!


## Table name

ADD ME!


## Secret

Ensure your app has a strong secret key:

```bash
arc env production ARC_APP_SECRET something-much-better-than-this
```

## Reading sessions

Read and write to DynamoDB session tables.

`arc.http.session.read` reads session state for a request.

`read(request, [callback]) => Promise` 
- accepts a request object and an optional Node style errback
- if no callback is supplied returns a Promise that resolves session state

### Basic Example

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  // read the session
  let session = await arc.http.session.read(req)
  let html = `<h1>hello ${session.name || 'unknown'}</h1>`
  return {
    type: 'text/html',
    body: html
  }
}
```

### Example with iterator

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let session await arc.http.session.read(req)
  session.count = (session.count || 0) + 1
  let cookie = await arc.http.session.write(session)
  return {
    statusCode: 302, 
    headers: {
      'set-cookie': cookie,
      'location': '/'
    }
  }
}
```

## Writing sessions

`arc.http.session.write` writes session into DynamoDB.

`write(state, [callback]) => Promise`
- accepts session state as a plain JavaScript object and an optional Node style errback
- if no callback is supplied returns a Promise that resolves a Set-Cookie string

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {

  // read the session
  let session = await arc.http.session.read(req)

  // write the session
  session.name = req.body.name

  // save the session state 
  let cookie = await arc.http.session.write(session)

  // update the session cookie and redirect
  return {
    cookie,
    status: 302,
    location: '/'
  }
}
```
