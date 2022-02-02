---
title: 'Going beyond "Hello World"'
category: Tutorials
description: Next steps in developing an application with Architect
---

Let's go beyond a simple "Hello world" HTTP function by incrementally adding features to a new Architect application. For this tutorial we'll:

* Add "pragmas" to our `./app.arc` manifest file
* Use features of the `arc` CLI to generate scaffolding and code
* Preview our application locally with Sandbox
* Use "vanilla" JavaScript and HTML
* Forego a front end framework

## Get started

> If you haven't already, check the Quickstart guide to get set up.

As an example, we'll use a simple meal delivery service as a model. Starting from what is created by running:

```sh
npm init @architect dinner-delivery
```

The beginning of _Dinner Delivery™️_ lives in our new `app.arc`

```arc
# ./app.arc
@app
dinner-delivery

@http
get /
```

## `@http` routes

Next, we can extend the number of HTTP routes by filling in some obvious endpoints for a meal delivery service (we'll skip user account management and authentication for this tutorial) replace the `@http` block with:

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
│       ├── get-admin
│       ├── get-index
│       ├── get-menu
│       └── post-orders
└── app.arc
```

> At any step in this tutorial start up the local Sandbox with `npx arc sandbox` and navigate to `localhost:3333`.

## `@static` assets

We know we'll want to serve things like images and CSS that aren't dynamically created by our functions. To enable a static asset server (backed by S3), add a single pragma to the project's manifest:

```arc
@static
```

Now, by default, files in our project's `./public/` directory can be accessed via HTTP at `/_static/`.

This example will reference `/_static/styles.css`. It provides some simple layout and styles; I won't include the contents here.

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

The Architect `@tables` pragma gives our project access to DynamoDB so we can save and retrieve orders. We can even create "Global Secondary Indexes" with `@tables-indexes`.

### Configure keyed schema

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

> Tip: running `npx arc init` again will validate our schema is valid before we restart Sandbox.

## Function implementation

### Runtime helpers

To simplify our implementation, we'll add the Node.js runtime helpers. This library will help with handling HTTP requests, interacting with tables, and a variety of other features. Similar libraries are available for Ruby and Python.

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

function handler(request) {
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

It's really nice to be able to act on events in another process so that our main HTTP functions aren't tied up doing other things that don't need to happen before returning HTML.

For example, we may want to do something for each new order created. Use the `@events` pragma to create a named event our app can subscribe to with a new Lambda function. We'll add the following:

```arc
@events
new-order
```

Again, running `npx arc init` is helpful to create a `.js` file at the correct location for our subscriber.

### Publish an event

Let's add a single line to our `post-orders/index.js` endpoint right after the order is saved: 

```js
// ./src/http/post-orders/index.js

...
  // publish a "new-order" event for background processing
  await arc.events.publish({ name: 'new-order', payload: order })
...
```

Super simple. Just specify the event name and use the order as the payload.

### Subscribe to "new-order"

To "listen" for these events, we'll update our fresh event function. Notice the `order` is passed directly as it was created to the handler function:

```js
// ./src/events/new-order/index.js
let arc = require('@architect/functions')

async function handler (order) {
  // maybe send an email or charge a credit card
  console.log(`${order.email} ordered a ${order.meal} for ${order.deliveryDate}`)
  return
}

exports.handler = arc.events.subscribe(handler)
```

## `@scheduled` functions

Lambdas are really helpful for scheduled tasks. Architect can provision scheduled functions with the `@scheduled` pragma.  
Let's say _Dinner Delivery's_ finance team wants a report every Friday morning. We can update our `app.arc` with:

```arc
@scheduled
delivery-report cron(0 8 ? * FRI *) # 8 AM each Friday
```

> `cron()` is powerful, but a simpler `rate()` function is also available. For example: `update-inventory rate(1 hour)` will run the "update-inventory" function each hour.

Once again, run `npx arc init` to scaffold our scheduled function.

From the newly created scheduled function, we can access order data and formulate a report (the requirements from finance are still unclear, so we'll just log the event for now):

```js
// ./src/scheduled/delivery-report/index.js
let arc = require('@architect/functions')

exports.handler = async function scheduled (event) {
  let tables = await arc.tables()

  // look for data in tables.orders
  
  console.log(JSON.stringify(event, null, 2))

  return
}
```

## Final Notes

### Complete `app.arc`

For reference, here's the final `app.arc` project manifest file:

```arc
@app
dinner-delivery

@http
get  / # server root
get  /menu # see today's dinner offerings
get  /admin # see my order history
post /orders # create an order

@static # static asset server

@tables
meals # items on Dinner Delivery's menu
  mealID *String
orders # customer orders
  orderID *String

@tables-indexes
meals # look up meals by type
  mealType *String
  name mealsByType
orders # look up orders by date
  deliveryDate *String
  name ordersByDate

@events
new-order # do "background" work on new orders

@scheduled
delivery-report cron(0 8 ? * FRI *) # 8 AM each Friday
```

And our directory structure:

```sh
.
├── public/
│   └── styles.css
├── src/
│   ├── events/
│   │   └── new-order/index.js
│   ├── http/
│   │   ├── get-admin/index.js
│   │   ├── get-index/index.js
│   │   ├── get-menu/index.js
│   │   └── post-orders/index.js
│   ├── scheduled/
│   │   └── delivery-report/index.js
│   └── shared/
│       └── html.js
├── app.arc
└── package.json
```

### Next steps

This tutorial wasn't intended as a fully-featured application, but it does demonstrate several common capabilities of Architect. Some next steps could include

* User management/authentication -- check out this example
* Data validation/sanitization
* Error handling; each `await` should be wrapped with a try/catch
* Some front end JavaScript with your favorite framework
* Testing! We have some suggestions.
