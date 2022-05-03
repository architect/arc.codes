---
title: '<code>deploy</code> plugins'
category: Plugins
description: '<code>deploy</code> lifecycle hook plugins'
---

`deploy` lifecycle hook plugins expose functionality to extend the capabilities of Architect deployments.


## Plugin parameters

All `deploy` methods accept async or synchronous functions, and receive a single argument, which is an object containing the following properties:

| Property          | Type    | Description                                       |
|-------------------|---------|---------------------------------------------------|
| `arc`             | object  | Raw Architect project object                      |
| `cloudformation`  | object  | CloudFormation deployment                         |
| `dryRun`          | boolean | `true` if `--dry-run` or `--eject` flags are used |
| `inventory`       | object  | [Inventory](./inventory) object                   |
| `stage`           | string  | `testing`, `staging` or `production`              |


## `deploy.start`

Run arbitrary pre-deploy operations + customize CloudFormation. (This API is a descendant of `@macros` extensions, with added functionality, and within the broader plugins context.)

Example:

```javascript
// Do something only for staging deployments
module.exports = { deploy: {
  start: async ({ arc, cloudformation, dryRun, inventory, stage }) => {
    if (stage !== 'staging') return

    let config = await getSomeConfig()
    cloudformation.Resources.whatever = config
    // The returned mutated CloudFormation document will be passed to any other `deploy.start` plugins in sequence
    return cloudformation
  }
} }
```


## `deploy.services`

Hook into Architect's [service discovery](/docs/en/reference/runtime-helpers/node.js#arc.services) to create references to custom resources, or populate config data. Note: each returned service object can only store up to 4KB of data (as a string).

Examples:

```javascript
// Create some identifiers associated with custom S3 bucket credentials
module.exports = { deploy: {
  services: async ({ arc, cloudformation, dryRun, inventory, stage }) => {
    // If the user isn't using this plugin, you can just return
    if (!arc['myS3Bucket']) return

    const { inv } = inventory
    // Stage will equal 'testing' when run by Sandbox, otherwise will be `staging` or `production` in a `deploy` context
    const isLocal = stage === 'testing'
    const bucketName = `${inv.app}-newS3Bucket`
    // Here we'll return both a string literal (`bucketName`) and resource identifiers to be populated by CloudFormation
    return {
      bucketName,
      accessKey: isLocal ? 'local' : { Ref: 'MyS3BucketCreds' },
      secretKey: isLocal ? 'local' : { 'Fn::GetAtt': [ 'MyS3BucketCreds', 'SecretKey' ] }
    }
  }
} }
```

```javascript
// Make up fo 4KB of configuration data available for your Lambdas to fetch via arc.services()
module.exports = { deploy: {
  services: async ({ arc, cloudformation, dryRun, inventory, stage }) => {
    let config = await getSomeConfig()
    return { config: JSON.stringify(config) }
  }
} }
```


## `deploy.target` (in beta)

Bypass CloudFormation deployment to AWS, and ship the project to an AWS intermediary or provider of your choosing. This endpoint enables Architect to be used to develop and deliver applications without relying solely on AWS CloudFormation.

> Note: this interface should be considered in beta and subject to change; specifically in relation to how Architect otherwise enacts post-deployment operations (such as static asset publishing).

Example:

```javascript
module.exports = { deploy: {
  target: async ({ arc, cloudformation, dryRun, inventory, stage }) => {
    if (dryRun) return

    deployToAnotherService({ inventory, stage })
  }
} }
```


## `deploy.end`

Run arbitrary post-deploy operations.

Example:

```javascript
const { rm } = require('fs/promises')
module.exports = { deploy: {
  end: async ({ arc, cloudformation, dryRun, inventory, stage }) => {
    await rm(someBuildArtifact)
  }
} }
```
