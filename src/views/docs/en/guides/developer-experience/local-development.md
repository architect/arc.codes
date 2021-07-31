---
title: Local development
category: Developer experience
description: How to develop locally with Architect sandbox
---

Fast local development creates a tighter feedback loop maximizing developer velocity. Architect provides utilities to provision resources, run locally, and debug applications.

## Running locally

> To set up Architect locally follow the [quickstart guide](/docs/en/guides/get-started/quickstart).

Preview a project running locally in a web browser:

```console
cd myproject
arc sandbox
```

>  [`arc sandbox`](/docs/en/reference/cli/sandbox) spins up a local web server with all the resources defined in your `app.arc` file, emulating a suite of AWS features.

Checkout [a complete example project for working locally](https://github.com/architect-examples/arc-example-working-locally).

## Creating a new resource

Adding a new resource ([@http](/docs/en/reference/app.arc/http) endpoint, [@events](/docs/en/reference/app.arc/events), [@scheduled](/docs/en/reference/app.arc/scheduled), etc.) to an existing project is as simple as adding an entry to the [Architect manifest](/docs/en/guides/get-started/project-layout#manifest-file-format-overview).

> 👉 Note: this example will use Node.js conventions but the process is similar for the [Ruby](/docs/en/reference/runtime/ruby) (bundler) and [Python](/docs/en/reference/runtime/python) (pip) runtimes.

### Update Architect's configuration

Add an entry under the `@events` pragma (if it doesn't exist, add it on a new line) for a new "hit counter" event:

```arc
# app.arc
@app
my-app

@events
hit-counter
```

### Scaffold with `arc init`

Architect's CLI [`init` command](/docs/en/reference/cli/init) can be used to create some scaffolding for the new event. From the project root:

```console
arc init
```

> 👀 Notice the CLI found an existing Architect manifest and new project files were created in `./src/events/hit-counter/` for the added event.

### Add dependencies

The new event may require some dependencies. For this Node.js example @architect/functions {LINK} will be helpful to handle the event subscription. Ensure this requirement is met:

1. In the generated `./src/events/hit-counter` directory create a `package.json` file with an empty `dependencies` entry:

```json
// package.json
{
  "dependencies": {}
}
```

2. Install dependencies

```console
cd src/events/hit-counter
npm i @architect/functions
```

3. From the project root start the sandbox

```console
arc sandbox
```

Architect will hydrate [shared code](/docs/en/guides/developer-experience/sharing-code) and run the updated Architect project.

## Debugging

With an Architect project running locally, there are several ways to develop and debug an application.

Developers can run a front-end application from the same Architect project to communicate with the back-end or use a client to interface with HTTP functions.

Of course, the best way to catch bugs is by [testing your Architect project](/docs/en/guides/developer-experience/testing).
