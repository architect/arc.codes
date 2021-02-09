---
title: Architect Plugins
description: How to extend Architect using lifecycle hooks
---

Using [`@macros`][macros] allows you to augment the Architect-generated CloudFormation before deployment. However, augmenting CloudFormation may not be sufficient for certain extensions. For example, if you want to extend Architect with:

- Your own custom Lambda integrations (e.g. Kinesis Stream or Lex conversation bot) and want Architect to create, hydrate and be able to retrieve the logs for these functions
- A better local development experience for your extension by hooking into the Architect [`sandbox`][sandbox]

Architect `@plugins` solves these use cases by providing a variety of [interfaces](#interface) that plugin authors may implement to hook into various Architect capabilities.

> Architect Plugins are backwards-compatible with [`@macros`][macros]

## Table of Contents

1. [Installation](#installation)
2. [Interface](#interface)
    1. [`package`](#package)
    2. [`pluginFunctions`](#pluginfunctions)
    3. [`sandbox.start`](#sandbox.start)
    4. [`sandbox.end`](#sandbox.end)
3. [Helper Methods for Plugin Authors](#helper-methods-for-plugin-authors)
    1. [`createLambdaJSON`](#createlambdajson)
    2. [`invokeLambda`](#invokelambda)
4. [Example Plugins](#example-plugins)

## Installation

Similar to [`@macros`][macros], Architect will look for any `@plugins` in `src/plugins` or the project root `node_modules`. An app opts into using `@plugins` by adding them to `app.arc`:

```arc
@app
myapp

@plugins
myplugin
```

> In the example above running `arc deploy` will look for `./src/plugins/myplugin` and then `./node_modules/myplugin`

## Interface

Plugin authors should create a module that exports an object with properties of the object being different functions that hook into core Architect capabilities.

```javascript
 /**
  * Starter plugin template
  */

module.exports = {
  package: async function extendCloudFormation (arc, sam, stage='staging', inventory) {
  },
  pluginFunctions: function (arc, inventory) {
  },
  sandbox: {
    start: async function (arc, inventory, builtInSandboxServices) {
    },
    end: async function (arc, inventory, builtInSandboxServices) {
    }
  }
}
```

A deep dive into the [`package`](#package), [`pluginFunctions`](#pluginFunctions), [`sandbox.start`](#sandbox.start) and [`sandbox.end`](#sandbox.end) methods follows.

### `package`

> `package(arc, sam, stage, inventory)`

This method encapsulates [Architect's existing @macro functionality][macros]: extending Architect's generated CloudFormation `sam.json` with your own custom extensions.

**As a plugin author, if you intend for your plugin to create custom Lambdas**, you would be expected to leverage the plugin author helper method [`createLambdaJSON` described below](#createLambdaJSON) to painlessly create CloudFormation-compatible JSON representing your new cloud functions. You must also implement the [`pluginFunctions`](#pluginFunctions) plugin interface method.

#### Arguments

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`sam`|The [CloudFormation JSON template][cfn-ref] making up the Architect project|
|`stage`|The name of the environment; usually one of `staging` or `production`|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|

#### Returns

You _must_ return the `sam` argument after modifying it with your own extensions.

### `pluginFunctions`

> `pluginFunctions(arc, inventory)`

The plugin author must implement this method if the plugin defines new Lambda functions. This method is used by Architect to allow your custom plugin Lambdas to hook into Architect's capabilities and lifecycle, such as:

- instructing [`arc create`][create] to create new files and directories in the project for your custom plugin Lambdas
- instructing [`arc hydrate`][hydrate] to hydrate dependencies in the project for your custom plugin Lambdas
- providing hints to [`arc logs`][logs] as to where to find CloudWatch execution logs for your custom plugin Lambdas

#### Arguments

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|

#### Returns

You should return an array of objects, each object representing a new Lambda being defined by the plugin. Each object should have the following format:

```javascript
{
  src: '/Users/filmaj/src/my-arc-project/src/rules/rule-one',
  body: 'exports.handler = async function (ruleEvent) { console.log(ruleEvent) }'
}
```

- `src`: a string containing a fully qualified absolute path to the source code location for the Lambda function.
- `body`: a string containing template code for the Lambda function handler

#### Example `pluginFunctions` Implementation

```javascript
let path = require('path')

module.exports = {
  pluginFunctions: function (arc, inventory) {
    if (!arc.rules) return [] // if plugin author didnt define @rules lambdas, return empty array signifying no new lambdas to add
    const cwd = inventory.inv._project.src
    return arc.rules.map((rule) => {
      let rulesSrc = path.join(cwd, 'src', 'rules', rule[0])
      return {
        src: rulesSrc,
        body: `exports.handler = async function (event) {
  console.log(event);
};`
      }
    })
  }
}
```

The above would instruct Architect to look for functions under `src/rules/<function>` inside the project directory hierarchy. With the above `pluginFunctions` method and given `app.arc` contents like so:

```
@rules
rule-one
rule-two
```

... running:

- [`arc create`][create] would create the folders `src/rules/rule-one` and `src/rules/rule-two`, with `index.js` files in each containing the contents of the `body` returned by `pluginFunctions`
- [`arc hydrate`][hydrate] would hydrate the above two folders
- [`arc logs src/rules/rule-one`][logs] would pull in any deployed-to-staging execution logs for the `rule-one` function

### `sandbox.start`

> `start(arc, inventory, builtInSandboxServices, callback)`

The plugin author must implement this method if the plugin wants to hook into the startup routine for [`sandbox`][sandbox]. This would allow plugin authors to emulate the cloud services their plugin provides in order to provide a local development experience for consumers of their plugin. It would also allow to modify behaviour of [`sandbox`][sandbox]'s built-in local development services for [`@http`][http], [`@events`][events], [`@queues`][queues] and [`@tables`][tables] via the `builtInSandboxServices` argument.

This method can either be `async` or not; if the plugin author implements it as `async`, then the final `callback` argument may be ignored. Otherwise, the `callback` argument should be invoked once the plugin's sandbox service is ready.

A helper method [`invokeLambda` (described below)](#invokeLambda) is provided by the [`@architect/sandbox`](https://npmjs.com/package/@architect/sandbox) package in order to allow plugin authors to invoke specific Lambdas from their plugin sandbox service code.

#### Arguments

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`builtInSandboxServices`|[`sandbox`][sandbox] runs [local in-memory servers to mock out http, events, queues and database functionality](https://github.com/architect/sandbox/blob/master/src/sandbox/index.js#L19-L24); if you need to modify these services, use this argument|
|`callback`|Can be ignored if the method implementation is an `async function`; otherwise, `callback` must be invoked once the plugin's local development `sandbox` service is ready|

#### Example `start` Implementation

An example is [provided below that leverages the `invokeLambda` helper method](#invokeLambda).

### `sandbox.end`

> `end(arc, inventory, builtInSandboxServices, callback)`

If the plugin author implements the [`sandbox.start`](#sandbox.start) method, then they must also implement the `sandbox.end` method. This method gives the plugin the opportunity to gracefully shut down any services powering local development support of the plugin.

This method can either be `async` or not; if the plugin author implements it as `async`, then the final `callback` argument may be ignored. Otherwise, the `callback` argument should be invoked once the plugin's sandbox service is ready.

#### Arguments

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`builtInSandboxServices`|[`sandbox`][sandbox] runs [local in-memory servers to mock out http, events, queues and database functionality](https://github.com/architect/sandbox/blob/master/src/sandbox/index.js#L19-L24); if you need to modify these services, use this argument|
|`callback`|Can be ignored if the method implementation is an `async function`; otherwise, `callback` must be invoked once the plugin's local development `sandbox` service has been shut down|


## Helper Methods for Plugin Authors

For common Architect Plugin use cases, Architect provides a few helper functions available in core Architect packages to make life easier for plugin authors.

### `createLambdaJSON`

> `createLambdaJSON(inventory, pathToPluginCloudFunction)`

Available in the [`@architect/package`](https://npmjs.com/package/@architect/package) module, this method can be leveraged inside a plugin's [`package`](#package) method in order to easily and consistently define CloudFormation JSON representing Lambdas created by the plugin.

Leveraging this helper method gives the plugin function support for [arc's per-function runtime configuration via the `config.arc` file](https://arc.codes/docs/en/reference/config.arc/aws) transparently.

#### Arguments

|Argument|Description|
|---|---|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`pathToPluginCloudFunction`|a string representing the path where code for the Lambda exists locally|

#### Returns

A tuple (array of two objects) containing a string representing an AWS-friendly Lambda resource name (based on the path to the function code), and a JSON object that can be assigned to a CloudFormation `sam.json`'s `Resources` section. This would define a Lambda that Architect would create during a [`deploy`][deploy].

#### Example Usage of `createLambdaJSON`

```javascript
let createLambdaJSON = require('@architect/package/createLambdaJSON')
let path = require('path')

module.exports = {
  package: async function IoTRulesLambdas (arc, cfn, stage = 'staging', inventory) {
    if (arc.rules) {
      const cwd = inventory.inv._project.src
      arc.rules.forEach(rule => {
        let code = path.join(cwd, 'src', 'rules', rule[0])
        let [functionName, functionDefn] = createLambdaJSON(inventory, code)
        cfn.Resources[functionName] = functionDefn
      })
    }
    return cfn
  }
}
```

### `invokeLambda`

> `invokeLambda(pathToPluginCloudFunction, payload, callback)`

Available in the [`@architect/sandbox`](https://npmjs.com/package/@architect/sandbox) module, this method can be leveraged inside a plugin's [`sandbox.start`](#sandbox.start) method in order to easily invoke project Lambdas locally within an [`arc sandbox`][sandbox] local development runtime context.

#### Arguments

|Argument|Description|
|---|---|
|`pathToPluginCloudFunction`|a string representing the path where code for the Lambda exists locally|
|`payload`|JSON payload to deliver to the function|
|`callback`|function with signature `function(error, result)` that is invoked with either the error or the result from the local function invocation|

#### Example Usage of `invokeLambda`

```javascript
let path = require('path')
let prompt = require('prompt')

module.exports = {
  pluginFunctions: async function (arc, inventory) {
    if (!arc.rules) return []
    const cwd = inventory.inv._project.src
    return arc.rules.map((rule) => {
      let rulesSrc = path.join(cwd, 'src', 'rules', rule[0])
      return {
        src: rulesSrc,
        body: `exports.handler = async function (event) {
  console.log(event)
}`
      }
    })
  },
  sandbox: {
    start: function IoTRulesServiceStart (arc, inventory, builtInSandboxServices, callback) {
      let rules = module.exports.pluginFunctions(arc, inventory).map(rule => rule.src)
      process.stdin.on('keypress', async function IoTRulesKeyListener (input, key) {
        if (input === 'I') {
          const response = await prompt([ {
            type: 'select',
            name: 'rule',
            message: 'Which IoT Rule do you want to trigger an event for?',
            choices: rules
          }, {
            type: 'input',
            name: 'payload',
            message: 'Type out the JSON payload you want to deliver to the rule (must be valid JSON!):',
            initial: '{}',
            validate: function (i) {
              try {
                JSON.parse(i)
              }
              catch (e) {
                return e.message
              }
              return true
            },
            result: function (i) {
              return JSON.parse(i)
            }
          } ])
          invokeLambda(response.rule, response.payload, function (err, result) {
            if (err) console.error(`Error invoking lambda ${response.rule}!`, err)
            else console.log(`${response.rule} invocation result:`, result)
          })
        }
      })
      console.log('IoT Rules Sandbox Service Started; press "I" (capital letter) to trigger a rule.')
      callback()
    }
  }
}
```

The above plugin's `sandbox.start` method listens for the "I" keyboard keypress, prompts the user asking which of the plugin's Lambdas the user wants to invoke and what payload to deliver to the user, before using `invokeLambda` to invoke the Lambda code with the specified payload.

## Example Plugins

- [plugin-iot-rules](https://github.com/copperinc/macro-iot-rules/tree/plugins): a plugin adding AWS IoT Topic event Lambdas

[inv]: https://github.com/architect/inventory
[macros]: custom-cloudformation
[http]: ../../reference/app.arc/http
[events]: ../../reference/app.arc/events
[queues]: ../../reference/app.arc/queues
[tables]: ../../reference/app.arc/tables
[sandbox]: ../../reference/cli/sandbox
[create]: ../../reference/cli/init
[hydrate]: ../../reference/cli/hydrate
[logs]: ../../reference/cli/logs
[deploy]: ../../reference/cli/deploy
[cfn-ref]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html

