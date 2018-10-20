# <a id=arc.http.session href=#arc.http.session>`arc.http.session`</a>

Read and write to DynamoDB session tables.

> 🦉 `arc.http.session.read` reads session state for a request.

`read(request, [callback]) => Promise` 
- accepts a request object and an optional Node style errback
- if no callback is supplied returns a Promise that resolves session state

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

> 💾 `arc.http.session.write` writes session into DynamoDB.

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


