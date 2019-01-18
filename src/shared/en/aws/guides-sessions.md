# Sessions

> All `@http` defined routes are session capable via `@architect/functions`

By default all routes in an Architect apps are enabled with a stateless, signed, encrypted, httpOnly cookie. This allows you to write fully stateful applications despite Lambda functions being completely stateless. 

Read the session:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let session = await arc.http.session.read(req)
  return {
    type: 'text/html; charset=utf8',
    body: `<pre>${JSON.stringify(session, null, 2)}</pre>`
  }
}
```

Write the session:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(req) {
  let session = await arc.http.session.read(req)
  session.count = (session.count || 0) + 1
  let cookie = await arc.http.session.write(session)
  let status = 302
  let location = '/'
  return {cookie, status, location}
}
```
## Strong Key

Ensure your app has a strong secret key:

```bash
npx env production ARC_APP_SECRET something-much-better-than-this
```

Environment variables are automatically synced with all your lambda functions. When you add new functions you will need to sync their env variables by running `npx env verify`. 

## Database Sessions

If you have stricter security requirements and do not want to expose any session state to clients you can opt into sessions backed by DynamoDB tables.

You'll need to define a session table in your `.arc` file with `_idx` partition key and `_ttl` attribute for token expiry:

```arc
@app
testapp

@http
get /

@tables
session
  _idx *String
  _ttl TTL
```

Run `npx create` to generate the session database tables. Next opt your Lambda functions into using that table by overriding `SESSION_TABLE_NAME`:

```bash
npx env staging SESSION_TABLE_NAME jwe
npx env production SESSION_TABLE_NAME testapp-production-session
```

This will sync all production lambdas to use the DynamoDB table while testing and staging environments will continue to use the stateless cookie. If you add new routes you will need to remember to sync by running `npx env verify`.


## Common Session Use Cases

- Authentication
- Error messages
- Shopping carts

<hr>

## Next: [Work Locally](/guides/offline)
