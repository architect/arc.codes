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

As an example, let's model a meal delivery service, starting with what we get from `npm @architect init dinner-delivery`:

```arc
@app
dinner-delivery

@http
get /
```

## `@static` assets

We know we'll want to serve things like images and CSS that aren't dynamically created by our functions. To enable a static asset server (via S3), add a single pragma to the project's manifest:

```arc
@static
```

Now, by default, files in our project's `./public/` directory can be accessed via HTTP at `/_static`.

### Reference

* Check out the full Static Assets Guide
* Refer to the `@static` reference documentation


## More `@http` routes

Next, we can extend the number of HTTP routes by filling in some obvious endpoints for our dinner delivery service (we'll skip user account management and authentication for this tutorial):

```arc
@http
get /
get /menu # see today's dinner offerings
get /my-orders # see my order history
post /orders # create an order
delete /orders # cancel an order
```

## Persist data in `@tables`

## `@shared` code

## PubSub with `@events`

<!-- publish and consume an event for each order -->

## `@scheduled` functions

<!-- open and close the storefront -->
