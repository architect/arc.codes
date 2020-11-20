---
title: Extending Architect with macros
description: How to use Architect Macros to define or modify resources with CloudFormation
sections:
  - Overview
  - CloudFormation
  - Deploy custom resources with determinism
  - Walkthrough - Provision public S3 buckets
---

## Overview

Architect provides several primitives for your application which work out of the box. However, you can still access other AWS services with macros which modify the CloudFormation stack when your project is deployed. Any service that supports CloudFormation can be provisioned with a macro. Architect macros are JavaScript functions that are given a parsed `app.arc` file, a target CloudFormation template, and a stage. It returns a new CloudFormation template with your custom resources attached, which will then be deployed. This pattern allows for Architect to even extend itself! 

## CloudFormation

CloudFormation provides a common language for developers to model and provision AWS resources and services. Many, but not all services are given some level of control with CloudFormation. Architect parses the `app.arc` file and ultimately produces a CloudFormation stack. This stack tells AWS what you need and how it should be configured. Using services that are outside of the Architect app primitives will require a macro to instantiate.


## Deploy custom resources with determinism

In this tutorial we will go over a macro to create any number of S3 buckets with public permissions. Often we need more S3 buckets to hold objects or other artifacts. Using a macro will create buckets with determinism that are always available, but not directly managed by you.

If you want to just use this macro, [follow the install instructions on GitHub](https://github.com/architect/macro-storage-public/blob/master/index.js).

## Example - Provision public S3 buckets

1.) We will start with a fresh project that we can create from the terminal.

```bash
mkdir arc-macro
cd arc-macro
arc init
```

2.) Now let's add a [utility library](https://github.com/architect/utils/blob/master/to-logical-id/index.js).

```bash
npm init -y
npm install @architect/utils
```

3.) Open up the `app.arc` file and modify it with the following: 

```bash
## app.arc

# app namespace
@app
macro-storage-app

# http get index route
@http
get /

# declaration of macro logic file name
@macros
macro-storage-public

# declaration of any number of S3 bucket names
@storage-public
public-data
sharedinfo

# aws profile information
@aws
profile default
region us-west-1
```

4.) Create a `/src/macros` folder with two files in it, `index.js` and `validate.js`. Architect will look for macros to run in either `/src/macros/filename` or `node_modules/macro-module-name`

```javascript
// src/macros/index.js

let { toLogicalID } = require('@architect/utils')
let validate = require('./validate')

// Architect checks for macros before it deploys your CloudFormation stack.
// Macros receive the current parsed app.arc file and the target CloudFormation template
// These two arguments are provided at deploy time by Architect.
module.exports = function storage(arc, cfn) {

  // assigns the @storage-public primitive as an array from the app.arc file
  let storagePublic = arc['storage-public']

  // Only run if @storage-public is defined
  if (storagePublic) {

    // Validate the S3 bucket names don't contain special characters
    validate(storagePublic)

    // First thing we do is declare an IAM role for our macro resources with CloudFormation that will be appended to the rest of your project.
    // We suggest you follow the single responsibility model and only give this new resource the permissions it needs.
    // In this case, we need to allow access to the S3 service
    cfn.Resources.PublicStorageMacroPolicy = {
      Type: 'AWS::IAM::Policy',
      DependsOn: 'Role',
      Properties: {
        PolicyName: 'PublicStorageMacroPolicy',
        PolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Action: [ 's3:*' ],
            Resource: []
          }]
        },
        Roles: [{ 'Ref': 'Role' }],
      }
    }

    let resKeys = Object.keys(cfn.Resources)

    // storagePublic is an array of names for our public buckets
    storagePublic.forEach(bucket=> {

      // Resource names
      // toLogicalID will turn "public-data" into "PublicData" 
      let ID = toLogicalID(bucket)
      let Bucket = `${ID}Bucket`
      let BucketParam = `${ID}Param`

      // Create bucket names as a "ARC_STORAGE_PUBLIC_<bucketname>" environment variable.
      // Your Lambda functions would read this environment variable at runtime.
      resKeys.forEach((k) => {
        let BUCKET = `ARC_STORAGE_PUBLIC_${bucket.replace(/-/g, '_').toUpperCase()}`
        if (cfn.Resources[k].Type === 'AWS::Serverless::Function') {
          cfn.Resources[k].Properties.Environment.Variables[BUCKET] = { Ref: Bucket }
        }
      })

      // Add standard CloudFormation resources to create an S3 bucket with public permissions
      cfn.Resources[Bucket] = {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          AccessControl: 'PublicRead',
          PublicAccessBlockConfiguration: {
            // Displayed as: 'Block public access to buckets and objects granted through new access control lists (ACLs)'
            BlockPublicAcls : false,
            // Displayed as: 'Block public access to buckets and objects granted through new public bucket or access point policies'
            BlockPublicPolicy : false,
            // Displayed as: 'Block public access to buckets and objects granted through any access control lists (ACLs)'
            IgnorePublicAcls : false,
            // Displayed as: 'Block public and cross-account access to buckets and objects through any public bucket or access point policies'
            RestrictPublicBuckets : false
          },
        }
      }

      // Add name to SSM params for runtime discovery so we don't have to remember the complicated name
      cfn.Resources[BucketParam] = {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: {
            'Fn::Sub': [
              '/${AWS::StackName}/storage-public/${bucket}',
              { bucket }
            ]
          },
          Value: { Ref: Bucket }
        }
      }

      // Add IAM policy for least-priv runtime access
      let doc = cfn.Resources.PublicStorageMacroPolicy.Properties.PolicyDocument.Statement[0]
      doc.Resource.push({
        'Fn::Sub': [
          'arn:aws:s3:::${bucket}',
          { bucket: { Ref: Bucket } }
        ]
      })
      doc.Resource.push({
        'Fn::Sub': [
          'arn:aws:s3:::${bucket}/*',
          { bucket: { Ref: Bucket } }
        ]
      })

    })
  }

  // returns the completed CloudFormation template for deployment.
  return cfn
}
```

```javascript
// src/macros/validate.js
// validates that the bucket name does not contain special characters

module.exports = function validateStorage (storage) {
  for (let item of storage) {
    let valid = /^[a-zA-Z0-9_-]+$/g.test(item)
    if (!valid) {
      throw Error(`@storage-public name is invalid, must be [a-zA-Z0-9_-]: ${item}`)
    }
  }
}
```

That might seem like a lot at first, but Architect uses your app.arc file in a very similar way to generate CloudFormation on your behalf. When you want to get your hands dirty with direct CloudFormation templates, a Macro will be your best friend.

5.) Dry run and final deploy

When using custom macros to alter CloudFormation, or even checking the output, you can deploy with `--dry-run` flag to see the resulting `sam.json`. When you're ready to deploy, run `arc deploy` and go take a look at all those lovely S3 buckets that were created on your behalf. 


If you'd like to use this macro, you can include it with `npm install @architect/macro-storage-public` and you can find it's documentation here: [https://github.com/architect/macro-storage-public](https://github.com/architect/macro-storage-public)

