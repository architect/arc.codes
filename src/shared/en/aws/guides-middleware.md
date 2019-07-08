# Middleware (`arc.middleware`)

You can combine multiple operations in a single route using the middleware API. This is similar to middleware processing in other node frameworks, but uses [the same style as regular Arc routes](/guides/http). Just run `arc.middleware()` specifying each middleware item as arguments. `arc.middleware()` outputs a lambda, combining the each middleware function given as arguments. Requests will be run through each middleware item in the order they're given to `arc.middleware()` with the following rules:

- A middleware item is a function that takes a [request](/guides/http)
- If the middleware item doesn't return anything, the request will be passed to the next middleware item in the queue
- If the middleware returns a modified `request`, the modified `request` will be passed to the next middleware item
- If the middleware item returns a [response](/guides/http), this will end processing and send the `response` back. 

Here's an example in which we'll register `addCountryCode`, `requireLogin`, and `showDashboard` to run in series. 

- `addCountryCode` adds `countryCode` to our request
- `requireLogin` will return a redirect response if the user is not logged in (ending middleware processing) or return nothing if they user is logged in (continuing middleware processing).
- `showDashboard` will show a dashboard for users, since we know they're logged in.

```javascript
let arc = require("@architect/functions");

// Add a 'countryCode' attribute to the request 
function addCountryCode(request) {
  // AWS already does this with req.headers['CloudFront-Viewer-Country']
  // but for other cloud providers you can use your preferred geoip 
  // module, or pretend everyone is in New Zealand like below!
  request.countryCode = 'NZ'
  // The modified request will be used in subsequent middleware steps
  return request;
};

// Redirect if the user isn't logged in
async function requireLogin(request) {
	let state = await arc.http.session.read(request);

	if (!state.isLoggedIn) {
		console.log(`Attempt to access dashboard without logging in!`);
    return {
      status: 302,
      location: `/login`
    };
	}
	console.log(`We're logged in`);
	// return nothing, so middleware continues
}

// Show a HTML page. If we've reached this step we know the user is logged in, and we know their country code! 
async function showDashboard(request) {
	console.log(`Showing dashboard`);

	let dashboardPage = `
	<body>
		<h1>Dashboard</h1>
		<p>You are logged in from ${request.countryCode}! <a href="/logout">logout</a><p>
	</body>`;
	return {	
		status: 200,
		type: 'text/html',
		body: dashboardPage
	};
}

exports.handler = arc.middleware(addCountryCode, requireLogin, showDashboard);
```

The middleware API works well with [the `shared` folder](/guides/sharing-common-code) to do things like re-use `requireLogin` to protect multiple lambdas. 

Like normal [Arc routes](/guides/http), middleware routes also support the AWS [`context`](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html) object. `context` will be passed on as a second option to each route. 

## Common Session Use Cases

- Authentication 
- Tracking user interactions (kick off a `@event` to save something to the database without blocking the reequest!) 
- Adding additional info to requests

<hr>

## Next: [Persist Data](/guides/data)
