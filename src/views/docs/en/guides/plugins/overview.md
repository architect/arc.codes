---
title: Plugins overview
category: Plugins
description: Overview of Architect's plugin API
---

Architect's plugin API exposes [workflow lifecycle hooks][hooks] (such filesystem events in the [Sandbox][sandbox]) and interfaces for [generating cloud resources][setters] (such as custom Lambdas, or environment variables).

This document assumes some existing knowledge of how Architect works, including the [project manifest][manifest], [deterministic deployment][deployment] to AWS via CloudFormation, etc.


## Finding & installing plugins

[Architect maintains a list of officially supported and community developed plugins](https://github.com/architect/plugins); npm is also a great place to [find plugins](https://www.npmjs.com/search?q=arc-plugin-) (and [legacy macros][macros]).

To install a plugin, add a [`@plugins` pragma][plugins] to your [project manifest][manifest]. For example, if you wanted to `npm install` and use both `@architect/plugin-typescript` and `arc-macro-cors`, this is what you'd add to your manifest:

```arc
@plugins
architect/plugin-typescript # note: leading @ must be removed from namespaced packages
arc-macro-cors
```

You can also use unpublished local plugins like so:

```arc
@plugins
my-private-plugin       # loads from `src/plugins/my-private-plugin[.[m]js|/index.[m]js]`
another-private-plugin  # loads from `foo/index.js`
  src foo
```


## Authoring plugins

Architect provides a suite of workflows, conventions, and optimized defaults for building excellent functional web apps with AWS. Architect plugins enable developers to extend (or override) this functionality in a variety of ways with interfaces into both workflows and resource creation.

To create a fresh plugin, you can run `npx arc create --plugin my-plugin-name`

Learn more about [hooks for workflow lifecycles][hooks] and [cloud resource generation][setters] below.


### Workflow hooks

Workflow hooks enable developers to extend Architect workflows and hook into the various Architect CLI commands.

- [`deploy`](./deploy) - hooks for [the `deploy` command][deploy]
  - [`start`](./deploy#deploy.start) - run arbitrary pre-deploy operations like adding custom resources or modifying first-class Architect-created resources by customizing CloudFormation (formerly `@macros`)
  - [`services`](./deploy#deploy.services) - hook into Architect's service discovery to create runtime references to custom resources, or populate config data
  - [`target`](./deploy#deploy.target) - bypass CloudFormation deployment to AWS, and ship the project to an AWS intermediary
  - [`end`](./deploy#deploy.end) - run arbitrary post-deploy operations
- [`create`](./create) - hooks for [the `init` command][init]
  - [`register`](./create#create.register) - register runtimes to create handlers for
  - [`handlers`](./create#create.handlers) - dynamically generate new runtime handlers as you expand your project
- [`hydrate`](./hydrate) - hooks for [the `hydrate` command][hydrate]
  - [`copy`](./hydrate#hydrate.copy) - copy files and folders during [dependency hydration][hydrate]
- [`sandbox`](./sandbox) - hooks for [the `sandbox` command][sandbox]
  - [`start`](./sandbox#sandbox.start) - run arbitrary operations during [Sandbox][sandbox] startup
  - [`watcher`](./sandbox#sandbox.watcher) - act on project filesystem events (e.g. `src/http/get-foo/auth.js` → `updated`)
  - [`end`](./sandbox#sandbox.end) - run arbitrary operations during [Sandbox][sandbox] shutdown


### Resource setters

Resource setters are small, synchronous methods that enable the rapid programmatic creation of various Architect resources, ranging from HTTP routes, to environment variables, to custom runtimes.

Any Lambdas or resources defined by setters is treated by Architect as a first-class primitive, as though it was built into Architect itself.

- [Pragmas](/docs/en/guides/plugins/set#pragmas)
  - [`events`](/docs/en/guides/plugins/set#set.events) - register async events
  - [`http`](/docs/en/guides/plugins/set#set.http) - register HTTP routes
  - [`queues`](/docs/en/guides/plugins/set#set.queues) - register async event queues
  - [`scheduled`](/docs/en/guides/plugins/set#set.scheduled) - register scheduled events
  - [`tables-streams`](/docs/en/guides/plugins/set#set%5B'tables-streams'%5D) - register DynamoDB event streams
  - [`ws`](/docs/en/guides/plugins/set#set.ws) - register WebSocket routes
- [Resources](/docs/en/guides/plugins/set#resources)
  - [`env`](/docs/en/guides/plugins/set#set.env) - register environment variables
  - [`customLambdas`](/docs/en/guides/plugins/set#set.customLambdas) - register bare Lambdas without a pre-associated event source
  - [`runtimes`](/docs/en/guides/plugins/set#set.runtimes) - register custom runtimes


## Publishing plugins

Should you opt to publish your plugin for others to use – and we hope you will! – they should be published to `npm` with the following naming convention: `arc-plugin-{your unique plugin name}`.

Official plugins by Architect maintainers are published under the `@architect` org as `@architect/plugin-{plugin name}`.


## Macros

Long-time Architect users may be familiar with macros (`@macros` – extensions that enable customization of CloudFormation at deploy time). Macros are forward-compatible with plugins, but are no longer the preferred way of customizing CloudFormation.

**Existing macros will continue to work indefinitely; you do not need to update them to the new plugins API.** However, the macros API is no longer receiving updates, whereas the [`deploy.start` plugin API](./deploy) has new features that you may find helpful.

[Learn more about porting existing macros to plugins](./porting-macros-to-plugins).

If you have existing macros, they can live side by side in their respective pragma (so long as plugins and macros do not have any conflicting names):

```arc
@plugins
my-private-plugin

@macros
my-private-macro
```

[hooks]: #workflow-hooks
[sandbox]: ../../reference/cli/sandbox
[plugins]: ../../reference/project-manifest/plugins
[setters]: #resource-setters
[manifest]: ../../get-started/project-manifest
[deployment]: ../developer-experience/deployment 
[macros]: #macros
[hydrate]: ../../reference/cli/hydrate
[deploy]: ../../reference/cli/deploy
[init]: ../../reference/cli/init
