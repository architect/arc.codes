# <a id=arc.middleware href=#arc.middleware>`arc.middleware`</a>

You can combine multiple operations in a single route using the middleware API. This is similar to middleware processing in other node frameworks, but uses [the same style as regular Arc routes](/guides/http). Just run `arc.middleware()` specifying each middleware item as arguments. Requests will be run through each middleware item in the order they're given to `arc.middleware()` with the following rules:

- A middleware item is a function that takes a [request](/guides/http) (which we call `req` per convention)
- If the middleware item doesn't return anything, the request will be passed to the next middleware item in the queue
- If the middleware returns a modified request, the modified request will be passed to the next middleware item
- If the middleware item returns a [response](/guides/http), this will end processing and send the response back. 

Here's an example in which we'll register `addCountryCode`, `requireLogin`, and `showDashboard` to run in series. 

- `addCountryCode` adds `countryCode` to our request
- `requireLogin` will return a redirect response if we're not logged in (ending processing) or continue if we are logged in
- `showDashboard` will show a dashboard for users, since we know they're logged in.

```javascript
let arc = require("@architect/functions");

// Add a 'countryCode' attribute to the request 
function addCountryCode(req) {
  // AWS already does this with req.headers['CloudFront-Viewer-Country']
  // but for other cloud providers you can use your preferred geoip 
  // module, or pretend everyone is in New Zealand like below!
  req.countryCode = 'NZ'
  // The modified request will be used in subsequent middleware steps
  return req;
};

// Redirect if the user isn't logged in
async function requireLogin(req) {
	let state = await arc.http.session.read(req);

	if (!state.isLoggedIn) {
		console.log(`Attempt to access dashboard without logging in!`);
    return {
      status: 301,
      location: `/login`
    };
	}
	console.log(`We're logged in`);
	// return nothing, so middleware continues
}

// Show a HTML page. If we've reached this step we know the user is logged in, and we know their country code! 
async function showDashboard(req) {
	console.log(`Showing dashboard`);

	let dashboardPage = `
	<body>
		<h1>Dashboard</h1>
		<p>You are logged in from ${req.countryCode}! <a href="/logout">logout</a><p>
	</body>`;
	return respond.makeResponse(dashboardPage);
}

exports.handler = arc.middleware(addCountryCode, requireLogin, showDashboard);
```

The middleware API works well with [the `shared` folder](/guides/sharing-common-code) to do things like re-use `requireLogin` to protect multiple lambdas. 