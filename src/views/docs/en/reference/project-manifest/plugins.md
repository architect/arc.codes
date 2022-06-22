---
title: '<code>@plugins</code>'
category: app.arc
description: Extend Architect app functionality and programmatically generate resources
---

Extend the functionality of your Architect app with `@plugins`.

Architect’s plugin API exposes [workflow lifecycle hooks](/docs/en/guides/plugins/overview#workflow-hooks) (such filesystem events in the [Sandbox](/docs/en/reference/cli/sandbox)) and interfaces for [generating cloud resources](/docs/en/guides/plugins/overview#resource-setters) (such as custom Lambdas, or environment variables).

Plugins can also be used to [customize your AWS deployment via CloudFormation](../../guides/developer-experience/custom-cloudformation), enabling access to cloud resources outside of Architect's built-ins.


## Getting started

Create an inert plugin at `src/plugins/my-plugin.js` by running `npx arc init --plugin my-plugin`. Then add the `@plugins` pragma to your project manifest:

<arc-viewer default-tab=arc>
<div slot=contents>

<arc-tab label=arc>
<h5>arc</h5>
<div slot=content>

```arc
@app
testapp

@plugins
my-plugin
```
</div>
</arc-tab>

<arc-tab label=json>
<h5>json</h5>
<div slot=content>

```json
{
  "app": "testapp",
  "plugins": [
    "my-plugin"
  ]
}
```
</div>
</arc-tab>

<arc-tab label=yaml>
<h5>yaml</h5>
<div slot=content>

```yaml
---
app: testapp

plugins:
- my-plugin
```
</div>
</arc-tab>

</div>
</arc-viewer>


## Plugin locations

Plugins can be private to your project, or [installed as a dependency from npm](https://www.npmjs.com/search?q=arc-plugin-). Architect will automatically attempt to find each named plugin in the following four locations:

- `src/plugins/{plugin name}.js`
- `src/plugins/{plugin name}/index.js`
- `node_modules/{plugin name}/`
- `node_modules/@{plugin name}/`


## Plugin namespace

`@plugins` can be used alongside [`@macros`](./macros) in the same project, however they share the same namespace. Consequently, a plugin and macro cannot share the same name. For example, the following project would error upon startup:

```arc
@app
testapp

@plugins
s3-events

@macros
s3-events
```


## Authoring plugins

Learn more about authoring (and using) plugins [in the Architect plugins guide](/docs/en/guides/plugins/overview).
