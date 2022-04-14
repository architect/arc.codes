---
title: Deploying from an EC2 instance
category: Continuous integration
description: Setting up Architect project deployment from EC2 with proper IAM roles.
---

If you're deploying from a CI/CD pipeline that runs on AWS EC2 instances and uses [IAM roles for EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) to define the pipeline's permissions, you'll need to generate temporary credentials via the AWS SDK and use them to either define the AWS env vars (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN`). Once the credentials are in a form that Architect can read, you can call the deploy command as normal.

Below is a basic example using the AWS JavaScript SDK that deploys a stack to the staging environment:

```javascript
const { exec } = require('child_process')
const AWS = require('aws-sdk')

// Assumes that you have a 'build' script defined in package.json for building
// frontend assets.
const DEPLOY_COMMAND = 'npm run build && npx arc deploy'

const deploy = () => {
  // JS-specific: you need to execute the deployment command or script in a subprocess
  // in order to have access to the updated env vars.
  return exec(DEPLOY_COMMAND, (error, stdout, stderr) => {
    console.log(stdout)

    if (error) {
      console.error(stderr)
      console.error(error)
      process.exit(error.code)
    }
  })
}

const deployWithAwsCredentials = (error, credentials) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  }

  process.env.AWS_ACCESS_KEY_ID =
    process.env.AWS_ACCESS_KEY_ID || credentials.accessKeyId
  process.env.AWS_SECRET_ACCESS_KEY =
    process.env.AWS_SECRET_ACCESS_KEY || credentials.secretAccessKey
  process.env.AWS_SESSION_TOKEN =
    process.env.AWS_SESSION_TOKEN || credentials.sessionToken

  return deploy()
}

AWS.config.getCredentials(deployWithAwsCredentials)
```
