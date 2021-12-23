---
title: 'Going beyond "Hello World"'
category: Tutorials
description: Next steps in developing an application with Architect
sections:
  - "Static assets + CDNs"
  - "Database tables"
  - "Environment variables"
  - "CI/CD"
  - "Event functions"
  - "Scheduled Functions"
  - "Queue functions"
  - "Macros"
---

Let's go beyond a simple "Hello world" HTTP function by incrementally adding features to a new Architect application.
We'll add "pragmas" to our `./app.arc` manifest file and continue using the `arc` CLI to generate scaffolding and code. All while being able to test our features locally with Sandbox.

## Get started

As an example, let's model a simple meal delivery service, starting with what we get from 

```sh
npm @architect init dinner-delivery
```

```arc
@app
dinner-delivery

@http
get /
```

## `@http` routes

Next, we can extend the number of HTTP routes by filling in some obvious endpoints for our dinner delivery service (we'll skip user account management and authentication for this tutorial):

```arc
@http
get  /
get  /menu # see today's dinner offerings
post /orders # create, update, delete an order
get  /admin # see today's orders
```

### Generate scaffolding

After updating our `app.arc`, we can have the Architect CLI help with scaffolding. From the root of our project:

```sh
npx arc init
```

We'll get a new folder structure like:

```sh
.
├── src
│   └── http 
│     ├── get-admin
│     ├── get-index
│     ├── get-menu
│     └── post-orders
└── app.arc
```

## `@static` assets

We know we'll want to serve things like images and CSS that aren't dynamically created by our functions. To enable a static asset server (backed by S3), add a single pragma to the project's manifest:

```arc
@static
```

Now, by default, files in our project's `./public/` directory can be accessed via HTTP at `/_static/`.

This example will reference `/_static/styles.css`. I won't include the contents here; it provides some simple layout and styles.

## `@shared` code

Architect supports sharing code across all functions. Perfect for utilities and common functionality. Sandbox will help copy our shared code while running and `arc deploy` will hydrate any shared code to each created Lambda.

### Add an HTML helper

Since we're planning to render HTML right from our server functions, we'll add a simple `html.js` helper to `./src/shared`. This will be used to trim and wrap the HTML with some extra layout markup.

```js
// ./src/shared/html.js
module.exports = function html(strings, ...values) {
  let body = '';

  strings.forEach((string, i) => {
    let v = values[i]
    body += `${string.trim()}${v || v === 0 ? v.toString().trim() : ''}`
  });

  return `
<html>
<head>
  <title>Arc Dinner Delivery</title>
  <link href="/_static/styles.css" rel="stylesheet">
</head>
<body>
  <main>
    <h1>Dinner Delivery</h1>
    ${body}
  </main>
</body>
</html>
`.trim();
}
```

Now, with Sandbox running, we can include this file in any function like:

```js
let html = require('@architect/shared/html')

let view = html`<h2>Shared code is super helpful</h2>`
```

## `@tables` to persist data

The Architect `@tables` pragma gives our project access to DynamoDB so we can save and retrieve orders. We can even create "secondary global indexes" with `@tables-indexes`.

### Configure key schema

First, let's declare our data schema's important keys in our project manifest (`app.arc`), these are the fields, or partition keys, that will be indexed for queries and sorting:

```arc
@tables
meals
  mealID *String
orders
  orderID *String
```

> Not all attributes need to be declared in our `@tables` entry. Just those intended for use as primary and sort keys. Data can be arbitrarily attached to a record.

Additionally, we'll index our `meals` by their type so we can retrieve them for a dinner menu. And orders will be secondarily indexed by delivery date, so we can view a list in the admin.

```arc
@tables-indexes
meals
  mealType *String
  name mealsByType
orders
  deliveryDate *String
  name ordersByDate
```

Tip: running `npx arc init` again will validate our schema is valid before we restart Sandbox.

## Function implementation

### Runtime helpers

To simplify our implementation, add the Node.js runtime helpers. This library will help with handling HTTP requests, interacting with tables, and a variety of other features.

From the project root, run:

```sh
npm i @architect/functions
```

### HTTP handlers

Now the fun part: some function code!

Each tab below contains a function's `index.js` file and demonstrates some simple functionality for each HTTP endpoint. Inline comments explain the basics.  
This is not intended to be a full implementation (though, it does work!), but should serve as an outline; see Final Notes below.

<arc-viewer default-tab="get-menu/">
<div slot=contents>
<arc-tab label="get-menu/">
<h5>get-menu/index.js</h5>
<div slot=content>

```js
// ./src/http/get-menu/index.js
let arc = require('@architect/functions')
let html = require('@architect/shared/html')

async function handler() {
  let tables = await arc.tables()

  // query meals where mealType = dinner
  let meals = await tables.meals.query({
    IndexName: 'mealsByType',
    KeyConditionExpression: 'mealType = :type',
    ExpressionAttributeValues: { ':type': 'dinner' },
  })

  let view = html`
<h2>Create an Order</h2>
<!-- A real form! Send a post to our /orders endpoint -->
<form method=post action="/orders">
  <select name=meal required>
    <option value="" selected disabled hidden>Select a meal</option>
    ${meals.Items.map(m => `<option value=${m.mealID}>${m.name}</option>`).join('')}
  </select><br>
  <input type=text name=email required placeholder="Enter your email" /><br>
  <input type=submit value="Place Order" />
</form>
  `

  return { html: view }
}

exports.handler = arc.http.async(handler)
```

</div>
</arc-tab>

<arc-tab label="post-orders/">
<h5>post-orders/index.js</h5>
<div slot="content">

```js
// ./src/http/post-orders/index.js
let arc = require('@architect/functions')
let html = require('@architect/shared/html')

async function handler(request) {
  let today = new Date()
  let tables = await arc.tables()
  // the form-encoded order is already decoded by @architect/functions
  let newOrder = request.body

  // look up the reference meal from the order's meal attribute
  let meal = await tables.meals.get({ mealID: newOrder.meal })

  // set a random string for the order's id -- not for production!
  newOrder.orderID = Math.random().toString(32).slice(2)
  // convert today's date to a string like yyyy-mm-dd
  newOrder.deliveryDate = today.toISOString().split('T')[0]

  // save the new order!
  let order = await tables.orders.put(newOrder)

  let view = html`
<!-- show the customer a receipt -->
<h2>Thank you for your order!</h2>
<p>
  <strong>"${meal.name}"</strong> is on the way.<br>
  Delivery: <code>${order.deliveryDate}</code><br>
  Order id: <code>${order.orderID}</code>
</p>
  `

  return { html: view }
}

exports.handler = arc.http.async(handler)
```

</div>
</arc-tab>

<arc-tab label="get-admin/">
<h5>get-admin/index.js</h5>
<div slot=content>

```js
// ./src/http/get-admin/index.js
let arc = require('@architect/functions')
let html = require('@architect/shared/html')

async function handler(request) {
  let today = new Date()
  let tables = await arc.tables()
  // query orders using the "ordersByDate" index to get today's orders
  let todaysOrders = await tables.orders.query({
    IndexName: 'ordersByDate',
    KeyConditionExpression: 'deliveryDate = :today',
    ExpressionAttributeValues: { ':today': today.toISOString().split('T')[0] }
  })

  let view = html`
<h2>Todays Orders (${todaysOrders.Count})</h2>
<table border=1 cellpadding=5>
  <thead>
    <tr>
      <th>customer</th>
      <th>meal</th>
      <th>id</th>
    </tr>
  </thead>
  <tbody>
    ${todaysOrders.Items.map(o => `
      <tr>
      <td>${o.email}</td>
      <td>${o.meal}</td>
      <td>${o.orderID}</td>
      </tr>
    `.trim()).join('')}
  </tbody>
</table>
  `

  return { html: view }
}

exports.handler = arc.http.async(handler)
```

</div>
</arc-tab>

<arc-tab label="get-index/">
<h5>get-index/index.js</h5>
<div slot=content>

```js
// ./src/http/get-index/index.js
let arc = require('@architect/functions')

async function handler(request) {
  // redirect to the menu
  return {
    statusCode: 301,
    headers: { location: '/menu' }
  }
}

exports.handler = arc.http(handler)
```

</div>
</arc-tab>

</div>
</arc-viewer>

## `@events` for pub/sub

<!-- publish and consume an event for each order -->

## `@scheduled` functions

<!-- open and close the storefront -->

## Final Notes

### Complete `app.arc`

```arc
@app
dinner-delivery

@http
get  /
get  /menu # see today's dinner offerings
get  /admin # see my order history
post /orders # create an order

@static

@tables
meals
  mealID *String
orders
  orderID *String

@tables-indexes
meals
  mealType *String
  name mealsByType
orders
  deliveryDate *String
  name ordersByDate

@events
new-order

@scheduled
open cron(0 8 ? * MON-FRI *) # 8 AM each weekday
close cron(0 15 ? * MON-FRI *) # 3 PM each weekday
```

### Things we didn't do

* user management/authentication
* data validation/sanitization
* any front end Javascript
* there are no tests 😱
