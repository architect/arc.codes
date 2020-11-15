# `arc sandbox`
## Run a local arc development server

Starts a local web server and in-memory database for previewing code defined by `app.arc`. By default the local web server is hosted on port 3333.

- `arc sandbox --port 1234` sets the port the local web server should run on to
    1234
- `arc sandbox --disable-symlinks` will disable the default method of using
    symlinks to mount [shared code](/guides/share-code); instead `sandbox` will
    use regular old file copying (which is way slower!)


The following arc pragmas are supported:

- `@http` and `@ws`: HTTP and WebSocket routes as defined in your `app.arc` will be
    mounted by the local web server
- `@tables` and `@indexes`: a local DynamoDB-like in-memory database containing
    your tables and indexes is created from scratch every time `sandbox` is invoked;
    this means your database is empty every time `sandbox` is started
- `@events` and `@queues`
- `@static`

## Connecting to Staging or Production Environments

It is possible to connect `sandbox` to your deployed arc application
environments. This enables you to wire up your local development environment
with your:

- remotely-deployed `@events` and `@queues`
- remotely-deployed database as defined by your `@tables` and `@indexes`
- [environment variables](/reference/cli/env) from the desired staging or production environment

This is especially useful if you want to work locally with a pre-populated and persisted
database.

**WARNING:** Connecting to remote environments is dangerous! Use with caution,
especially if connecting to production!

To use this, you must have already `arc deploy`ed to the environment you are
connecting to. Use this feature like so:

    ARC_LOCAL=1 NODE_ENV=staging arc sandbox

---
