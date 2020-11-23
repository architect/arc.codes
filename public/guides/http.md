## Example App

Let's implement a proof-of-concept login flow. There's [a repo with the example below on GitHub](https://github.com/architect/arc-example-login-flow).

This example `app.arc` project brings together all the concepts for defining HTTP Lambdas:

```arc
@app
loginflow

@http
get /
get /logout
get /protected
post /login
```

`npx arc create` generates the following directory structure:

```bash
/
├── src
│   ├── http
│   │   ├── get-index/
│   │   ├── get-logout/
│   │   ├── get-protected/
│   │   └── post-login/
│   └── shared/
├── app.arc
└── package.json
```

First we make `GET` for `/` show a message for logged in users, or a login form for logged out users, depending on `state.isLoggedIn`:

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function http(req) {
  let state = await arc.http.session.read(req)
  let isLoggedIn = !!state.isLoggedIn

  var loggedInPage = `
	<h2>You're logged in</h2>
  	<p>
	  <a href=${url('/protected')}>protected</a>
	  <a href=${url('/logout')}>logout</a>
	</p>`

  var notLoggedInPage = `
  	<h2>Logged out</h2>
    <form action=${url('/login')} method=post>
      <label for=email>Email</label>
      <input type=text name=email>
      <label for=password>Password</label>
      <input type=password name=password>
      <button>Login</button>
    </form>
  `

  return {
    type: 'text/html',
    body: `
	<body>
		<h1>Login Demo</h1>
		${isLoggedIn ? loggedInPage : notLoggedInPage}
	<body>`
  }
}
```

That form performs an HTTP `POST` to `/login` where we look for mock values in `req.body.email` and `req.body.password`:

```javascript
let arc = require('@architect/functions')

exports.handler = async function http(request) {
  let session = await arc.http.session.read(request)
  let isLoggedIn = request.body.email === 'admin@example.com' && request.body.password === 'admin'
  session.isLoggedIn = isLoggedIn
  const location = isLoggedIn ? '/' : '/login'
  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: 302,
    location
  }
}
```

If successful `session.isLoggedIn` will be `true` and we'll redirect to `/`, which, since we're logged in now, will show different content.

`/protected` utilizes middleware to ensure only logged in users can see it.

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

async function requireLogin(request) {
  let state = await arc.http.session.read(request)

  if (!state.isLoggedIn) {
    console.log(`Attempt to access protected page without logging in!`)
    // Return a response, so middleware processing ends
    return {
      status: 302,
      location: url(`/`)
    }
  }
  console.log(`We're logged in`)
  // return nothing, so middleware processing continues
}

async function showProtectedPage(request) {
  console.log(`Showing dashboard`)

  let protectedPage = `
	<body>
		<h1>Dashboard</h1>
		<p>Only logged in users can visit this page!</p>
		<p><a href="${url('/logout')}">logout</a></p>
	</body>`
  return respond.makeResponse(protectedPage)
}

exports.handler = arc.middleware(requireLogin, showProtectedPage)

```

Logging out just resets the `session` and redirects back to `/`.

```javascript
let arc = require('@architect/functions')
let url = arc.http.helpers.url

exports.handler = async function route(request) {
  let session = await arc.http.session.read(request)
  session.isLoggedIn = false
  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: 302,
    location: url('/')
  }
}

```

And that's it! Remember you can find [the example repo on GitHub.](https://github.com/architect/arc-example-login-flow)

<hr>

## Next: [Working locally & offline](/guides/offline)
