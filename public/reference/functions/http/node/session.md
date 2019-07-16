# `arc.http.session`

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
