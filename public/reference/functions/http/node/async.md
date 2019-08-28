# `arc.http.async`

> Formerly `arc.middleware` / `arc.http.middleware`

Architect provides two optional middleware helpers for cutting down on boilerplate HTTP operations.

Both middleware helpers conveniently attach user sessions to incoming `request` object (if applicable), and decode and parse the `request` body (again, if applicable).

Use whatever feels right for your project and team needs!

- `arc.http.async` is an `async/await` style middleware API
- [`arc.http`](/reference/functions/http/node/classic) is a classic callback-style middleware API
  - Functions similarly to Express, and supported since the earliest versions of Architect


## About `arc.http.async`

Combine multiple `async/await` operations in a single HTTP function handler. `arc.http.async()` accepts `async` functions as arguments, and returns a Lambda-compatible function signature. Requests run through each middleware function in the order they are passed to `arc.http.async()` with the following rules:

- Each function receives a `request` as the first argument
  - If the `request` has a session or body, it will automatically be decoded, parsed, and attached to the `request` object
- If a function doesn't return anything, the `request` will then be passed to the next function
- If a function returns a modified `request`, the modified `request` will be passed to the next function
- If a function returns a [`response`](/guides/http), this will end processing and emit the `response` to the client


### Example

Here's an example in which we'll register `addCountryCode`, `requireLogin`, and `showDashboard` functions to run in series.

- `addCountryCode` adds `countryCode` to our `request`
- `requireLogin` will return a redirect response if the user is not logged in (ending `arc.http.async` processing), or return nothing if the user is logged in (continuing execution)
- `showDashboard` will show a dashboard for users, since we know they're logged in

```javascript
let arc = require('@architect/functions')

// Add a 'countryCode' attribute to the request
async function addCountryCode(request) {
  // AWS already does this with req.headers['CloudFront-Viewer-Country']
  // but for other cloud providers you can use your preferred geoIP module
  // ... or just pretend everyone is in New Zealand!
  request.countryCode = 'NZ'
  // The modified request will be used in subsequent steps
  return request
}

// Redirect if the user isn't logged in
async function requireLogin(request) {
	let state = request.session

	if (!state.isLoggedIn) {
		console.log(`Attempt to access dashboard without logging in!`)
		return {
			status: 302,
      			location: `/login`
      		}
	}
	console.log(`We're logged in`)
	// return nothing, so execution continues
}

// Show a HTML page. If we've reached this step we know the user is logged in, and we know their country code!
async function showDashboard(request) {
	console.log(`Showing dashboard`)

	let body = `
	<body>
		<h1>Dashboard</h1>
		<p>You are logged in from ${request.countryCode}! <a href="/logout">logout</a><p>
	</body>`
	return {
		status: 200,
		type: 'text/html',
		body
	}
}

exports.handler = arc.http.async(addCountryCode, requireLogin, showDashboard)
```

Super clean!

The `arc.http.async` API works well with [the `shared` folder](/guides/sharing-common-code) to do things like re-use `requireLogin` to protect multiple HTTP functions.

Like normal [Architect routes](/guides/http), `arc.http.async` routes also support the AWS [`context`](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html) object. `context` will be passed on as a second option to each route.


## Common use cases

- Authentication
- Tracking user interactions (kick off a `@event` to save something to the database without blocking the request)
- Adding additional info to requests

<hr>
