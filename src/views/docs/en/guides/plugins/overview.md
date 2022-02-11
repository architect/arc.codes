---
title: Plugins overview
category: Plugins
description: Overview of Architect's plugin API
---

Architect's plugin API exposes [workflow lifecycle hooks](#workflow-hooks) (such filesystem events in the [Sandbox](/docs/en/reference/cli/sandbox)) and interfaces for [generating cloud resources](#resource-setters) (such as custom Lambdas, or environment variables).

This document assumes some existing knowledge of how Architect works, including the [project manifest](/docs/en/get-started/project-manifest), deterministic deployment to AWS via CloudFormation, etc.


## Finding & installing plugins

[Architect maintains a list of officially supported and community developed plugins](https://github.com/architect/plugins); npm is also a great place to [find plugins](https://www.npmjs.com/search?q=arc-plugin-) (and [legacy macros](#macros)).

To install a plugin, add a `@plugins` pragma to your project manifest. For example, if you wanted to `npm install` and use both `@architect/plugin-typescript` and `arc-macro-cors`, this is what you'd add to your manifest:

```arc
@plugins
architect/plugin-typescript # note: leading @ must be removed from namespaced packages
arc-macro-cors
```

You can also use unpublished local plugins like so:

```arc
@plugins
my-private-plugin       # loads from `src/plugins/my-private-plugin[.js|/index.js]`
another-private-plugin  # loads from `foo/index.js`
  src foo
```


## Authoring plugins

Architect provides an end-to-end suite of workflows, conventions, and optimized defaults for building excellent serverless web apps and APIs with AWS. Architect plugins enable developers to extend (or override) this functionality in a variety of ways with interfaces into both workflows and resource creation.


- The Inventory object
- [Hooks for workflow lifecycles](#workflow-hooks)
- [Cloud resource generation](#resource-setters)


### Workflow hooks

Workflow hooks enable developers to extend Architect workflows

- `deploy`
  - `start` - run arbitrary pre-deploy operations + customize CloudFormation (formerly `@macros`)
  - `services` - hook into Architect's service discovery to create references to custom resources, or populate config data
  - `target` - bypass CloudFormation deployment to AWS, and ship the project to an AWS intermediary
  - `end` - run arbitrary post-deploy operations
- `sandbox`
  - `start` - run arbitrary operations during Sandbox startup
  - `watcher` - act on project filesystem events (e.g. `src/http/get-foo/auth.js` → `updated`)
  - `end` - run arbitrary operations during Sandbox shutdown


### Resource setters

Resource setters are small, synchronous methods that enable the rapid programmatic creation of various Architect resources, ranging from HTTP routes, to environment variables, to custom runtimes.

Any Lambdas or resources defined by setters is treated by Architect as a first-class primitive, as though it was built into Architect itself.

- Pragmas
  - `events` - register async events
  - `http` - register HTTP routes
  - `queues` - register async event queues
  - `scheduled` - register scheduled events
  - `tables-streams` - register DynamoDB event streams
  - `ws` - register WebSocket routes
- Resources
  - `env` - register environment variables
  - `customLambdas` - register bare Lambdas without a pre-associated event source
  - `runtimes` - register custom runtimes


## Publishing plugins

Should you opt to publish your plugin for others to use – and we hope you will! – they should be published to `npm` with the following naming convention: `arc-plugin-{your unique plugin name}`.

Official plugins by Architect maintainers are published under the `@architect` org as `@architect/plugin-{plugin name}`.


## Macros

Long-time Architect users may be familiar with macros (`@macros` – extensions that enable customization of CloudFormation at deploy time). Macros are forward-compatible with plugins, but are no longer the preferred way of customizing CloudFormation.

**Existing macros will continue to work indefinitely; you do not need to update them to the new plugins API.** However, the macros API is no longer receiving updates, whereas the [`deploy.start` plugin API](./deploy) has new features that you may find helpful.

[Learn more about porting existing macros to plugins](./porting-macros-to-plugins).

If you have [existing macros](#macros), they can live side by side in their respective pragma (so long as plugins and macros do not have any conflicting names):

```arc
@plugins
my-private-plugin

@macros
my-private-macro
```
