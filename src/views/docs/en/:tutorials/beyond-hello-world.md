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

## Add more `@http` routes

Next, we can extend the number of HTTP routes by filling in some obvious endpoints for our dinner delivery service (we'll skip user account management and authentication for this tutorial):

```arc
@http
get  /
get  /menu # see today's dinner offerings
get  /my-orders # see my order history
post /orders # create, update, delete an order
```

After updating our `app.arc`, we can have the Architect CLI help with scaffolding. From the root of our project:

```sh
npx arc init
```

We'll get a new folder structure like:

```sh
.
├── src
│   └── http 
│     ├── get-index
│     ├── get-menu
│     ├── get-my_orders
│     └── post-orders
└── app.arc
```

## Persist data in `@tables`

The Architect `@tables` pragma gives our project access to DynamoDB so we can save and retrieve orders.

### Configure key schema

First, let's declare our data schema's important keys in our project manifest (`app.arc`), these are the fields, or partition keys, that will be indexed for queries and sorting:

```arc
@tables
meals
  mealID *String
orders
  orderID *String
  email **String
  deliveryDate **Number
```

> Not all attributes need to be declared in our `@tables` entry. Just those intended for use as primary and sort keys. Data can be arbitrarily attached to a record. Additionally, secondary indexes can be declard with `@tables-indexes`.

### Create and list data

To simplify our implementation, add the Node.js runtime helpers. This library will help with handling HTTP requests, interacting with tables, and a variety of other features.

From the project root, run:

```sh
npm i @architect/functions
```

Now the fun part: some function code!

Each tab below contains a function's `index.js` file and demonstrates some simple functionality for each HTTP endpoint. Inline comments explain the basics.  
This is not intended to be a full implementation (though, it does work!), but should serve as an outline; see Caveats below.

<arc-viewer default-tab="get-menu/">
<div slot=contents>
<arc-tab label="get-menu/">
<h5>get-menu/index.js</h5>
<div slot=content>

```js
let arc = require('@architect/functions')

async function handler(request) {
  let tables = await arc.tables()
  // WIP
}

exports.handler = arc.http.async(handler)
```

</div>
</arc-tab>

<arc-tab label="post-orders/">
<h5>post-orders/index.js</h5>
<div slot="content">

```js
let arc = require('@architect/functions')

async function handler(request) {
  let tables = await arc.tables()
  let newOrder = request.body.order

  newOrder.orderID = Date.now()

  let order = await tables.orders.put(newOrder)

  return {
    json: {
      ok: true,
      order,
    }
  }
}

exports.handler = arc.http.async(handler)
```

</div>
</arc-tab>

<arc-tab label="get-my_orders/">
<h5>get-my_orders/index.js</h5>
<div slot=content>

```js
let arc = require('@architect/functions')

async function handler(request) {
  let tables = await arc.tables()
  // WIP
}

exports.handler = arc.http.async(handler)
```

</div>
</arc-tab>

<arc-tab label="get-index/">
<h5>get-index/index.js</h5>
<div slot=content>

```js
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

## `@shared` code

## `@static` assets

We know we'll want to serve things like images and CSS that aren't dynamically created by our functions. To enable a static asset server (backed by S3), add a single pragma to the project's manifest:

```arc
@static
```

Now, by default, files in our project's `./public/` directory can be accessed via HTTP at `/_static`.

### Reference

* Check out the full Static Assets Guide
* Refer to the `@static` reference documentation

## Pub/Sub with `@events`

<!-- publish and consume an event for each order -->

## `@scheduled` functions

<!-- open and close the storefront -->

## Final `app.arc`

```arc
@app
dinner-delivery

@http
get  /
get  /menu # see today's dinner offerings
get  /my-orders # see my order history
post /orders # create an order

@static

@tables
meals
  mealID *String
orders
  orderID *String
  email **String
  deliveryDate **Number

@events
new-order

@scheduled
open cron(0 8 ? * MON-FRI *) # 8 AM each weekday
close cron(0 15 ? * MON-FRI *) # 3 PM each weekday
```

## Caveats

### Things we didn't do

* user management/authentication
* data validation/sanitization
* orderMeals table
