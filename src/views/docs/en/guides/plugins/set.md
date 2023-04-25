---
title: '<code>set</code> plugins'
category: Plugins
description: '<code>set</code> cloud resource generator plugins'
---

`set` plugins generate various kinds of resources for Architect projects. Resource setters are small, synchronous methods that can create many common kinds of resources, from HTTP routes, to environment variables, to custom runtimes.

Any Lambdas or resources defined by a `set` plugin is treated by Architect as a first-class primitive. For example: if you build a plugin that creates a route with `set.http`, Architect would treat that route as though the user had actually added it to their [project manifest](/docs/en/get-started/project-manifest)'s [`@http` pragma](/docs/en/reference/project-manifest/http).


## Caveats

Unlike [workflow lifecycle plugins](./overview#workflow-hooks), which execute only when needed, all `set` plugins must execute every time Architect (or any of its modules) run. Thus, they are expected to be synchronous and fast.

Because of this, we advise against such things as filesystem reads and writes from within `set` plugins. Definitely do not start services, or run large, CPU intensive operations from within `set` plugins.

Additionally, it is worth noting that `set` plugins are among the very first things to run in any Architect execution. Because they are run before the rest of the project been enumerated, they are not passed a complete [Inventory](./inventory) object. If your plugin requires knowledge of your project, please access the `arc` property.


## Plugin parameters

All `set` methods are synchronous functions, and receive a single argument, which is an object containing the following properties:

| Property    | Type    | Description                                       |
|-------------|---------|---------------------------------------------------|
| `arc`       | object  | Raw Architect project object                      |
| `inventory` | object  | Partial [Inventory](./inventory) object           |


## Valid returns

All `set` methods can return a single resource object, and those that create resources (like `set.http`) can return an array of resource objects.

There is no limit to the number of resources a `set` plugin can return, however AWS does have limits on the number of resources in a CloudFormation deployment (and a hard cap on the size of a given CloudFormation document).

Generated resources that require a `src` property accept an absolute or relative file path. Additionally, file paths will be automatically platform normalized (so you do not have to use `path.join()` for other platforms if you're publicly publishing your plugin).

By default, Lambdas created by the `set` API are assumed to run the latest version of Node.js ([unless configured otherwise](#lambda.config))

---

# Pragmas

## `set.events`

Register async events (as in the [`@events`][events] pragma). Return a single object or an array of objects with the following properties:

| Property  | Type    | Description                                                         |
|-----------|---------|---------------------------------------------------------------------|
| `name`    | string  | Event name (follows [`@events` syntax][events])                     |
| `src`     | string  | Absolute or relative file path to the handler                       |
| `required`| boolean | Fail if plugin conflicts with project manifest (defaults to `false`)|

Example:

```javascript
// Return a single async event
module.exports = {
  set: {
    events ({ arc, inventory }) {
      return {
        name: 'an-async-event',
        src: __dirname + '/handler' // Points to a handler dir inside the plugin
      }
    }
  }
}
```


## `set.http`

Register HTTP routes (as in the [`@http`][htp] pragma). Return a single object or an array of objects with the following properties:

| Property  | Type    | Description                                                         |
|-----------|---------|---------------------------------------------------------------------|
| `method`  | string  | HTTP method (follows [`@http` syntax][http])                        |
| `path`    | string  | HTTP path (follows [`@http` syntax][http])                          |
| `src`     | string  | Absolute or relative file path to the handler                       |
| `required`| boolean | Fail if plugin conflicts with project manifest (defaults to `false`)|

Example:

```javascript
// Return multiple HTTP routes
module.exports = {
  set: {
    http ({ arc, inventory }) {
      let src = __dirname + '/handler'
      // Multiple Lambdas can use the same handler
      return [
        { method: 'get', path: '/foo', src },
        { method: 'put', name: '/bar', src }
      ]
    }
  }
}
```


## `set.proxy`

Set URLs for API Gateway to forward all requests by default; individual routes can be overridden by `@http` / `set.http`. Return a single object with the following properties:

| Property    | Type    | Description                                                 |
|-------------|---------|-------------------------------------------------------------|
| `testing`   | string  | URL to forward requests to from the testing environment     |
| `staging`   | string  | ... the same, but for the staging environment     |
| `production`| string  | ... the same, but for the production environment  |

Example:

```javascript
module.exports = {
  set: {
    proxy ({ arc, inventory }) {
      return {
        testing: 'https://testing-url.com',
        staging: 'https://staging-url.com',
        production: 'https://production-url.com',
      }
    }
  }
}
```


## `set.queues`

Register async event queues (as in the [`@queues`][queues] pragma). Return a single object or an array of objects with the following properties:

| Property  | Type    | Description                                                         |
|-----------|---------|---------------------------------------------------------------------|
| `name`    | string  | Event name (follows [`@queues` syntax][queues])                     |
| `src`     | string  | Absolute or relative file path to the handler                       |
| `required`| boolean | Fail if plugin conflicts with project manifest (defaults to `false`)|

Example:

```javascript
// Return a single async event queue
module.exports = {
  set: {
    queues ({ arc, inventory }) {
      return {
        name: 'a-queue',
        src: __dirname + '/handler' // Points to a handler dir inside the plugin
      }
    }
  }
}
```


## `set.scheduled`

Register scheduled event (as in the [`@scheduled`][scheduled] pragma). Return a single object or an array of objects with the following properties:

| Property  | Type    | Description                                                         |
|-----------|---------|---------------------------------------------------------------------|
| `name`    | string  | Event name (follows [`@scheduled` syntax][scheduled])               |
| `rate`    | string  | [Rate expression][sched-expr], cannot be used with `cron` property  |
| `cron`    | string  | [Cron expression][sched-expr], cannot be used with `rate` property  |
| `src`     | string  | Absolute or relative file path to the handler                       |
| `required`| boolean | Fail if plugin conflicts with project manifest (defaults to `false`)|

> Note: unlike in `@scheduled` pragma use, `rate` + `cron` properties should not be returned in parenthesis.

Example:

```javascript
// Return two scheduled events: one using rate syntax, and one using cron syntax
module.exports = {
  set: {
    scheduled ({ arc, inventory }) {
      let src = __dirname + '/handler'
      return [
        {
          name: 'scheduled-using-rate',
          rate: '1 day',
          src,
        },
        {
          name: 'scheduled-using-cron',
          cron: '15 10 * * ? *',
          src,
        }
      ]
    }
  }
}
```

## `set.shared`

Set a custom source path for Architect's code sharing system ([`@shared`][shared]). Return a single object with the following property:

| Property  | Type    | Description                                               |
|-----------|---------|-----------------------------------------------------------|
| `src`     | string  | Absolute or relative file path to the shared code path    |
| `required`| boolean | Enforce the existence of `src` folder (defaults to `false`) |

Example:

```javascript
module.exports = {
  set: {
    shared ({ arc, inventory }) {
      return {
        src: __dirname + '/shared-libs'
      }
    }
  }
}
```


## `set.static`

Modify settings for static asset handling. Return a single object with the following properties:

| Property      | Type    | Description                                                     |
|---------------|---------|-----------------------------------------------------------------|
| `compression` | string  | Enable static asset compression; `true` or `br` compresses with brotli, or `gzip` compresses with gzip |
| `fingerprint` | boolean | Enable Architect's static asset fingerprinting; also accepts `external` (string) to assume assets have filenames fingerprinted by another tool or system |
| `folder`      | string  | Relative file path of static asset dir (defaults to `public`)   |
| `ignore`      | array   | File names or paths within `folder` to ignore during deployment |
| `prefix`      | string  | Path prefix for publishing assets to S3                         |
| `prune`       | boolean | Enable Architect to prune S3 files not found within `folder`    |
| `spa`         | boolean | Enable single page app (SPA) mode (defaults to `false`)         |

Example:

```javascript
module.exports = {
  set: {
    static ({ arc, inventory }) {
      return {
        fingerprint: true,
        folder: 'static-assets',
      }
    }
  }
}
```


## `set.tables`

Register DynamoDB tables (as in the [`@tables`][tables]) pragma). Return a single object or an array of objects with the following properties:

| Property            | Type    | Required  | Description                                  |
|---------------------|---------|-----------|-----------------------------------------------------|
| `name`              | string  | Yes       | Table name (follows [`@tables` syntax][tables]) |
| `partitionKey`      | string  | Yes       | Partition key name |
| `partitionKeyType`  | string  | Yes       | Partition key type (`string` or `number`) |
| `sortKey`           | string  | No        | Sort key name |
| `sortKeyType`       | string  | No        | Sort key type (`string` or `number`) |
| `stream`            | boolean | No        | Enable DynamoDB stream (see [`@tables-streams`][tables-streams]) |
| `ttl`               | string  | No        | Time-to-live timestamp column to expire records
| `encrypt`           | boolean | No        | Enable server-side encryption with AWS KMS  |
| `pitr`              | boolean | No        | Enable point-in-time recovery |

Example:

```javascript
// Return a single table
module.exports = {
  set: {
    tables ({ arc, inventory }) {
      return {
        name: 'a-table',
        partitionKey: 'id',
        partitionKeyType: 'string',
        // These are all optional
        sortKey: 'ts',
        sortKeyType: 'number',
        pitr: true,
      }
    }
  }
}
```


## `set['tables-indexes']`

Register DynamoDB table indexes (as in the [`@tables-indexes`][tables-indexes]) pragma). Return a single object or an array of objects with the following properties:

| Property            | Type    | Required  | Description                                  |
|---------------------|---------|-----------|-----------------------------------------------------|
| `name`              | string  | Yes       | Table name (follows [`@tables` syntax][tables]) |
| `partitionKey`      | string  | Yes       | Partition key name |
| `partitionKeyType`  | string  | Yes       | Partition key type (`string` or `number`) |
| `sortKey`           | string  | No        | Sort key name |
| `sortKeyType`       | string  | No        | Sort key type (`string` or `number`) |
| `indexName`         | boolean | No        | Custom index name |

Example:

```javascript
// Return a single table index
module.exports = {
  set: {
    'tables-indexes': ({ arc, inventory }) => {
      return {
        name: 'a-table',
        partitionKey: 'secondary-index',
        partitionKeyType: 'string',
        indexName: 'my-custom-index-name', // Optional!
      }
    }
  }
}
```


## `set['tables-streams']`

Register DynamoDB event streams (as in the [`@tables-streams`][tables-streams]) pragma). Return a single object or an array of objects with the following properties:

| Property  | Type    | Description                                                         |
|-----------|---------|---------------------------------------------------------------------|
| `name`    | string  | Event name (follows [`@tables-streams` syntax][tables-streams])     |
| `table`   | string  | Logical DynamoDB table name (as in your project manifest)           |
| `src`     | string  | Absolute or relative file path to the handler                       |
| `required`| boolean | Fail if plugin conflicts with project manifest (defaults to `false`)|

Example:

```javascript
// Return a single table stream
module.exports = {
  set: {
    'tables-streams': ({ arc, inventory }) => {
      return {
        name: 'a-table-stream-event',
        table: 'my-logical-table-name',
        src: __dirname + '/handler' // Points to a handler dir inside the plugin
      }
    }
  }
}
```


## `set.views`

Set a custom source path for Architect's frontend views code sharing system ([`@views`][views]). Return a single object with the following property:

| Property  | Type    | Description                                               |
|-----------|---------|-----------------------------------------------------------|
| `src`     | string  | Absolute or relative file path to the views code path     |
| `required`| boolean | Enforce the existence of `src` folder (defaults to `false`) |

Example:

```javascript
module.exports = {
  set: {
    views ({ arc, inventory }) {
      return {
        src: 'app/views'
      }
    }
  }
}
```


## `set.ws`

Register WebSocket routes (as in the [`@ws`][ws] pragma). Return a single object or an array of objects with the following properties:

| Property  | Type    | Description                                                         |
|-----------|---------|---------------------------------------------------------------------|
| `name`    | string  | Route name (follows [`@ws` syntax][ws])                             |
| `src`     | string  | Absolute or relative file path to the handler                       |
| `required`| boolean | Fail if plugin conflicts with project manifest (defaults to `false`)|

> Note: WebSockets is required to have three default routes (`$connect`, `$disconnect`, `$default`), which Architect populates with the addition of the `@ws` pragma. If the consumer of your plugin does not specify `@ws` in their manifest, using `set.ws` will infer it for them; you should not attempt to return any of the default routes in your `set.ws` plugin.

Example:

```javascript
// Return a single WebSocket route
module.exports = {
  set: {
    ws ({ arc, inventory }) {
      return {
        name: 'refresh',
        src: __dirname + '/handler' // Points to a handler dir inside the plugin
      }
    }
  }
}
```


---

# Resources


## `set.env`

Register environment variables for all Lambdas. To create an environment variable for all Lambdas, return an object with names and values. To create an environment variable specific to Architect's built in `testing`, `staging`, and `production` environments, return an object containing one or more of those properties, each containing an object with names and value.

> Note: if an object or array is passed as a value, the `set.env` API will automatically JSON-serialize it into your environment variable.

Examples:

```javascript
// Return an environment variable for all Lambdas
module.exports = {
  set: {
    env ({ arc, inventory }) {
      return {
        API_SECRET: process.env.API_SECRET // Handy for exporting secrets in CI/CD
      }
    }
  }
}
```

```javascript
// Return a different environment variables for different stages
module.exports = {
  set: {
    env ({ arc, inventory }) {
      return {
        testing: {
          API_SECRET: 'sample-key'
        },
        staging: {
          API_SECRET: process.env.API_SECRET
        },
        production: {
          API_SECRET: process.env.API_SECRET
        },
      }
    }
  }
}
```


## `set.customLambdas`

Register bare Lambdas without a pre-associated event source. `set.customLambdas` pairs nicely with [`deploy.start`](./deploy#deploy-start), where you can customize a custom Lambda's event source in CloudFormation. Return a single object or an array of objects with the following properties:

| Property  | Type    | Description                                     |
|-----------|---------|-------------------------------------------------|
| `name`    | string  | Bare Lambda name                                |
| `src`     | string  | Absolute or relative file path to the handler   |

Example:

```javascript
// Return a single async event
module.exports = { set: {
  customLambdas: ({ arc, inventory }) => {
    return {
      name: 'a-custom-lambda',
      src: __dirname + '/handler' // Points to a handler dir inside the plugin
    }
  }
} }
```


## `set.runtimes`

Register custom runtimes for Lambdas. Return a single object or an array of objects. Each runtime type has its own set of requirements; `transpiled` and `compiled` are currently supported, [`interpeted` is coming soon](https://github.com/architect/architect/issues/1295).

No matter which runtime is designated, the source for each Lambda lives within the typical Architect project structure, whether using Architect conventions (e.g. `src/http/$method-$path`) or custom `src` paths.

> Note: Architect's built in [shared code affordances](/docs/en/guides/developer-experience/sharing-code) are permanently disabled for transpiled and compiled handlers and their build artifacts.


### `transpiled`

Lambdas with a `transpiled` runtime (such as those using TypeScript) undergo a transpilation step that publishes build artifacts to separate dist folder; artifacts in the dist folder are, as one would expect, composed in a corresponding interpreted language (e.g. JavaScript).

For example, using [Architect TypeScript](https://github.com/architect/plugin-typescript), the `get /foo` handler is authored in `src/http/get-foo/index.ts`, and automatically transpiled to (and run / deployed from) `.build/http/get-foo/index.js`.

A plugin setting a `transpiled` runtime must return an object (or array of objects) containing the following properties:

| Property      | Type    | Required  | Description                                   |
|---------------|---------|-----------|-----------------------------------------------|
| `name`        | string  | Yes       | Custom runtime name                           |
| `type`        | string  | Yes       | Must be `transpiled`                          |
| `baseRuntime` | string  | Yes       | Lambda [runtime identifier or alias][runtime] |
| `build`       | string  | No        | Relative build dir path; defaults to `build`  |

> Note: Architect's built in [shared code affordances](/docs/en/guides/developer-experience/sharing-code) are permanently disabled for transpiled output.

Example:

```javascript
// Enable a custom build directory with a custom runtime pragma (`@typescript`)
module.exports = {
  set: {
    runtimes ({ arc, inventory }) {
      let { arc } = inventory.inv._project
      let build = '.build'
      if (arc.typescript) {
        arc.typescript.forEach(s => {
          if (Array.isArray(s) && s[0] === 'build' && typeof s[1] === 'string') {
            build = s[1]
          }
        })
      }
      return {
        name: 'typescript',
        type: 'transpiled',
        baseRuntime: 'nodejs18.x',
        build,
      }
    }
  }
}
```


### `compiled`

Lambdas with a `compiled` runtime (such as those using Rust, Go, Java, etc.) undergo a compilation step that publishes build artifacts to separate dist folder. Per Lambda conventions, this folder is expected to contain a binary artifact called `bootstrap` that will serve as the Lambda handler ([reference](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html)).

> Note: When running in Sandbox, your plugin should account for compiling the `bootstrap` for your local system architecture; likewise, during deployment the plugin should ensure the compile target is Amazon Linux 2 (aka `AL2`). A live AWS deployment is indicated by a `inventory.inv._arc.deployStage` value.

For example, using [Architect Rust](https://github.com/architect/plugin-rust), the `get /foo` handler is authored in `src/http/get-foo/src/main.rs`, and automatically compiled to (and run / deployed from) `.build/http/get-foo/debug/bootstrap`. Remember, during production deploys that dist path may automatically change per your compiler's behavior.

Because `cargo`'s build tooling automatically compiles the `bootstrap` file to a subfolder called `debug`, this plugin makes use of the `buildSubpath` property. (Without it, Architect would look for (and fail to find) your handler at `.build/http/get-foo/bootstrap`.)

A plugin setting a `compiled` runtime must return an object (or array of objects) containing the following properties:

| Property        | Type    | Required  | Description                                     |
|-----------------|---------|-----------|-------------------------------------------------|
| `name`          | string  | Yes       | Custom runtime name                             |
| `type`          | string  | Yes       | Must be `compiled`                              |
| `baseRuntime`   | string  | No        | Lambda [runtime identifier or alias][runtime]   |
| `build`         | string  | No        | Relative build dir path; defaults to `build`    |
| `buildSubpath`  | string  | No        | Optional subpath conforming to compiler output  |


Example:

```javascript
// Set `buildSubpath` based on whether the compiler is building locally or for AWS release
let { join } = require('path')
module.exports = {
  set: {
    runtimes ({ arc, inventory }) {
      let { deployStage } = inventory.inv._arc
      let buildSubpath = deployStage ? 'release' : 'debug'
      return {
        name: 'rust',
        type: 'compiled',
        build,
        buildSubpath,
      }
    }
  }
}
```

---

## Advanced usage

### `lambda.config`

Lambdas created by `set` plugins are treated like any other Lambda in the system, which means they are subject to project defaults. This may be convenient: if the project using your Node.js handler created by a `set` plugin is also by default Node.js, you don't have to do anything.

However, if you are publishing your project publicly, you cannot assume all consumers of your plugin are running the same runtime as you. In this case, and other cases where greater customization and specificity is required, you should include a `config` property in your `set` Lambdas.

Any of the `set` APIs that create Lambdas (`events`, `http`, `customLambdas`, etc.) accept an optional `config` object with named properties (and values) that are the same as those found in [function config](/docs/en/reference/configuration/function-config).

These include: `runtime`, `memory`, `timeout`, `concurrency`, `architecture`, and more, and are subject to the same limitations as any other Lambda (e.g. if specifying `layers`, only 5 may be specified, and they must be in the same region as the app is deployed).

Example:

```javascript
// Returning this event Lambda assumes user project defaults > Architect defaults
// If the project specifies `@aws runtime python3.9`, and your handler is JS, it will not run
module.exports = {
  set: {
    events ({ arc, inventory }) {
      return {
        name: 'an-async-event',
        src: __dirname + '/handler'
      }
    }
  }
}
```

```javascript
// Returning a `config` property provides control over the configuration of the returned Lambda
module.exports = {
  set: {
    events ({ arc, inventory }) {
      return {
        name: 'an-async-event',
        src: __dirname + '/handler',
        config: {
          runtime: 'nodejs14.x',
          memory: 3008, // in MB
          timeout: 10, // in seconds
        }
      }
    }
  }
}
```


### Where `set` Lambdas can live

Like those created by modifying a project manifest, Lambdas (and their handlers) specified by `set` plugins can live in the user's project. We'll call those [userland Lambdas](#userland-lambdas).

However, `set` plugins can also point to prepackaged functions and live inside a published plugin that do not allow for customization, because they're intended to do a specific job on behalf of the plugin consumer. We'll call those [pluginland Lambdas](#pluginland-lambdas).

Let's take a look at some examples of how this might work.


#### Userland Lambdas

Say you're writing a plugin called `local-s3`, which attaches Lambdas to specific S3 events. Your users need to be able to define and maintain the logic executed by S3 event Lambdas provisioned by your plugin. You may ask your user to update their project to define some handlers in a new custom pragma (`@local-s3`):

```arc
@plugins
local-s3

@local-s3
create
update
delete
```

Since these Lambdas live in userland, `set.customLambdas` method might look something like this:

```javascript
module.exports = {
  set: {
    customLambdas ({ arc, inventory }) {
      let localS3 = arc['local-s3']
      if (!localS3 || !Array.isArray(localS3)) return

      // Create an abritrary number of plugins from the Arc manifest
      let lambdas = localS3.map((item) => {
        let name = item[0]
        return {
          name,
          src: `src/local-s3/${name}`
        }
      })
      return lambdas
    }
  }
}
```

This approach puts the Lambdas squarely in the realm of your plugin consumers, and empowers them to make customize the resources you're managing with the plugin.


#### Pluginland Lambdas

Now let's say you're writing a plugin called `autobundle` to accomplish a specific task: automatically bundling JS from your project's [views directory](/docs/en/guides/developer-experience/sharing-code) at `get /_bundle/:entry`. Your users expect to consume this plugin like any other dependency, having it dropped right in and fully maintained by the plugin author.

Assuming you published your project as `arc-plugin-autobundle`, you might want your `set` plugin to look something like this:

```javascript
// node_modules/arc-plugin-autobundle/index.js
module.exports = {
  set: {
    http ({ arc, inventory }) {
      return {
        method: 'get',
        path: 'get /_bundle/:entry',
        // Assuming a handler at `node_modules/arc-plugin-autobundle/handler/index.js`
        src: __dirname + '/handler'
      }
    }
  }
}
```

Returning the Lambda above, Architect will look for your `autobundle` Lambda handler at `node_modules/arc-plugin-autobundle/handler/index.js`. Should your handler have its own dependencies, you must declare them in your plugin's `package.json` file.


[events]: /docs/en/reference/project-manifest/events#syntax
[http]: /docs/en/reference/project-manifest/http#syntax
[proxy]: /docs/en/reference/project-manifest/proxy#syntax
[queues]: /docs/en/reference/project-manifest/queues#syntax
[scheduled]: /docs/en/reference/project-manifest/scheduled#syntax
[shared]: /docs/en/reference/project-manifest/shared#syntax
[static]: /docs/en/reference/project-manifest/static#syntax
[tables-indexes]: /docs/en/reference/project-manifest/tables-indexes#syntax
[tables-streams]: /docs/en/reference/project-manifest/tables-streams#syntax
[tables]: /docs/en/reference/project-manifest/tables#syntax
[views]: /docs/en/reference/project-manifest/views#syntax
[ws]: /docs/en/reference/project-manifest/ws#syntax
[sched-expr]: https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents-expressions.html
[runtime]: /docs/en/reference/configuration/function-config#runtime
