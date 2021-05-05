---
title: Plugins (beta)
description: How to extend Architect using lifecycle hooks
---

> ⚠️ NOTE: Plugin support was added in version 8.5.0, is currently in beta, the interface is subject to change and only supports Node.js

Using [`@macros`][macros] allows you to augment the Architect-generated CloudFormation before deployment. However, augmenting CloudFormation may not be sufficient for certain extensions. For example, if you want to extend Architect with:

- Your own custom Lambda integrations (e.g. Kinesis Stream or Lex conversation bot) and want Architect to [`create`][create], [`hydrate`][hydrate] and be able to retrieve the [`logs`][logs] for these functions
- A better local development experience for your extension by hooking into the Architect [`sandbox`][sandbox]

Architect `@plugins` solves these use cases by providing a variety of [interfaces](#interface) that plugin authors may implement to hook into various Architect capabilities.

> Architect Plugins are backwards-compatible with [`@macros`][macros]

## Table of Contents

1. [Installation](#installation)
2. [Interface](#interface)
    1. [`package`](#package)
    2. [`functions`](#functions)
    3. [`variables`](#variables)
    4. [`sandbox.start`](#sandbox.start)
    5. [`sandbox.end`](#sandbox.end)
3. [Helper Methods for Plugin Authors](#helper-methods-for-plugin-authors)
    1. [`createFunction`](#createfunction)
    2. [`invokeFunction`](#invokefunction)
4. [Example Plugins](#example-plugins)

## Installation

Similar to [`@macros`][macros], Architect will look for any `@plugins` in `src/plugins` or the project root `node_modules`. An app opts into using `@plugins` by adding them to `app.arc`:

```arc
@app
myapp

@plugins
myplugin
```

In the example above running any `arc` commands will look for `./src/plugins/myplugin`, `./src/plugins/myplugin.js`, `./node_modules/myplugin` and finally `./node_modules/@myplugin`. The `myplugin` entry in this example is assumed to be the _plugin name_.

## Interface

Plugin authors should create a module that exports an object with properties of the object being different functions that hook into core Architect capabilities.

```javascript
 /**
  * Starter plugin template
  */

module.exports = {
  package: function ({ arc, cloudformation, stage='staging', inventory, createFunction }) {},
  functions: function ({ arc, inventory }) {}, // also aliased to `pluginFunctions`
  variables: function ({ arc, stage, inventory }) {},
  sandbox: {
    start: function ({ arc, inventory, invokeFunction, services }) {},
    end: function ({ arc, inventory, services }) {}
  }
}
```

A deep dive into the [`package`](#package), [`functions`](#functions), [`variables`](#variables), [`sandbox.start`](#sandbox.start) and [`sandbox.end`](#sandbox.end) methods follows.

### `package`

> `package({ arc, cloudformation, stage, inventory, createFunction })`

This method encapsulates [Architect's existing @macro functionality][macros]: extending Architect's generated CloudFormation `sam.json` with your own custom extensions. The additional capability provided by `@plugins` over `@macros` is that `@plugins` provide a convenient way for your extension to define its own ephemeral cloud functions (AWS Lambdas). Plugin authors wanting to manage cloud functions in their plugins would:

1. Leverage the convenience method [`createFunction`](#createfunction), which is injected as a parameter into `package`, to create CloudFormation JSON defining the AWS Lambda resources you want to manage within your plugin, and
2. Implement the [`functions`](#functions) plugin interface method to inform Architect of new Lambdas you are creating.

This method can be implemented as an `async` function or not.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`cloudformation`|The [CloudFormation JSON template][cfn-ref] making up the Architect project|
|`stage`|The name of the environment; usually one of `staging` or `production`|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`createFunction`|A helper method for creating CloudFormation Resource JSON defining any cloud functions (AWS Lambdas) your plugin manages. Please see the [`createFunction`](#createfunction) section for details on this method.|

#### Returns

You _must_ return the `cloudformation` argument after modifying it with your own extensions.

### `functions`

> `functions({ arc, inventory })`
> `pluginFunctions({ arc, inventory })`

The plugin author must implement this method if the plugin defines new Lambda functions. This method is used by Architect to allow your custom plugin Lambdas to hook into Architect's capabilities and lifecycle in a variety of ways:

- instructing [`arc create`][create] to create new files and directories in the project for your custom plugin Lambdas
- instructing [`arc hydrate`][hydrate] to hydrate dependencies of your custom plugin Lambdas
- instructing [`arc logs`][logs] as to where CloudWatch execution logs for your custom plugin Lambdas are located

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|

#### Returns

`functions` should return an array of objects, each object representing a new Lambda being defined by the plugin. Each object should have the following format:

```javascript
{
  src: '/Users/filmaj/src/my-arc-project/src/rules/rule-one',
  body: 'exports.handler = async function (ruleEvent) { console.log(ruleEvent) }'
}
```

- `src`: a string containing the fully qualified absolute path to the source code location for the Lambda function. This path _must_ point to a location under the project's `src/` directory. See the example section below on how to assemble such a path using the base project source directory available via the `inventory` parameter.
- `body`: a string containing template code for the Lambda function handler

#### Example `functions` implementation

The following example implementation is for a plugin that allows consumers to define `@rules` Lambdas in their `app.arc` manifest:

```javascript
let path = require('path')

module.exports = {
  functions: function ({ arc, inventory }) {
    if (!arc.rules) return [] // if plugin consumer didnt define any @rules, return empty array signifying no new lambdas to add
    const cwd = inventory.inv._project.src // base project source directory
    return arc.rules.map((rule) => { // for each @rules
      let src = path.join(cwd, 'src', 'rules', rule[0]) // each @rules Lambda will exist under src/rules/<rule-name>
      return {
        src,
        body: `exports.handler = async function (event) {
  console.log(event);
};`
      }
    })
  }
}
```

The above instructs Architect's various capabilities to interact with cloud functions under the `src/rules/<function>` directory inside the project hierarchy. With the above `functions` method and given `app.arc` contents like so:

```
@rules
rule-one
rule-two
```

... running:

- [`arc create`][create] would create the folders `src/rules/rule-one` and `src/rules/rule-two`, with `index.js` files in each containing the contents of the `body` returned by `functions`
- [`arc hydrate`][hydrate] would hydrate the above two folders
- [`arc logs src/rules/rule-one`][logs] would pull in any deployed-to-staging execution logs for the `rule-one` function

### `variables`

> `variables({ arc, cloudformation, stage, inventory })`

The plugin author should implement this method if the plugin would like to provide any manner of data to Lambda functions at runtime. For example, perhaps you would like to expose the physical ID of some AWS resource (i.e. ARN) to your runtime code so that you can interact with it using the AWS SDK.

Architect provides a suite of runtime helpers via the [`@architect/functions`][functions] library. This library leverages functionality provided by [`deploy`][deploy] and [`sandbox`][sandbox] to expose runtime variables enabling [service discovery][discovery] - the automatic configuration, search and discovery of infrastructure and services making up your application. The `variables` plugin method enables plugin authors to hook into the Architect service discovery mechanism.

The `variables` plugin method is only necessary to implement if you would like your plugin to provide runtime data within Lambdas via the [`@architect/functions`][functions] library. The exported variables would be available via the [`services` function][services] provided by [`@architect/functions`][functions] (namespaced under the plugin name). For more information on how to query the service discovery mechanism using [`@architect/functions`][functions] at runtime, check out the [`@architect/functions` `services` documentation][services].

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

> 🏌️‍♀️ Protip: When this method is invoked in a pre-`deploy` context, acceptable values for the variables include CloudFormation JSON. This is essential to expose CloudFormation-managed infrastructure; see the example below.

#### Example `variables` implementation

The following example `variables` implementation demonstrates a plugin that creates a new S3 Bucket. It may be desirable to provide variables related to the location of and credentials for the bucket:

```javascript
module.exports = {
  variables: function ({ arc, cloudformation, stage, inventory }) {
    if (!arc['myS3Bucket']) return {} // if the user isn't using this plugin, return an empty object signifying no variables need exporting
    const isLocal = stage === 'testing' // stage will equal 'testing' when running in sandbox, otherwise will be one of 'staging' or 'production' when running in a `deploy` context
    const bucketName = `${arc.app}-newS3Bucket`
    return {
      bucketName,
      accessKey: isLocal ? 'S3RVER' : { Ref: 'MyS3BucketCreds' },
      secretKey: isLocal ? 'S3RVER' : { 'Fn::GetAtt': [ 'MyS3BucketCreds', 'SecretAccessKey' ] }
    }
  }
}
```

The above example returns three variables that would be provided at runtime: `bucketName`, `accessKey` and `secretKey`. Depending on whether the plugin executes in a local development environment context via [`sandbox`][sandbox] or in a pre-`deploy` context via [`deploy`][deploy], the contents of these credentials would differ:

- The `secretKey` and `accessKey` variables would contain hard-coded values when running locally in [`sandbox`][sandbox] (both would have a value of `S3RVER`). These hard-coded values could be used by the plugin author when implementing the [`sandbox.start`](#sandbox.start) method to provide a seamless local development experience.
- The `secretKey` and `accessKey` variables are CloudFormation JSON referencing a set of credentials called `MyS3BucketCreds` when running in a pre-`deploy` context. These dynamic values reference pre-existing CloudFormation Resources which would be implemented by the author in the plugin's [`package`](#package) method.

The variables are namespaced on the [`@architect/functions`' `services()`][services] returned object under a property equalling the plugin name; check out the [`services`][services] documentation for more details.

#### Example service discovery usage with `@architect/functions`

How would a plugin consumer use these variables at runtime in their own application? Let's take a look at the below example, which builds upon the S3 Bucket example from the previous section. It demonstrates one possible [`@http`][http] GET route implementation rendering a form allowing a user to upload to the plugin-generated S3 Bucket:

```javascript
let arc = require('@architect/functions')
let form = require('./form') // helper that creates a form element we can render for users to upload their assets to our S3 bucket
let aws = require('aws-sdk')

exports.handler = arc.http.async(async function getIndex (req) {
  const services = await arc.services()
  const { bucketName, accessKey, secretKey } = services.imagebucket // plugin variables are namespaced under the plugin name; here we assume the plugin name is called 'imagebucket' and is present in the app's app.arc file as 'imagebucket' under the @plugins section
  const region = process.env.AWS_REGION
  const upload = form({ bucketName, accessKey, secretKey, region })
  const s3 = new aws.S3
  const images = await s3.listObjects({ Bucket: bucketName, Prefix: 'thumb/' }).promise()
  const imgTags = images.Contents.map(i => i.Key).map(i => `<img src="${i}" />`).join('\n')
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

> `start({ arc, inventory, invokeFunction, services }, callback)`

The plugin author must implement this method if the plugin wants to hook into the startup routine for [`sandbox`][sandbox]. This would allow plugin authors to emulate the cloud services their plugin provides in order to provide a local development experience for consumers of their plugin. It also allows modifying the behaviour of [`sandbox`][sandbox]'s built-in local development services for [`@http`][http], [`@events`][events], [`@queues`][queues] and [`@tables`][tables] via the `services` argument. Finally, a helper method [`invokeFunction` (described in more detail below)](#invokefunction) is provided as an argument in order to allow plugin authors to invoke specific Lambdas from their plugin sandbox service code.

This method can either be `async` or not; if the plugin author implements it as `async`, then the final `callback` argument may be ignored. Otherwise, the `callback` argument should be invoked once the plugin's sandbox service is ready.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`arc`|Object representing the [parsed Architect project manifest](https://github.com/architect/parser) file for the current project|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`invokeFunction`|A helper method that can be used for invoking any cloud functions (AWS Lambdas) your plugin manages during runtime in a local development context inside [`sandbox`][sandbox]. Please see the [`invokeFunction`](#invokefunction) section for details on this method.|
|`services`|An object containing `http`, `events` and `tables` properties that represent local servers that [`sandbox`][sandbox] manages to provide a local development experience. A plugin author may want to modify the behaviour of these pre-existing services in order for their plugin to provide a better local development experience. `http` is an instance of the npm package [`router`][router] and mocks API Gateway and Lambda. `events` is a Node.js HTTP server that mocks SNS and SQS by listening for JSON payloads and marshaling them to the relevant Lambda functions (see its [listener module](https://github.com/architect/sandbox/blob/master/src/events/_listener.js) for more details). `tables` is an instance of the npm package [`dynalite`][dynalite] and mocks DynamoDB.|
|`callback`|Can be ignored if the method implementation is an `async function`; otherwise, `callback` must be invoked once the plugin's local development `sandbox` service is ready|

#### Example `start` implementation

An example is [provided below that leverages the `invokeFunction` helper method](#invokefunction).

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


## Helper methods for plugin authors

For common Architect Plugin use cases, Architect provides a few helper functions available as parameters injected as arguments into plugin methods to make life easier for plugin authors.

### `createFunction`

> `createFunction({ inventory, src })`

This method should be leveraged inside a plugin's [`package`](#package) method in order to more easily define CloudFormation JSON representing Lambdas created by the plugin. Use of this method for defining Lambdas is an Architect best practice as certain specific conventions that Architect relies on can be maintained.

While the AWS Lambda logical ID is generally not a concern for developers using Architect, Architect relies on a logical ID naming convention to e.g. retrieve execution logs of a deployed Lambda via [`arc logs`][logs]. This helper method helps enforce such conventions. Leveraging this method also gives the plugin-generated Lambdas transparent support for [Architect's per-function runtime configuration via the `config.arc` file](https://arc.codes/docs/en/reference/config.arc/aws).

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`inventory`|An [Architect inventory object][inv] representing the current Architect project|
|`src`|A string representing the fully qualified absolute path to where code for the Lambda exists locally|

#### Returns

A tuple (array of two objects) containing:

1. A string representing an AWS-friendly Lambda resource name (which is based on the path to the function code), and
2. A JSON object that can be assigned to a CloudFormation `sam.json`'s `Resources` section. This would define a Lambda that Architect would create during a [`deploy`][deploy]

#### Example usage of `createFunction`

```javascript
let path = require('path')

module.exports = {
  package: async function IoTRulesLambdas ({ arc, cloudformation, createFunction, stage = 'staging', inventory }) {
    if (arc.rules) {
      const cwd = inventory.inv._project.src
      arc.rules.forEach(rule => {
        let src = path.join(cwd, 'src', 'rules', rule[0])
        let [functionName, functionDefn] = createFunction({ inventory, src })
        cloudformation.Resources[functionName] = functionDefn
      })
    }
    return cloudformation
  }
}
```

### `invokeFunction`

> `invokeFunction({ src, payload }, callback)`

This method should be leveraged inside a plugin's [`sandbox.start`](#sandbox.start) method in order to easily invoke project Lambdas locally within an [`arc sandbox`][sandbox] local development runtime context. For example, if your plugin manages Lambdas related to some AWS service, it may be nice to provide a local development experience for consumers of your plugin. To provide a great local experience, consumers of your plugin will want to exercise your plugin-generated Lambdas when running locally. Using the combination of the [`sandbox.start`](#sandbox.start) and `invokeFunction` methods, plugin authors can implement a local development experience for plugin consumers.

#### Arguments

All arguments arrive as a bag of options with the following properties:

|Argument|Description|
|---|---|
|`src`|A string representing the fully qualified absolute path to where code for the Lambda exists locally|
|`payload`|JSON payload to deliver to the function|
|`callback`|Function with signature `function(error, result)` that is invoked with either the error or the result from the local function invocation|

#### Example usage of `invokeLambda`

The below plugin's `sandbox.start` method listens for the "I" keyboard keypress, prompts the user which of the plugin's Lambdas the user wants to invoke and what payload to deliver to the user, before using `invokeFunction` to invoke the Lambda code with the specified payload.

```javascript
let path = require('path')
let prompt = require('prompt')

module.exports = {
  functions: async function ({ arc, inventory }) {
    if (!arc.rules) return []
    const cwd = inventory.inv._project.src
    return arc.rules.map((rule) => {
      let src = path.join(cwd, 'src', 'rules', rule[0])
      return {
        src,
        body: `exports.handler = async function (event) {
  console.log(event)
}`
      }
    })
  },
  sandbox: {
    start: function IoTRulesServiceStart ({ arc, inventory, invokeFunction, services }, callback) {
      let rules = module.exports.functions({ arc, inventory }).map(rule => rule.src)
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
          invokeFunction({ src: response.rule, payload: response.payload }, function (err, result) {
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

## Example plugins

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
[router]: https://www.npmjs.com/package/router
[dynalite]: https://www.npmjs.com/package/dynalite
