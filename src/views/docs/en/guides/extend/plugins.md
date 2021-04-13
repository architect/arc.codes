---
title: Plugins (beta)
description: How to extend Architect using lifecycle hooks
---

> ⚠️ NOTE: Plugin support was added in version 8.5.0, is currently in beta and the interface is subject to change

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
    3. [`variables`](#variables)
    4. [`sandbox.start`](#sandbox.start)
    5. [`sandbox.end`](#sandbox.end)
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

> In the example above running any `arc` commands will look for `./src/plugins/myplugin` and then `./node_modules/myplugin`

## Interface

Plugin authors should create a module that exports an object with properties of the object being different functions that hook into core Architect capabilities.

```javascript
 /**
  * Starter plugin template
  */

module.exports = {
  package: async function extendCloudFormation ({ arc, cloudformation, stage='staging', inventory }) {},
  pluginFunctions: function ({ arc, inventory }) {},
  variables: function ({ arc, stage, inventory }) {},
  sandbox: {
    start: async function ({ arc, inventory, services }) {},
    end: async function ({ arc, inventory, services }) {}
  }
}
```

A deep dive into the [`package`](#package), [`pluginFunctions`](#pluginFunctions), [`variables`](#variables), [`sandbox.start`](#sandbox.start) and [`sandbox.end`](#sandbox.end) methods follows.

### `package`

> `package({ arc, cloudformation, stage, inventory })`

This method encapsulates [Architect's existing @macro functionality][macros]: extending Architect's generated CloudFormation `sam.json` with your own custom extensions.

**As a plugin author, if you intend for your plugin to create custom Lambdas**, you would be expected to leverage the plugin author helper method [`createLambdaJSON` described below](#createLambdaJSON) to painlessly create CloudFormation-compatible JSON representing your new cloud functions. You must also implement the [`pluginFunctions`](#pluginFunctions) plugin interface method to inform Architect of new Lambdas you are creating.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`cloudformation`|The [CloudFormation JSON template][cfn-ref] making up the Architect project|
|`stage`|The name of the environment; usually one of `staging` or `production`|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|

#### Returns

You _must_ return the `cloudformation` argument after modifying it with your own extensions.

### `pluginFunctions`

> `pluginFunctions({ arc, inventory })`

The plugin author must implement this method if the plugin defines new Lambda functions. This method is used by Architect to allow your custom plugin Lambdas to hook into Architect's capabilities and lifecycle, such as:

- instructing [`arc create`][create] to create new files and directories in the project for your custom plugin Lambdas
- instructing [`arc hydrate`][hydrate] to hydrate dependencies in the project for your custom plugin Lambdas
- providing hints to [`arc logs`][logs] as to where to find CloudWatch execution logs for your custom plugin Lambdas

#### Arguments

All arguments arrive as a bag of options with the following properties:

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

- `src`: a string containing a fully qualified absolute path to the source code location for the Lambda function. Relative to the arc project root, this property _must_ point to a location under the project's `src/` directory.
- `body`: a string containing template code for the Lambda function handler

#### Example `pluginFunctions` Implementation

```javascript
let path = require('path')

module.exports = {
  pluginFunctions: function ({ arc, inventory }) {
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

### `variables`

> `variables({ arc, cloudformation, stage, inventory })`

The plugin author should implement this method if the plugin would like to provide any manner of data to Lambda functions at runtime. For context, Architect provides a suite of runtime helpers in the form of its [`@architect/functions`][functions] library. This library leverages functionality provided by [`deploy`][deploy] and [`sandbox`][sandbox] to expose runtime variables enabling [service discovery][discovery] - the automatic configuration, search and discovery of infrastructure and services making up your application. The `variables` plugin method enables plugin authors to hook into the Architect service discovery mechanism.

This method is used by Architect in two situations:

1. When running in a local development context via [`sandbox`][sandbox], `sandbox` will invoke the `variables` method in order to compile all runtime variables required by Architect application plugins and provide them to [`@architect/functions`][functions].
2. When running in a remotely-deployed context on AWS, [`deploy`][deploy] will invoke the `variables` method in order to compile an [AWS SSM Parameter][ssm] per variable exported by the method before each deploy. Then, post-`deploy` at runtime, [`@architect/functions`][functions] will query the [AWS SSM Parameter Store][ssm] to retrieve these variables at runtime.

Therefore the `variables` plugin method is only necessary to implement if you would like your plugin to provide runtime data within Lambdas via the [`@architect/functions`][functions] library. The exported variables would be available via the [`services` function][services] provided by [`@architect/functions`][functions] (namespaced under the plugin name). For more information on how to query the service discovery mechanism using [`@architect/functions`][functions] at runtime, check out the [`@architect/functions` `services` documentation][services].

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`cloudformation`|The [CloudFormation JSON template][cfn-ref] making up the Architect project|
|`stage`|The name of the environment; usually one of `testing`, `staging` or `production`; `testing` is provided when running in a [`sandbox`][sandbox] context whereas `staging` and `production` are provided at Architect CLI runtime when either `arc deploy staging` or `arc deploy production` are invoked, respectively|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|

#### Returns

This method should always return an object. Each property on the object represents a variable name, and the value for each property contains the variable value.

> 🏌️‍♀️ Protip: When this method is invoked in a pre-`deploy` context, acceptable values for the variables include CloudFormation JSON. This is essential to expose CloudFormation-managed infrastructure.

#### Example `variables` Implementation

For example, a `variables` return value for a plugin creating a new S3 Bucket may export variables related to the location of and credentials for the bucket:

```javascript
module.exports = {
  variables: function ({ arc, cloudformation, stage, inventory }) {
    if (!arc['myS3Bucket']) return {} // if the user isn't using this plugin, return an empty object signifying no variables need exporting
    const isLocal = stage === 'testing' // stage will equal 'testing' when running in sandbox, otherwise will be one of 'staging' or 'production'
    const bucketName = `${arc.app}-newS3Bucket`
    return {
      bucketName,
      accessKey: isLocal ? 'S3RVER' : { Ref: 'MyS3BucketCreds' },
      secretKey: isLocal ? 'S3RVER' : { 'Fn::GetAtt': [ 'MyS3BucketCreds', 'SecretAccessKey' ] }
    }
  }
}
```

Note that when running locally, we provide some dummy set of credentials that the plugin could hard-code and check for when implementing the plugin [`sandbox.start`](#sandbox.start) method. Otherwise, when running in a pre-`deploy` context, we return CloudFormation JSON pointing to credentials the plugin could add to CloudFormation Resources when implementing the plugin [`package`](#package) method.

The variables are namespaced on the [`@architect/functions`' `services()`][services] returned object under a property equalling the plugin name; check out the [`services`][services] documentation for more details.

#### Example Service Discovery Usage With `@architect/functions`

How would a plugin consumer use these variables at runtime in their own application? Let's take a look at the below example, which builds upon the S3 Bucket example from the above previous section. It demonstrates one possible [`@http`][http] GET route implementation rendering a form allowing a user to upload to the plugin-generated S3 Bucket:

```javascript
let arc = require('@architect/functions')
let form = require('./form') // helper that creates a form element we can render for users to upload their assets to our S3 bucket
let aws = require('aws-sdk')

exports.handler = arc.http.async(async function getIndex (req) {
  const services = await arc.services()
  const { bucketName, accessKey, secretKey } = services.imagebucket // plugin variables are namespaced under the plugin name; here we assume the plugin name is called 'imagebucket'
  const region = process.env.AWS_REGION
  const upload = form({ bucketName, accessKey, secretKey, region })
  const s3 = new aws.S3
  const images = await s3.listObjects({ Bucket: bucketName, Prefix: 'thumb/' }).promise()
  const imgTags = images.Contents.map(i => i.Key.replace('thumb/', '/img/')).map(i => `<img src="${i}" />`).join('\n')
  return {
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: `<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Hi! Upload something directly from the browser to the S3 bucket:</h1>
    ${upload}
    <h1>And here are all the previously uploaded images:</h1>
    ${imgTags}
  </body>
</html>`
  }
})
```

### `sandbox.start`

> `start({ arc, inventory, services }, callback)`

The plugin author must implement this method if the plugin wants to hook into the startup routine for [`sandbox`][sandbox]. This would allow plugin authors to emulate the cloud services their plugin provides in order to provide a local development experience for consumers of their plugin. It would also allow to modify behaviour of [`sandbox`][sandbox]'s built-in local development services for [`@http`][http], [`@events`][events], [`@queues`][queues] and [`@tables`][tables] via the `services` argument.

This method can either be `async` or not; if the plugin author implements it as `async`, then the final `callback` argument may be ignored. Otherwise, the `callback` argument should be invoked once the plugin's sandbox service is ready.

A helper method [`invokeLambda` (described below)](#invokeLambda) is provided by the [`@architect/sandbox`](https://npmjs.com/package/@architect/sandbox) package in order to allow plugin authors to invoke specific Lambdas from their plugin sandbox service code.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`services`|[`sandbox`][sandbox] runs [local in-memory servers to mock out http, events, queues and database functionality](https://github.com/architect/sandbox/blob/master/src/sandbox/index.js#L19-L24); if you need to modify these services, use this argument|
|`callback`|Can be ignored if the method implementation is an `async function`; otherwise, `callback` must be invoked once the plugin's local development `sandbox` service is ready|

#### Example `start` Implementation

An example is [provided below that leverages the `invokeLambda` helper method](#invokeLambda).

### `sandbox.end`

> `end({ arc, inventory, services }, callback)`

If the plugin author implements the [`sandbox.start`](#sandbox.start) method, then they must also implement the `sandbox.end` method. This method gives the plugin the opportunity to gracefully shut down any services powering local development support of the plugin.

This method can either be `async` or not; if the plugin author implements it as `async`, then the final `callback` argument may be ignored. Otherwise, the `callback` argument should be invoked once the plugin's sandbox service is ready.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`services`|[`sandbox`][sandbox] runs [local in-memory servers to mock out http, events, queues and database functionality](https://github.com/architect/sandbox/blob/master/src/sandbox/index.js#L19-L24); if you need to modify these services, use this argument|
|`callback`|Can be ignored if the method implementation is an `async function`; otherwise, `callback` must be invoked once the plugin's local development `sandbox` service has been shut down|


## Helper Methods for Plugin Authors

For common Architect Plugin use cases, Architect provides a few helper functions available in core Architect packages to make life easier for plugin authors.

### `createLambdaJSON`

> `createLambdaJSON({ inventory, src })`

Available in the [`@architect/package`](https://npmjs.com/package/@architect/package) module (in version 6.2.0 and later), this method can be leveraged inside a plugin's [`package`](#package) method in order to easily and consistently define CloudFormation JSON representing Lambdas created by the plugin.

Leveraging this helper method gives the plugin function support for [arc's per-function runtime configuration via the `config.arc` file](https://arc.codes/docs/en/reference/config.arc/aws) transparently.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`src`|A string representing the path where code for the Lambda exists locally|

#### Returns

A tuple (array of two objects) containing:

1. A string representing an AWS-friendly Lambda resource name (which is based on the path to the function code), and
2. A JSON object that can be assigned to a CloudFormation `sam.json`'s `Resources` section. This would define a Lambda that Architect would create during a [`deploy`][deploy]

#### Example Usage of `createLambdaJSON`

```javascript
let createLambdaJSON = require('@architect/package/createLambdaJSON')
let path = require('path')

module.exports = {
  package: async function IoTRulesLambdas ({ arc, cloudformation, stage = 'staging', inventory }) {
    if (arc.rules) {
      const cwd = inventory.inv._project.src
      arc.rules.forEach(rule => {
        let code = path.join(cwd, 'src', 'rules', rule[0])
        let [functionName, functionDefn] = createLambdaJSON({ inventory, src: code })
        cloudformation.Resources[functionName] = functionDefn
      })
    }
    return cloudformation
  }
}
```

### `invokeLambda`

> `invokeLambda({ inventory, src, payload }, callback)`

Available in the [`@architect/sandbox`](https://npmjs.com/package/@architect/sandbox) module (in version 3.4.0 and later), this method can be leveraged inside a plugin's [`sandbox.start`](#sandbox.start) method in order to easily invoke project Lambdas locally within an [`arc sandbox`][sandbox] local development runtime context.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`src`|A string representing the path where code for the Lambda exists locally|
|`payload`|JSON payload to deliver to the function|
|`callback`|Function with signature `function(error, result)` that is invoked with either the error or the result from the local function invocation|

#### Example Usage of `invokeLambda`

```javascript
let invokeLambda = require('@architect/sandbox/invokeLambda')
let path = require('path')
let prompt = require('prompt')

module.exports = {
  pluginFunctions: async function ({ arc, inventory }) {
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
    start: function IoTRulesServiceStart ({ arc, inventory, services }, callback) {
      let rules = module.exports.pluginFunctions({ arc, inventory }).map(rule => rule.src)
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
          invokeLambda({ inventory, src: response.rule, payload: response.payload }, function (err, result) {
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

- [plugin-iot-rules](https://www.npmjs.com/package/@copper/plugin-iot-rules): adds AWS IoT Topic event Lambdas
- [plugin-parcel](https://www.npmjs.com/package/@copper/plugin-parcel): compiles project Lambda code with the Parcel bundler both during local development via [`sandbox`][sandbox] and before [`deploy`s][deploy]
- [arc-plugin-s3-image-bucket](https://www.npmjs.com/package/arc-plugin-s3-image-bucket): manages an S3 bucket purpose-built for allowing direct-from-user image uploads, includes support for customizable Lambda triggers based on bucket events

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
[functions]: ../../reference/runtime/node
[services]: ../../reference/runtime/node#arc.services
[cfn-ref]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html
[discovery]: https://en.wikipedia.org/wiki/Service_discovery
[ssm]: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
