---
title: Local development
category: Developer experience
description: How to develop locally with Architect sandbox
---

Fast local development creates a tighter feedback loop, maximizing developer velocity. Architect provides utilities to run projects locally, provision new resources, and debug your application.

## Running locally

> 🏁 To set up Architect locally follow the [quickstart guide](../../guides/get-started/quickstart).

Preview a project running locally in a web browser by starting Architect's Sandbox:

```console
cd myproject
arc sandbox
```

>  [`arc sandbox`](../../reference/cli/sandbox) spins up a local web server with all the resources defined in manifest, emulating a suite of AWS features.

Check out [a complete example project for working locally](https://github.com/architect-examples/arc-example-working-locally){target=_blank}.

## Creating a new resource

You can create a new resource (HTTP route, event, scheduled task, etc.) to an existing project by simply adding a line to the [Architect manifest file](../../guides/get-started/project-layout#manifest-file-format-overview). The following example will provision a new "hit counter" event.

> 👉 Note: this example uses Node.js conventions but the process is similar for the [Ruby](../../reference/runtime/ruby) (bundler) and [Python](../../reference/runtime/python) (pip) runtimes.

### Update Architect's configuration

To create a new event, add an entry to your manifest's [`@events` pragma](../../reference/app.arc/events).

Sample `app.arc` file with a new `hit-counter` event:

```arc
# app.arc
@app
my-app

@events
hit-counter
```

> 💡 If the pragma does not already exist, add "@events" on a new line.

### Scaffold the new resource with `arc init`

The Architect CLI [`init` command](../../reference/cli/init) can be used to create scaffolding for the new event. From the project root:

```console
arc init
```

> 👀 Notice that `arc` finds your updated Architect manifest and creates new project files for the hit-counter event. `arc init` can be run as needed while developing your application.

The following structure was added to your project:
<!-- unsure if this diagram is necessary -->
```
.
├── src
│   └── events
│       └── hit-counter
│           ├── index.js
│           └── config.arc
│
└── app.arc
```

### Add dependencies (optional)

Your new event may require some dependencies. For this example, [the @architect/functions runtime helper library](../../reference/runtime/node.js) will be helpful to handle the event subscription. [Dependencies in Node.js can be managed](dependency-management) either globally from the root `package.json`, or managed via separate `package.json` files in each function's directory. This example will use the project's main `package.json` to take advantage of Architect's tree-shaking:

From the root, install dependencies with `npm`:

```console
npm install @architect/functions
```

Start up the [sandbox](../../reference/cli/sandbox):

```console
arc sandbox
```

[`arc sandbox`](../../reference/cli/sandbox) will automatically [hydrate](../../reference/cli/hydrate) (install dependencies) and determine an optimal `node_modules` for each function in your Architect project.

> 📖 Read more about [dependency management](../../guides/developer-experience/dependency-management).

## Debugging

With an Architect project running locally, there are several ways to work on your application.

You can run a front-end application from the same Architect project to communicate with the back-end or use a client to interface with HTTP functions.

Of course, the best way to catch bugs is by [testing your Architect project](testing).
